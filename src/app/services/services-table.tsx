"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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
  description: string;
  duration: string;
  developerName?: string;
  developerId?: string;
  clientName?: string;
  hasReview?: boolean; // Added field to track if the service has been reviewed
};

export function ServicesTable({ session }: { session: Session }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [existingReview, setExistingReview] = useState<{
    description: string;
    rating: number;
  } | null>(null);

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

  // Function to check if a service already has a review
  const checkServiceReview = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/review?serviceId=${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        setExistingReview(data.review);
        return data.review;
      }
      return null;
    } catch (error) {
      console.error("Error checking service review:", error);
      return null;
    }
  };

  // Mutation for submitting reviews
  const reviewMutation = useMutation({
    mutationFn: async ({
      serviceId,
      description,
      rating,
    }: {
      serviceId: string;
      description: string;
      rating: number;
    }) => {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          clientId: session.user.id,
          description,
          rating,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      return response.json();
    },
    onSuccess: () => {
      setReviewDrawerOpen(false);
      setSelectedService(null);
      setReviewText("");
      setRating(5);
      setExistingReview(null);
      // Refetch the services to update UI
      refetch();
    },
  });

  // Open review drawer for a service
  const openReviewDrawer = async (service: Service) => {
    setSelectedService(service);
    const review = await checkServiceReview(service.id);
    if (review) {
      setReviewText(review.description || "");
      setRating(review.rating || 5);
    } else {
      setReviewText("");
      setRating(5);
    }
    setReviewDrawerOpen(true);
  };

  // Submit review
  const submitReview = () => {
    if (!selectedService || !reviewText || rating < 1) return;

    reviewMutation.mutate({
      serviceId: selectedService.id,
      description: reviewText,
      rating,
    });
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
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.developerName}</TableCell>
                        <TableCell>
                          {status === "validated" &&
                            (service.hasReview ? (
                              <span className="text-gray-400">Reviewed</span>
                            ) : (
                              <Button
                                onClick={() => openReviewDrawer(service)}
                                variant="outline"
                                size="sm"
                              >
                                Review
                              </Button>
                            ))}
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
                      <TableHead>Reviews</TableHead>
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
                        <TableCell>
                          {/* @ts-expect-error reviews property */}
                          {service.reviews && service.reviews.length > 0 ? (
                            <div className="max-h-32 space-y-2 overflow-y-auto">
                              {/* @ts-expect-error reviews property */}
                              {service.reviews.map((review, idx) => (
                                <div
                                  key={idx}
                                  className="border-b pb-2 last:border-0"
                                >
                                  <div className="flex items-center">
                                    <div className="flex text-yellow-500">
                                      {[...Array(review.rating)].map((_, i) => (
                                        <svg
                                          key={i}
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 fill-current"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M12 .587l3.668 7.431 8.209 1.188-5.934 5.759 1.398 8.165L12 18.896l-7.341 3.86 1.398-8.165-5.934-5.759 8.209-1.188z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {review.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No reviews yet
                            </span>
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

      {/* Review Drawer */}
      <Drawer
        open={reviewDrawerOpen}
        onClose={() => {
          setReviewDrawerOpen(false);
          setSelectedService(null);
          setReviewText("");
          setRating(5);
          setExistingReview(null);
        }}
      >
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">
            {existingReview ? "Edit" : "Submit"} Review
          </h3>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor={"serviceName"}
            >
              Service Name
            </label>
            <Input
              value={selectedService?.name}
              readOnly
              className="cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor={"rating"}
            >
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded border px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor={"reviewText"}
              className="mb-2 block text-sm font-medium"
            >
              Review Description
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="h-24 rounded border px-3 py-2"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setReviewDrawerOpen(false)}
              variant="outline"
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={submitReview}>Submit Review</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
