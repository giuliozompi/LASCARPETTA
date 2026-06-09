import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LangKey = "it" | "en" | "fr" | "zh";

interface AutoTranslateButtonProps {
  getTexts: () => Record<string, string>;
  onTranslated: (lang: LangKey, values: Record<string, string>) => void;
}

export function AutoTranslateButton({ getTexts, onTranslated }: AutoTranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    const texts = getTexts();
    const nonEmpty = Object.fromEntries(Object.entries(texts).filter(([, v]) => v?.trim()));
    if (Object.keys(nonEmpty).length === 0) {
      toast({ title: "Заполните текст на русском", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: nonEmpty }),
      });
      if (!res.ok) throw new Error("Translation failed");
      const result = await res.json() as Record<LangKey, Record<string, string>>;
      for (const lang of ["it", "en", "fr", "zh"] as LangKey[]) {
        if (result[lang]) onTranslated(lang, result[lang]);
      }
      toast({ title: "Переводы готовы ✓" });
    } catch {
      toast({ title: "Ошибка перевода", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-none gap-2 border-primary/50 text-primary hover:bg-primary/5"
      onClick={handleTranslate}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
      {loading ? "Перевод..." : "Авто-перевод IT/EN/FR/ZH"}
    </Button>
  );
}
