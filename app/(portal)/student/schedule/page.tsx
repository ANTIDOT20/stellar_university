"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DAYS, SAMPLE_TIMETABLE, type Day, type TimetableSlot } from "@/data/timetable";

const TYPE_STYLE: Record<TimetableSlot["type"], string> = {
  lecture:  "bg-su-gold/10 border-su-gold/30 text-su-gold",
  lab:      "bg-su-green/10 border-su-green/30 text-su-green",
  tutorial: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<Day>("Mon");

  const todaySlots = SAMPLE_TIMETABLE
    .filter((s) => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-su-gold" />
        <h1 className="text-2xl font-display font-bold text-white">Class Schedule</h1>
        <Badge variant="blue">Semester 2 · 2025/2026</Badge>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeDay === day
                ? "bg-su-gold text-su-dark"
                : "text-su-text hover:text-white border border-su-border hover:border-su-gold/40"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots */}
      {todaySlots.length === 0 ? (
        <div className="card-glass rounded-xl p-10 text-center text-su-text">
          No classes on {activeDay}.
        </div>
      ) : (
        <div className="space-y-3">
          {todaySlots.map((slot, i) => (
            <div
              key={i}
              className={`card-glass rounded-xl p-5 border ${TYPE_STYLE[slot.type]} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{slot.courseCode}</span>
                <Badge
                  variant={
                    slot.type === "lecture" ? "gold" :
                    slot.type === "lab"     ? "green" : "blue"
                  }
                >
                  {slot.type}
                </Badge>
              </div>
              <p className="text-su-text text-sm">{slot.title}</p>
              <div className="flex items-center gap-4 text-xs text-su-text">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.startTime} – {slot.endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {slot.venue}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly summary */}
      <div className="card-glass rounded-xl p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm">Weekly Summary</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {["lecture", "lab", "tutorial"].map((type) => {
            const count = SAMPLE_TIMETABLE.filter((s) => s.type === type).length;
            return (
              <div key={type} className="space-y-0.5">
                <p className="text-xl font-bold text-white">{count}</p>
                <p className="text-su-text text-xs capitalize">{type}s / week</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
