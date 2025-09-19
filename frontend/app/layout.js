"use client";

import { RecoilRoot } from "recoil";
import Alert from "@/components/Alert";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <Alert /> 
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
