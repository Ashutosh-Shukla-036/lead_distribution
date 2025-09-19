"use client";
import { motion } from "framer-motion";

export default function LeadTable({ leads }) {
  return (
    <motion.table
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full mt-6 border-collapse shadow-lg rounded-xl overflow-hidden"
    >
      <thead className="bg-indigo-600 text-white">
        <tr>
          <th className="px-4 py-2">First Name</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Notes</th>
          <th className="px-4 py-2">Agent</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead, i) => (
          <tr key={i} className="bg-white even:bg-gray-100 text-center">
            <td className="px-4 py-2">{lead.firstName}</td>
            <td className="px-4 py-2">{lead.phone}</td>
            <td className="px-4 py-2">{lead.notes}</td>
            <td className="px-4 py-2">{lead.assignedTo?.name}</td>
          </tr>
        ))}
      </tbody>
    </motion.table>
  );
}
