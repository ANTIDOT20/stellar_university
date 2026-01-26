export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export interface TimetableSlot {
  day:       Day;
  startTime: string;
  endTime:   string;
  courseCode: string;
  title:     string;
  venue:     string;
  type:      "lecture" | "lab" | "tutorial";
}

export const SAMPLE_TIMETABLE: TimetableSlot[] = [
  { day: "Mon", startTime: "08:00", endTime: "10:00", courseCode: "SBC301", title: "Soroban Contract Dev I",    venue: "LT1",    type: "lecture" },
  { day: "Mon", startTime: "12:00", endTime: "14:00", courseCode: "SBC303", title: "DeFi Protocol Design",      venue: "LT3",    type: "lecture" },
  { day: "Tue", startTime: "10:00", endTime: "12:00", courseCode: "SBC301", title: "Soroban Contract Dev I",    venue: "Lab 2",  type: "lab"     },
  { day: "Tue", startTime: "14:00", endTime: "16:00", courseCode: "MTH301", title: "Numerical Methods",         venue: "LT5",    type: "lecture" },
  { day: "Wed", startTime: "08:00", endTime: "10:00", courseCode: "SBC303", title: "DeFi Protocol Design",      venue: "Lab 1",  type: "lab"     },
  { day: "Wed", startTime: "12:00", endTime: "13:00", courseCode: "SBC301", title: "Soroban Contract Dev I",    venue: "RM 204", type: "tutorial"},
  { day: "Thu", startTime: "10:00", endTime: "12:00", courseCode: "CSC305", title: "Database Systems",          venue: "LT2",    type: "lecture" },
  { day: "Thu", startTime: "14:00", endTime: "16:00", courseCode: "MTH301", title: "Numerical Methods",         venue: "RM 101", type: "tutorial"},
  { day: "Fri", startTime: "08:00", endTime: "10:00", courseCode: "CSC305", title: "Database Systems",          venue: "Lab 3",  type: "lab"     },
  { day: "Fri", startTime: "11:00", endTime: "13:00", courseCode: "SBC303", title: "DeFi Protocol Design",      venue: "RM 204", type: "tutorial"},
];

export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

export function getSlotsByDay(day: Day): TimetableSlot[] {
  return SAMPLE_TIMETABLE.filter((s) => s.day === day);
}
