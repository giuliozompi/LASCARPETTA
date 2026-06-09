import { useState } from "react";
import { useGetAdminMe, useListReservations, useUpdateReservationStatus, getListReservationsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

export default function AdminReservations() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();
  const updateStatus = useUpdateReservationStatus();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const params: any = {};
  if (statusFilter !== "all") params.status = statusFilter;
  if (dateFilter) params.date = dateFilter;

  const { data: reservations, isLoading } = useListReservations(params);

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: status as any } });
      qc.invalidateQueries({ queryKey: getListReservationsQueryKey(params) });
      toast({ title: "Status updated" });
    } catch {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="font-serif text-3xl mb-6">Reservations</h1>
        <div className="flex gap-4 mb-6 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-48 rounded-none"
            placeholder="Filter by date"
          />
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
                  <th className="text-left p-3 font-medium">Date & Time</th>
                  <th className="text-left p-3 font-medium">Guests</th>
                  <th className="text-left p-3 font-medium">Comment</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3">
                      <a href={`tel:${r.phone}`} className="text-primary hover:underline">{r.phone}</a>
                    </td>
                    <td className="p-3">{r.date} {r.time}</td>
                    <td className="p-3">{r.guests}</td>
                    <td className="p-3 max-w-xs truncate text-muted-foreground">{r.comment || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] || ""}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Select
                        value={r.status}
                        onValueChange={(v) => handleStatus(r.id, v)}
                      >
                        <SelectTrigger className="h-7 text-xs rounded-none w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations?.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No reservations found</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
