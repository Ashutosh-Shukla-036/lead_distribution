"use client";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { alertAtom } from "@/state/alertAtom";
import { motion } from "framer-motion";

export default function Alert() {
  const [alert, setAlert] = useRecoilState(alertAtom);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  if (!alert) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 
        px-4 py-2 rounded-xl shadow-lg z-50 text-white
        ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {alert.message}
    </motion.div>
  );
}
