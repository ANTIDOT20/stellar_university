type Level = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level:     Level;
  message:   string;
  context?:  Record<string, unknown>;
  timestamp: string;
}

function emit(level: Level, message: string, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "test") return;

  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  const out = JSON.stringify(entry);

  if (level === "error" || level === "warn") {
    console.error(out);
  } else {
    console.log(out);
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => emit("debug", msg, ctx),
  info:  (msg: string, ctx?: Record<string, unknown>) => emit("info",  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => emit("warn",  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => emit("error", msg, ctx),
};
