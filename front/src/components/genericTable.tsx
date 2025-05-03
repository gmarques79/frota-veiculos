import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
  }[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading = false, 
  emptyMessage = "Nenhum item encontrado" 
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header.toString()} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.header.toString()}>
                  {typeof column.accessor === 'function' 
                    ? column.accessor(item) 
                    : String(item[column.accessor])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}