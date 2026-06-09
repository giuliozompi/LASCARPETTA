import { useI18n } from "@/lib/i18n-context";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default function AdminLoginPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const adminLogin = useAdminLogin();
  const { data: session } = useGetAdminMe();

  useEffect(() => {
    if (session?.authenticated) setLocation("/admin");
  }, [session]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await adminLogin.mutateAsync({ data });
      setLocation("/admin");
    } catch {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary mb-2">La Scarpetta</h1>
          <p className="text-muted-foreground text-sm">Admin Panel</p>
        </div>
        <div className="bg-card border border-border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input {...register("username")} className="rounded-none" autoComplete="username" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input {...register("password")} type="password" className="rounded-none" autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full rounded-none" disabled={adminLogin.isPending}>
              {adminLogin.isPending ? t("common.loading") : "Login"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
