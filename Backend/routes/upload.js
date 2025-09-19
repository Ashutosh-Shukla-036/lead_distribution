import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import * as XLSX from "xlsx";
import Lead from "../models/Lead.js";
import Agent from "../models/Agent.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// multer in-memory storage
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedExt = /\.(csv|xlsx|xls)$/i;
  if (allowedExt.test(file.originalname)) cb(null, true);
  else cb(new Error("Only csv, xlsx, xls files are allowed"));
}

const upload = multer({ storage, fileFilter });

/**
 * Normalize a row to { firstName, phone, notes }
 */
function normalizeRow(r) {
  return {
    firstName: r.FirstName ?? r.firstname ?? r["first name"] ?? r.Name ?? "",
    phone: r.Phone ?? r.phone ?? r["phone number"] ?? r.ph ?? "",
    notes: r.Notes ?? r.notes ?? "",
  };
}

/**
 * POST /api/upload/file
 * Accept CSV/XLS/XLSX → parse in memory → validate → save → distribute
 */
router.post("/file", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File required" });

  const original = req.file.originalname.toLowerCase();
  let rows = [];

  try {
    if (original.endsWith(".csv")) {
      // Parse CSV from buffer
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);

      rows = await new Promise((resolve, reject) => {
        const data = [];
        readable
          .pipe(csv())
          .on("data", (d) => data.push(d))
          .on("end", () => resolve(data))
          .on("error", (err) => reject(err));
      });
    } else if (original.endsWith(".xls") || original.endsWith(".xlsx")) {
      // Parse Excel using xlsx
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    if (rows.length === 0)
      return res.status(400).json({ message: "File is empty or invalid format" });

    // Normalize + validate
    const normalized = rows.map(normalizeRow);
    for (let i = 0; i < normalized.length; i++) {
      if (!normalized[i].firstName || !normalized[i].phone) {
        return res.status(400).json({
          message: `Row ${i + 1} missing required fields (firstName/phone)`,
        });
      }
    }

    // Fetch up to 5 agents
    const agents = await Agent.find().limit(5).sort({ createdAt: 1 });
    if (!agents || agents.length === 0) {
      return res.status(400).json({ message: "No agents available to assign leads" });
    }

    const targetCount = Math.min(5, agents.length);
    const assignments = Array.from({ length: targetCount }, () => []);

    // Round-robin distribution
    for (let idx = 0; idx < normalized.length; idx++) {
      const agentIndex = idx % targetCount;
      assignments[agentIndex].push(normalized[idx]);
    }

    // Save leads
    const saves = [];
    for (let i = 0; i < targetCount; i++) {
      const agent = agents[i];
      for (const item of assignments[i]) {
        saves.push(
          new Lead({
            firstName: item.firstName,
            phone: item.phone,
            notes: item.notes,
            assignedTo: agent._id,
          }).save()
        );
      }
    }
    await Promise.all(saves);

    return res.json({
      message: "Upload & distribution successful",
      totalRows: normalized.length,
      distributedTo: targetCount,
    });
  } catch (err) {
    console.error("Upload error", err);
    return res.status(500).json({ message: "Server error while processing file" });
  }
});

/**
 * GET /api/upload/distributed
 * Returns leads grouped by agent
 */
router.get("/distributed", auth, async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email mobile")
      .sort({ uploadedAt: -1 });

    const grouped = {};
    leads.forEach((l) => {
      const key = l.assignedTo ? String(l.assignedTo._id) : "unassigned";
      if (!grouped[key]) grouped[key] = { agent: l.assignedTo ?? null, leads: [] };
      grouped[key].leads.push(l);
    });

    return res.json(grouped);
  } catch (err) {
    console.error("Get distributed error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
