// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "react-hot-toast";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}
  <Toaster position="top-center" />
  </SessionProvider>;
}
