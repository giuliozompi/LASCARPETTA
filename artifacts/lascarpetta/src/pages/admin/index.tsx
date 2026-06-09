import { useGetAdminMe, useGetReservationStats, useGetReviewStats, useListReservations, useListCateringBookings } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { motion } from "framer-motion";
import { Users, Star, Calendar, ChefHat } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const { data: resStats } = useGetReservationStats();
  const { data: revStats } = useGetReviewStats();
  const { data: reservations } = useListReservations({ status: "pending" });
  const { data: catering } = useListCateringBookings({ status: "pending" });

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="font-serif text-3xl mb-8">Dashboard</h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
        >
          <StatCard label="Total Reservations" value={resStats?.total ?? 0} icon={Calendar} color="bg-primary" />
          <StatCard label="Pending Reservations" value={resStats?.pending ?? 0} icon={Users} color="bg-amber-500" />
          <StatCard label="Reviews" value={revStats?.approvedCount ?? 0} icon={Star} color="bg-emerald-500" />
          <StatCard label="Pending Catering" value={catering?.length ?? 0} icon={ChefHat} color="bg-blue-500" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Pending Reservations</h2>
            {reservations?.length === 0 && <p className="text-muted-foreground text-sm">No pending reservations</p>}
            <div className="space-y-3">
              {reservations?.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} {r.time} · {r.guests} guests</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Pending</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Pending Catering</h2>
            {catering?.length === 0 && <p className="text-muted-foreground text-sm">No pending catering bookings</p>}
            <div className="space-y-3">
              {catering?.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="font-medium text-sm">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.eventDate} · {b.guests} guests</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
