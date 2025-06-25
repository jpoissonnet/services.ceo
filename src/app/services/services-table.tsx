"use client";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useState } from "react";

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, refetch } = useQuery({
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

  const validateService = async (serviceId: string) => {
    try {
      const response = await fetch("/api/service/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId }),
      });

      if (response.ok) {
        // Refetch services to update the UI
        refetch();
      } else {
        console.error("Failed to validate service");
      }
    } catch (error) {
      console.error("Error validating service:", error);
    }
  };

  // Group and process the data
  const processData = (data: Service[]) => {
    // Group by status
    const groupedByStatus = data.reduce<Record<string, Service[]>>(
      (acc, service) => {
        const status = service.status;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(service);
        return acc;
      },
      {},
    );

    return Object.entries(groupedByStatus).sort(([statusA], [statusB]) => {
      // Prioritize "pending" status to appear first
      if (statusA === "pending") return -1;
      if (statusB === "pending") return 1;
      return statusA.localeCompare(statusB);
    });
  };

  // Apply filters from the table to the grouped data
  const applyFilters = (data: Service[], filters: ColumnFiltersState) => {
    const statusFilter = filters.find((f) => f.id === "status")
      ?.value as string;

    if (statusFilter) {
      return data.filter((item) => item.status === statusFilter);
    }

    return data;
  };

  const filteredClientData = applyFilters(asClient, columnFilters);
  const filteredDeveloperData = applyFilters(asDeveloper, columnFilters);

  if (isLoading) return <div>Loading...</div>;

  // Process the data for grouping by status
  const groupedClientData = processData(filteredClientData);
  const groupedDeveloperData = processData(filteredDeveloperData);

  return (
    <div className="container space-y-8 py-8">
      <h1 className="mb-4 text-2xl font-bold">Your Services</h1>

      <div className="space-y-6">
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the client of
        </h2>

        {/* Filter controls for client services */}
        <div className="mb-4 flex items-center">
          <span className="mr-2">Filter by status:</span>
          <select
            className="rounded border px-2 py-1"
            value={
              (columnFilters.find((f) => f.id === "status")?.value as string) ||
              ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const newFilters = [
                ...columnFilters.filter((f) => f.id !== "status"),
              ];
              if (value) {
                newFilters.push({
                  id: "status",
                  value: value,
                });
              }
              setColumnFilters(newFilters);
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
          </select>
        </div>

        {groupedClientData.length === 0 ? (
          <div className="rounded-md border p-4 text-center">
            No services found
          </div>
        ) : (
          groupedClientData.map(([status, services]) => (
            <div key={status} className="mb-6">
              <h3 className="mb-2 text-lg font-medium capitalize">
                {status} Services
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Developer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.developerName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-6">
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the developer of
        </h2>

        {/* Filter controls for developer services */}
        <div className="mb-4 flex items-center">
          <span className="mr-2">Filter by status:</span>
          <select
            className="rounded border px-2 py-1"
            value={
              (columnFilters.find((f) => f.id === "status")?.value as string) ||
              ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const newFilters = [
                ...columnFilters.filter((f) => f.id !== "status"),
              ];
              if (value) {
                newFilters.push({
                  id: "status",
                  value: value,
                });
              }
              setColumnFilters(newFilters);
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
          </select>
        </div>

        {groupedDeveloperData.length === 0 ? (
          <div className="rounded-md border p-4 text-center">
            No services found
          </div>
        ) : (
          groupedDeveloperData.map(([status, services]) => (
            <div key={status} className="mb-6">
              <h3 className="mb-2 text-lg font-medium capitalize">
                {status} Services
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.clientName}</TableCell>
                        <TableCell>
                          {service.status === "pending" ? (
                            <button
                              onClick={() => validateService(service.id)}
                              className="rounded bg-green-500 px-2 py-1 text-white"
                            >
                              Validate
                            </button>
                          ) : (
                            <span className="text-gray-400">Validated</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
