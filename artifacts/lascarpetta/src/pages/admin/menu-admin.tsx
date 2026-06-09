import { useState } from "react";
import { useGetAdminMe, useListMenuCategories, useListDishes, useCreateDish, useDeleteDish, getListDishesQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "./layout";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { AutoTranslateButton } from "@/components/auto-translate-button";

export default function AdminMenu() {
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();
  const createDish = useCreateDish();
  const deleteDish = useDeleteDish();

  useEffect(() => {
    if (me !== undefined && !me?.authenticated) setLocation("/admin/login");
  }, [me]);

  const { data: categories } = useListMenuCategories({});
  const params: any = {};
  if (activeCatId) params.categoryId = activeCatId;
  const { data: dishes } = useListDishes(params);

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      categoryId: 0,
      nameRu: "", nameIt: "", nameEn: "", nameFr: "", nameZh: "",
      descRu: "", descIt: "", descEn: "", descFr: "", descZh: "",
      price: 0, currency: "RUB", imageUrl: "", featured: false, available: true, allergens: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createDish.mutateAsync({ data: { ...data, price: Number(data.price) } });
      qc.invalidateQueries({ queryKey: getListDishesQueryKey(params) });
      toast({ title: "Блюдо добавлено" });
      reset();
      setShowForm(false);
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить блюдо?")) return;
    await deleteDish.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListDishesQueryKey(params) });
    toast({ title: "Блюдо удалено" });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl">Меню</h1>
          <Button className="rounded-none" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить блюдо
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCatId(null)}
            className={`px-4 py-1.5 text-sm rounded-none border whitespace-nowrap ${activeCatId === null ? "bg-primary text-white border-primary" : "border-border"}`}
          >
            Все
          </button>
          {categories?.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCatId(c.id)}
              className={`px-4 py-1.5 text-sm rounded-none border whitespace-nowrap ${activeCatId === c.id ? "bg-primary text-white border-primary" : "border-border"}`}
            >
              {c.nameRu}
            </button>
          ))}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-6 mb-6 space-y-4">

            {/* Category + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Категория *</label>
                <Select onValueChange={(v) => setValue("categoryId", Number(v))}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Выбрать категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nameRu}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Цена (RUB) *</label>
                <Input {...register("price")} type="number" className="rounded-none" />
              </div>
            </div>

            {/* RU name + desc (source) */}
            <div className="border border-primary/20 bg-primary/5 p-4 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">🇷🇺 Оригинал (Русский)</p>
              <div>
                <label className="block text-sm font-medium mb-1">Название RU *</label>
                <Input {...register("nameRu")} className="rounded-none" placeholder="Брускетта с томатами" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Описание RU</label>
                <Textarea {...register("descRu")} rows={2} className="rounded-none" placeholder="Хрустящий хлеб с томатами..." />
              </div>
            </div>

            {/* Auto-translate button */}
            <div className="flex items-center gap-3">
              <AutoTranslateButton
                getTexts={() => ({ name: getValues("nameRu"), desc: getValues("descRu") })}
                onTranslated={(lang, vals) => {
                  if (vals.name !== undefined) setValue(`name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any, vals.name);
                  if (vals.desc !== undefined) setValue(`desc${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any, vals.desc);
                }}
              />
              <span className="text-xs text-muted-foreground">Заполнит автоматически IT, EN, FR, ZH</span>
            </div>

            {/* Translated names */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Названия (редактируемые)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">🇮🇹 IT</label>
                  <Input {...register("nameIt")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇬🇧 EN</label>
                  <Input {...register("nameEn")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇫🇷 FR</label>
                  <Input {...register("nameFr")} className="rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">🇨🇳 ZH</label>
                  <Input {...register("nameZh")} className="rounded-none" />
                </div>
              </div>
            </div>

            {/* Translated descriptions */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Описания (редактируемые)</p>
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

            <div>
              <label className="block text-sm font-medium mb-1">URL фотографии</label>
              <Input {...register("imageUrl")} className="rounded-none" placeholder="https://..." />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-none" disabled={createDish.isPending}>Добавить</Button>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => { reset(); setShowForm(false); }}>Отмена</Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Фото</th>
                <th className="text-left p-3 font-medium">Название</th>
                <th className="text-left p-3 font-medium">Цена</th>
                <th className="text-left p-3 font-medium">Топ</th>
                <th className="text-left p-3 font-medium">Доступно</th>
                <th className="text-left p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {dishes?.map(d => (
                <tr key={d.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3">
                    {d.imageUrl ? <img src={d.imageUrl} alt={d.nameRu} className="w-12 h-12 object-cover" /> : <div className="w-12 h-12 bg-muted" />}
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{d.nameRu}</p>
                    <p className="text-xs text-muted-foreground">{d.nameEn}</p>
                  </td>
                  <td className="p-3 font-medium">{Number(d.price).toLocaleString()} {d.currency}</td>
                  <td className="p-3">{d.featured ? "✓" : "—"}</td>
                  <td className="p-3">{d.available ? "✓" : "✗"}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(d.id)} className="text-destructive hover:opacity-70">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dishes?.length === 0 && <p className="text-center py-12 text-muted-foreground">Нет блюд</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
