"use client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "@/state/authAtom";

export default function useAuthPersistence() {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, [setAuth]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);
}
