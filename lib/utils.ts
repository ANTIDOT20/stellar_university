import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DegreeClass } from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatGpa(gpa: number): string {
  return gpa.toFixed(2);
}

export function gpaToClass(gpa: number): DegreeClass {
  if (gpa >= 4.50) return "FIRST_CLASS";
  if (gpa >= 3.50) return "SECOND_CLASS_UPPER";
  if (gpa >= 2.40) return "SECOND_CLASS_LOWER";
  if (gpa >= 1.50) return "THIRD_CLASS";
  return "PASS";
}

export function formatXlm(stroops: bigint): string {
  return (Number(stroops) / 10_000_000).toFixed(2);
}

export function formatUsdc(raw: bigint, decimals = 7): string {
  const divisor = 10 ** decimals;
  return (Number(raw) / divisor).toFixed(2);
}

export function shortenAddress(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(new Date(date));
}

export function semesterLabel(semester: number, session: string): string {
  const s = semester === 1 ? "First" : "Second";
  return `${s} Semester, ${session} Session`;
}

export function gradeFromScore(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}

export function gradeToPoints(grade: string): number {
  const map: Record<string, number> = {
    A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, F: 0.0,
  };
  return map[grade] ?? 0;
}

export function computeGpa(
  records: Array<{ score: number; creditUnits: number }>
): number {
  let totalPoints = 0;
  let totalUnits = 0;
  for (const r of records) {
    const grade = gradeFromScore(r.score);
    totalPoints += gradeToPoints(grade) * r.creditUnits;
    totalUnits += r.creditUnits;
  }
  return totalUnits === 0 ? 0 : totalPoints / totalUnits;
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
