import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/hc/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — HortaClima" },
      { name: "description", content: "Defina uma nova senha para sua conta HortaClima." },
      { property: "og:title", content: "Nova senha — HortaClima" },
      { property: "og:description", content: "Defina uma nova senha para sua conta HortaClima." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = String(fd.get("password") ?? "");
    if (p.length < 8) return toast.error("A senha deve ter pelo menos 8 caracteres.");
    if (p !== fd.get("confirm")) return toast.error("As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: p });
    setLoading(false);
    if (error) return toast.error("O link expirou ou é inválido. Solicite um novo.");
    toast.success("Senha atualizada!");
    navigate({ to: "/app/dashboard" });
  }
  return (
    <AuthCard title="Criar nova senha">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Nova senha</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" />
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthCard>
  );
}
