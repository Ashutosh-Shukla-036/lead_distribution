"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useSetRecoilState } from "recoil";
import { alertAtom } from "@/state/alertAtom";
import { motion } from "framer-motion";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const setAlert = useSetRecoilState(alertAtom);

  // ✅ validate file type
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (
      !validTypes.includes(selected.type) &&
      !selected.name.match(/\.(csv|xls|xlsx)$/i)
    ) {
      setAlert({ type: "error", message: "Only CSV, XLS, XLSX files allowed ❌" });
      e.target.value = null; // reset input
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return setAlert({ type: "error", message: "Select a file first!" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload/file", formData);
      setAlert({ type: "success", message: "File uploaded & distributed ✅" });
      setFile(null); // reset after upload
    } catch {
      setAlert({ type: "error", message: "Upload failed ❌" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl text-center shadow-md"
    >
      <h2 className="text-lg font-bold mb-4">Upload Leads</h2>

      {/* File Input */}
      <input
        type="file"
        accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`mt-4 px-6 py-2 rounded-lg text-white transition 
          ${file ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Upload
      </button>
    </motion.div>
  );
}
