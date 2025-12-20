import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { mockApplications } from "@/mockData";
import { Application } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const statusColors: Record<string, string> = {
  applied: "bg-blue-100/50 text-blue-700",
  interviewing: "bg-purple-100/50 text-purple-700",
  rejected: "bg-red-100/50 text-red-700",
  offer: "bg-emerald-100/50 text-emerald-700",
};

function formatCurrency(amount: number | undefined): string {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "job_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Job Title
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("job_title") || "—"}</div>
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Company
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("company") || "—"}</div>
    ),
  },
  {
    accessorKey: "pay",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Salary
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const pay = row.getValue("pay") as number | undefined;
      return <div className="font-light">{formatCurrency(pay)}</div>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Location
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("location") || "—"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColor = statusColors[status] || "bg-gray-100/50 text-gray-700";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light ${statusColor}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "resume_used",
    header: "Resume",
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("resume_used") || "—"}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-light hover:bg-transparent"
        >
          Created
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date | undefined;
      return <div className="font-light">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "job_url",
    header: "Link",
    cell: ({ row }) => {
      const url = row.getValue("job_url") as string | undefined;
      if (!url) return <div className="font-light">—</div>;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      );
    },
  },
];

export default function ExcelView() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: mockApplications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-light tracking-tight">Excel View</h1>
        <p className="text-lg font-light text-gray-500">
          Spreadsheet-style table for detailed tracking
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search applications..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm font-light border-black/50 bg-white/80 backdrop-blur-sm"
          />
          <div className="text-sm font-light text-gray-500">
            {table.getFilteredRowModel().rows.length} of {mockApplications.length} applications
          </div>
        </div>

        <div className="rounded-2xl border border-black/50 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm shadow-gray-200/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-black/20 hover:bg-transparent bg-gray-50/30"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-light text-gray-600 h-12"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-black/20 hover:bg-gray-50/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="font-light">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center font-light text-gray-400"
                    >
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
