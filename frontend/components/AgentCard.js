"use client";
import { motion } from "framer-motion";

export default function AgentCard({ agent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass p-4 rounded-xl shadow-md text-center"
    >
      <h3 className="text-xl font-bold text-indigo-700">{agent.name}</h3>
      <p className="text-gray-600">{agent.email}</p>
      <p className="text-sm text-gray-500">{agent.mobile}</p>
    </motion.div>
  );
}
