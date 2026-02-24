"use client";

import { useState, useEffect } from "react";

export interface Announcement {
  id:    string;
  level: "info" | "warning" | "success";
  title: string;
  body:  string;
  date:  string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data: Announcement[]) => setAnnouncements(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { announcements, loading };
}
