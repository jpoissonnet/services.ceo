"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Session } from "next-auth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Service = {
  id: string;
  name: string;
  status: string;
  developerName?: string;
  clientName?: string;
};

export function ServicesTable({ session }: { session: Session }) {
  const { data, isLoading } = useQuery({
    queryKey: ["services", session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/service?userId=${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      return response.json();
    },
    enabled: !!session?.user?.id,
  });

  const asClient = data?.asClient || [];
  const asDeveloper = data?.asDeveloper || [];

  const clientColumns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "developerName",
      header: "Developer",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  const developerColumns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "clientName",
      header: "Client",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) =>
        row.original.status === "pending" ? (
          <form action="/api/service/validate" method="POST">
            <input type="hidden" name="serviceId" value={row.original.id} />
            <button
              type="submit"
              className="rounded bg-green-500 px-2 py-1 text-white"
            >
              Validate
            </button>
          </form>
        ) : (
          <span className="text-gray-400">Validated</span>
        ),
    },
  ];

  const clientTable = useReactTable({
    data: asClient,
    columns: clientColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const developerTable = useReactTable({
    data: asDeveloper,
    columns: developerColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container space-y-8 py-8">
      <h1 className="mb-4 text-2xl font-bold">Your Services</h1>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the client of
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {clientTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {clientTable.getRowModel().rows?.length ? (
                clientTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={clientColumns.length}
                    className="h-24 text-center"
                  >
                    No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the developer of
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {developerTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {developerTable.getRowModel().rows?.length ? (
                developerTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={developerColumns.length}
                    className="h-24 text-center"
                  >
                    No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
