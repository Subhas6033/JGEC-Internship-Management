import React from "react";
import { LoaderCircle, Inbox } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display.",
  getRowKey = (row, index) => row._id || index,
  onRowClick,
  className = "",
  tableClassName = "",
}) => {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-xl",
        "border border-gray-200 bg-white",
        className,
      )}
    >
      <div className="w-full overflow-x-auto">
        <table
          className={cn(
            "w-full min-w-180 border-collapse text-left",
            tableClassName,
          )}
        >
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-3",
                    "text-xs font-semibold uppercase tracking-wide",
                    "text-gray-500",
                    column.headerClassName,
                  )}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">
                      Loading records...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Inbox className="h-6 w-6 text-gray-400" />
                    </div>

                    <p className="font-medium text-gray-900">{emptyTitle}</p>

                    <p className="text-sm text-gray-500">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors hover:bg-gray-50",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-4 text-sm text-gray-700",
                        column.cellClassName,
                      )}
                      style={{
                        textAlign: column.align || "left",
                      }}
                    >
                      {column.render
                        ? column.render(row, index)
                        : (row[column.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
