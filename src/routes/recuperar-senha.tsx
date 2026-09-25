import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/hc/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — HortaClima" },
      { name: "description", content: "Receba um link para redefinir sua senha do HortaClima." },
      { property: "og:title", content: "Recuperar senha — HortaClima" },
      { property: "og:description", content: "Receba um link para redefinir sua senha do HortaClima." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = z.string().trim().email().safeParse(new FormData(e.currentTarget).get("email"));
    if (!email.success) return toast.error("Informe um e-mail válido.");
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    setSent(true);
  }
  return (
    <AuthCard title="Recuperar senha" subtitle="Enviaremos um link para você criar uma nova senha.">
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Se houver uma conta com esse e-mail, você receberá o link em instantes.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          Voltar ao login
        </Link>
      </p>
    </AuthCard>
  );
}
