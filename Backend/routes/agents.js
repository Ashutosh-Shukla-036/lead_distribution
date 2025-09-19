import express from 'express';
import bcrypt from 'bcrypt';
import Agent from '../models/Agent.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/agents
 * Protected. Create a new agent.
 * Body: { name, email, mobile, password }
 */
router.post('/add', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    console.log(name, email, mobile, password);
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Agent.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Agent with email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const agent = new Agent({ name, email, mobile, password: hash });
    await agent.save();

    const { password: _, ...agentSafe } = agent.toObject();

    // ✅ wrap response for consistency
    return res.json({ agent: agentSafe });
  } catch (err) {
    console.error('Create agent error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/agents
 * Protected. Get all agents (without passwords).
 */
router.get("/get", auth, async (req, res) => {
  try {
    const agents = await Agent.find().select("-password").sort({ createdAt: -1 });
    res.json(agents); // ✅ return array, not { agents }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
