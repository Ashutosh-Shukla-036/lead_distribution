"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center relative">
      <Navbar />
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
      >
        Lead Distributor 🚀
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-lg text-gray-600 max-w-lg"
      >
        Upload leads, distribute them to your agents automatically, and manage
        everything from a single dashboard.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <Link
          href="/login"
          className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </motion.div>
    </main>
  );
}
