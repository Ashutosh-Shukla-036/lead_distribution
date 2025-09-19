"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "@/state/authAtom";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, token: null, user: null });
    logout();
  };

  if (!mounted) return null; // ✅ prevents hydration mismatch

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full flex justify-between items-center px-8 py-4 glass shadow-lg fixed top-0 z-50"
    >
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        LeadDistributor
      </Link>
      <div className="space-x-6 text-lg">
        {!auth.isAuthenticated ? (
          <Link href="/login" className="hover:text-indigo-600">
            Login
          </Link>
        ) : (
          <>
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
