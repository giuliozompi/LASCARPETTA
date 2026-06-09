import { useState } from "react";
import { useGetAdminMe, useListEvents, useCreateEvent, useDeleteEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function AdminEvents() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const { data: events } = useListEvents({});

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { titleRu: "", titleIt: "", titleEn: "", titleFr: "", titleZh: "", descRu: "", descIt: "", descEn: "", descFr: "", descZh: "", date: "", imageUrl: "", published: true },
  });

  const onSubmit = async (data: any) => {
    try {
      await createEvent.mutateAsync({ data });
      qc.invalidateQueries({ queryKey: getListEventsQueryKey({}) });
      toast({ title: "Event created" });
      reset();
      setShowForm(false);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListEventsQueryKey({}) });
    toast({ title: "Event deleted" });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">Events</h1>
          <Button className="rounded-none" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title RU *</label>
                <Input {...register("titleRu")} className="rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title IT *</label>
                <Input {...register("titleIt")} className="rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title EN *</label>
                <Input {...register("titleEn")} className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description RU</label>
                <Textarea {...register("descRu")} rows={3} className="rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description EN</label>
                <Textarea {...register("descEn")} rows={3} className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <Input {...register("date")} type="date" className="rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input {...register("imageUrl")} className="rounded-none" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-none" disabled={createEvent.isPending}>Add Event</Button>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {events?.map(e => (
            <div key={e.id} className="bg-card border border-border p-4 flex items-center gap-4">
              {e.imageUrl && <img src={e.imageUrl} alt={e.titleEn} className="w-16 h-16 object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{e.titleRu}</p>
                <p className="text-xs text-muted-foreground">{e.date}</p>
              </div>
              <button onClick={() => handleDelete(e.id)} className="text-destructive hover:opacity-70 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {events?.length === 0 && <p className="text-center py-12 text-muted-foreground">No events. Add some!</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
