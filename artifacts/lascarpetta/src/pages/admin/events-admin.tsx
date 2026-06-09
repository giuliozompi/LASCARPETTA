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
import { AutoTranslateButton } from "@/components/auto-translate-button";

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

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      titleRu: "", titleIt: "", titleEn: "", titleFr: "", titleZh: "",
      descRu: "", descIt: "", descEn: "", descFr: "", descZh: "",
      date: "", imageUrl: "", published: true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createEvent.mutateAsync({ data });
      qc.invalidateQueries({ queryKey: getListEventsQueryKey({}) });
      toast({ title: "Событие создано" });
      reset();
      setShowForm(false);
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить событие?")) return;
    await deleteEvent.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListEventsQueryKey({}) });
    toast({ title: "Событие удалено" });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">События</h1>
          <Button className="rounded-none" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить событие
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-6 mb-6 space-y-4">

            {/* Russian source */}
            <div className="border border-primary/20 bg-primary/5 p-4 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">🇷🇺 Оригинал (Русский)</p>
              <div>
                <label className="block text-sm font-medium mb-1">Название RU *</label>
                <Input {...register("titleRu")} className="rounded-none" placeholder="Вечер итальянской музыки" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Описание RU</label>
                <Textarea {...register("descRu")} rows={3} className="rounded-none" placeholder="Описание события..." />
              </div>
            </div>

            {/* Auto-translate */}
            <div className="flex items-center gap-3">
              <AutoTranslateButton
                getTexts={() => ({ title: getValues("titleRu"), desc: getValues("descRu") })}
                onTranslated={(lang, vals) => {
                  const L = lang.charAt(0).toUpperCase() + lang.slice(1);
                  if (vals.title !== undefined) setValue(`title${L}` as any, vals.title);
                  if (vals.desc !== undefined) setValue(`desc${L}` as any, vals.desc);
                }}
              />
              <span className="text-xs text-muted-foreground">Заполнит IT, EN, FR, ZH</span>
            </div>

            {/* Translated titles */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Название (редактируемые)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">🇮🇹 IT</label>
                  <Input {...register("titleIt")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇬🇧 EN</label>
                  <Input {...register("titleEn")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇫🇷 FR</label>
                  <Input {...register("titleFr")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇨🇳 ZH</label>
                  <Input {...register("titleZh")} className="rounded-none" />
                </div>
              </div>
            </div>

            {/* Translated descriptions */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Описание (редактируемые)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">🇮🇹 IT</label>
                  <Textarea {...register("descIt")} rows={2} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇬🇧 EN</label>
                  <Textarea {...register("descEn")} rows={2} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇫🇷 FR</label>
                  <Textarea {...register("descFr")} rows={2} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇨🇳 ZH</label>
                  <Textarea {...register("descZh")} rows={2} className="rounded-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Дата *</label>
                <Input {...register("date")} type="date" className="rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL фотографии</label>
                <Input {...register("imageUrl")} className="rounded-none" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="rounded-none" disabled={createEvent.isPending}>Создать</Button>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => { reset(); setShowForm(false); }}>Отмена</Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {events?.map(e => (
            <div key={e.id} className="bg-card border border-border p-4 flex items-center gap-4">
              {e.imageUrl && <img src={e.imageUrl} alt={e.titleRu} className="w-16 h-16 object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{e.titleRu}</p>
                <p className="text-xs text-muted-foreground">{e.titleEn} · {e.date}</p>
              </div>
              <button onClick={() => handleDelete(e.id)} className="text-destructive hover:opacity-70 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {events?.length === 0 && <p className="text-center py-12 text-muted-foreground">Нет событий</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
