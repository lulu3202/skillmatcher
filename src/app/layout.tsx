import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Skill Matcher", description: "Evidence-forward GitHub skill recommendations" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
