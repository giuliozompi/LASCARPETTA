import { useState } from "react";
import { useGetAdminMe, useListCateringBookings, useUpdateCateringBookingStatus, getListCateringBookingsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminCatering() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const qc = useQueryClient();
  const updateStatus = useUpdateCateringBookingStatus();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const params: any = {};
  if (statusFilter !== "all") params.status = statusFilter;
  const { data: bookings, isLoading } = useListCateringBookings(params);

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: status as any } });
      qc.invalidateQueries({ queryKey: getListCateringBookingsQueryKey(params) });
      toast({ title: "Status updated" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="font-serif text-3xl mb-6">Catering Bookings</h1>
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Phone</th>
                  <th className="text-left p-3 font-medium">Event Date</th>
                  <th className="text-left p-3 font-medium">Guests</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((b) => (
                  <tr key={b.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3">
                      <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
                    </td>
                    <td className="p-3">{b.eventDate}</td>
                    <td className="p-3">{b.guests}</td>
                    <td className="p-3 text-muted-foreground">{b.eventLocation || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[b.status] || ""}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Select value={b.status} onValueChange={(v) => handleStatus(b.id, v)}>
                        <SelectTrigger className="h-7 text-xs rounded-none w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings?.length === 0 && <p className="text-center py-12 text-muted-foreground">No bookings found</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
