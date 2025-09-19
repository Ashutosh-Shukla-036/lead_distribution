"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "@/state/authAtom";
import { alertAtom } from "@/state/alertAtom";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import AgentCard from "@/components/AgentCard";
import FileUpload from "@/components/FileUpload";
import LeadTable from "@/components/LeadTable";
import { motion } from "framer-motion";
import AddAgentForm from "@/components/AddAgentForm";

export default function DashboardPage() {
  const auth = useRecoilValue(authState);
  const setAlert = useSetRecoilState(alertAtom);
  const router = useRouter();

  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // ✅ Fix hydration: only render client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔒 Protect route
  useEffect(() => {
    if (mounted && !auth.isAuthenticated) {
      router.replace("/login");
    }
  }, [auth, router, mounted]);

  // fetch data
  useEffect(() => {
    if (!mounted || !auth.isAuthenticated) return;

    async function fetchData() {
      try {
        setLoading(true);

        // ✅ backend returns array, not { agents }
        const a = await api.get("/agents/get", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setAgents(Array.isArray(a.data) ? a.data : []);

        const l = await api.get("/upload/distributed", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setLeads(
          l.data ? Object.values(l.data).flatMap((g) => g.leads) : []
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setAlert({
          type: "error",
          message: "❌ Failed to load dashboard data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [auth, mounted, setAlert]);

  if (!mounted) return null; // ✅ prevent hydration mismatch
  if (!auth.isAuthenticated) return null; // block UI flicker

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <Navbar />

      <div className="mt-20">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Dashboard</h1>

        {/* Add Agent Form */}
        <AddAgentForm
          onAgentAdded={(newAgent) =>
            setAgents((prev) => [...prev, newAgent])
          }
        />

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-indigo-600 font-semibold"
          >
            Loading your data...
          </motion.div>
        ) : (
          <>
            {/* Agents */}
            {agents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {agents.map((agent) => (
                  <AgentCard key={agent._id} agent={agent} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-10">No agents found</p>
            )}

            {/* File Upload */}
            <FileUpload />

            {/* Leads Table */}
            <LeadTable leads={leads} />
          </>
        )}
      </div>
    </div>
  );
}
