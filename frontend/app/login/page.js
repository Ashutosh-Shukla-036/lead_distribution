"use client";

import { useState } from "react";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { alertAtom } from "@/state/alertAtom";
import { authState } from "@/state/authAtom";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const setAlert = useSetRecoilState(alertAtom);
  const setAuth = useSetRecoilState(authState);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(form);
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      setAuth({
      isAuthenticated: true,
      token: res.data.token,
      user: res.data.user
    });
      setAlert({ type: "success", message: "Login successful 🎉" });
      router.push("/dashboard");
    } catch (err) {
      setAlert({ type: "error", message: "Invalid username or password ❌" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-200">
      <motion.form
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-96 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Admin Login
        </h2>
        <input
          name="email"
          value={form.username}
          onChange={handleChange}
          placeholder="email"
          suppressHydrationWarning={true}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          suppressHydrationWarning={true}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </motion.form>
    </div>
  );
}
