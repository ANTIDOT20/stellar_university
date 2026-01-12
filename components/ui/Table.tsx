import { ReactNode } from "react";

interface Column<T> {
  key:      string;
  label:    string;
  render?:  (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns:   Column<T>[];
  data:      T[];
  keyField:  keyof T;
  emptyText?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  emptyText = "No records found.",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-su-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-su-border bg-su-navy/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-su-text text-xs uppercase tracking-wider px-4 py-3 font-medium ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-su-text py-10 px-4"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-su-border/40 hover:bg-white/[0.02] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-su-text ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
