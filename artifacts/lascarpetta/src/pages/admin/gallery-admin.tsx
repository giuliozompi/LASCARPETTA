import { useState } from "react";
import { useGetAdminMe, useListGalleryPhotos, useCreateGalleryPhoto, useDeleteGalleryPhoto, getListGalleryPhotosQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { AutoTranslateButton } from "@/components/auto-translate-button";

const TYPES = ["dishes", "interior", "events", "daily"];

export default function AdminGallery() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();
  const createPhoto = useCreateGalleryPhoto();
  const deletePhoto = useDeleteGalleryPhoto();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const params: any = {};
  if (typeFilter !== "all") params.type = typeFilter;
  const { data: photos } = useListGalleryPhotos(params);

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: { type: "interior", imageUrl: "", captionRu: "", captionIt: "", captionEn: "", featured: false },
  });

  const onSubmit = async (data: any) => {
    try {
      await createPhoto.mutateAsync({ data });
      qc.invalidateQueries({ queryKey: getListGalleryPhotosQueryKey(params) });
      toast({ title: "Фото добавлено" });
      reset();
      setShowForm(false);
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить фото?")) return;
    await deletePhoto.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListGalleryPhotosQueryKey(params) });
    toast({ title: "Фото удалено" });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">Галерея</h1>
          <Button className="rounded-none" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить фото
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL фотографии *</label>
                <Input {...register("imageUrl")} className="rounded-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Тип *</label>
                <Select onValueChange={(v) => setValue("type", v)} defaultValue="interior">
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* RU caption */}
            <div className="border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">🇷🇺 Подпись (Русский)</p>
              <Input {...register("captionRu")} className="rounded-none" placeholder="Уютный зал ресторана" />
            </div>

            {/* Auto-translate */}
            <div className="flex items-center gap-3">
              <AutoTranslateButton
                getTexts={() => ({ caption: getValues("captionRu") })}
                onTranslated={(lang, vals) => {
                  if (lang === "it" && vals.caption) setValue("captionIt", vals.caption);
                  if (lang === "en" && vals.caption) setValue("captionEn", vals.caption);
                }}
              />
              <span className="text-xs text-muted-foreground">Переведёт подпись на IT и EN</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">🇮🇹 Подпись IT</label>
                <Input {...register("captionIt")} className="rounded-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">🇬🇧 Подпись EN</label>
                <Input {...register("captionEn")} className="rounded-none" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="rounded-none" disabled={createPhoto.isPending}>Добавить</Button>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => { reset(); setShowForm(false); }}>Отмена</Button>
            </div>
          </form>
        )}

        {/* Type filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button onClick={() => setTypeFilter("all")} className={`px-4 py-1.5 text-sm rounded-none border ${typeFilter === "all" ? "bg-primary text-white border-primary" : "border-border"}`}>Все</button>
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 text-sm rounded-none border ${typeFilter === t ? "bg-primary text-white border-primary" : "border-border"}`}>{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos?.map((p) => (
            <div key={p.id} className="relative group aspect-square overflow-hidden border border-border">
              <img src={p.imageUrl} alt={p.captionEn || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(p.id)} className="text-white hover:text-red-400">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">{p.captionRu || p.type}</span>
            </div>
          ))}
        </div>

        {photos?.length === 0 && <p className="text-center py-12 text-muted-foreground">Нет фотографий</p>}
      </div>
    </AdminLayout>
  );
}
