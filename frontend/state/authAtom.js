// state/authAtom.js
import { atom } from "recoil";

const getInitialAuth = () => {
  if (typeof window !== "undefined") {
    const saved = sessionStorage.getItem("authState");
    if (saved) return JSON.parse(saved);
  }
  return { isAuthenticated: false, token: null, user: null };
};

export const authState = atom({
  key: "authState",
  default: getInitialAuth(),
  effects: [
    ({ onSet }) => {
      onSet((newVal) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("authState", JSON.stringify(newVal));
        }
      });
    },
  ],
});
