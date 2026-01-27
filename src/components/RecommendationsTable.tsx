import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Download, Search, ArrowUpDown, ChevronRight, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatDate } from "@/lib/formatters";

interface RecommendationRow {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  location: string;
  primary_solution: string;
  system_capacity_kw: number;
  total_cost_ngn: number;
  roi_months: number | null;
  generated_at: string;
}

interface RecommendationsTableProps {
  data: RecommendationRow[];
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<RecommendationRow>();

const solutionColors: Record<string, string> = {
  "Solar+Battery": "bg-energy-green-light text-energy-green border-energy-green/20",
  "Hybrid": "bg-solar-gold-light text-amber-700 border-amber-200",
  "Generator+Inverter": "bg-orange-50 text-orange-700 border-orange-200",
};

export function RecommendationsTable({ data, isLoading }: RecommendationsTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.accessor("client_name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground">{info.row.original.client_email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("primary_solution", {
      header: "Solution",
      cell: (info) => {
        const solution = info.getValue();
        return (
          <Badge
            variant="outline"
            className={solutionColors[solution] || "bg-muted text-muted-foreground"}
          >
            {solution}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("system_capacity_kw", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Capacity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => <span className="font-mono">{info.getValue()} kW</span>,
    }),
    columnHelper.accessor("total_cost_ngn", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <span className="font-mono font-medium">{formatNaira(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("roi_months", {
      header: "ROI",
      cell: (info) => {
        const months = info.getValue();
        return months ? (
          <span className="text-sm">{months} months</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    }),
    columnHelper.accessor("generated_at", {
      header: "Date",
      cell: (info) => <span className="text-sm">{formatDate(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/recommendations/${row.original.id}`)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToExcel = () => {
    const exportData = data.map((rec) => ({
      "Client Name": rec.client_name,
      "Email": rec.client_email,
      "Phone": rec.client_phone,
      "Location": rec.location,
      "Solution": rec.primary_solution,
      "System Capacity (kW)": rec.system_capacity_kw,
      "Total Cost (₦)": rec.total_cost_ngn,
      "ROI (Months)": rec.roi_months || "-",
      "Date": formatDate(rec.generated_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recommendations");

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `power-recommendations-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients, locations..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={exportToExcel} variant="outline" disabled={data.length === 0}>
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Download className="h-8 w-8" />
                    <p>No recommendations yet</p>
                    <Button
                      variant="link"
                      onClick={() => navigate("/assessment")}
                      className="text-primary"
                    >
                      Create your first assessment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/recommendations/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {data.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} recommendations
        </p>
      )}
    </motion.div>
  );
}
