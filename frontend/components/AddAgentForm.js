"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "@/state/authAtom";
import { alertAtom } from "@/state/alertAtom";

export default function AddAgentForm({ onAgentAdded }) {
  const auth = useRecoilValue(authState);
  const setAlert = useSetRecoilState(alertAtom);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.mobile || !form.password) {
      setAlert({ type: "error", message: "⚠️ All fields are required." });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/agents/add",
        {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      onAgentAdded(res.data.agent); // ✅ update list
      setForm({ name: "", email: "", mobile: "", password: "" }); // reset form

      setAlert({ type: "success", message: "✅ Agent added successfully!" });
    } catch (err) {
      console.error("Add agent error:", err.response?.data || err.message);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "❌ Failed to add agent.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">Add Agent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Agent Name"
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Agent Email"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="mobile"   // ✅ fixed (was phone before)
          value={form.mobile}
          onChange={handleChange}
          placeholder="Agent Mobile"
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Agent Password"
          className="border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Adding..." : "Add Agent"}
      </button>
    </form>
  );
}
