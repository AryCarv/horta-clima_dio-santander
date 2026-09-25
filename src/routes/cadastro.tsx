import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, GoogleButton } from "@/components/hc/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — HortaClima" },
      { name: "description", content: "Crie sua conta gratuita e comece sua horta em pequenos espaços." },
      { property: "og:title", content: "Criar conta — HortaClima" },
      { property: "og:description", content: "Crie sua conta gratuita e comece sua horta em pequenos espaços." },
    ],
  }),
  component: Signup,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(80),
    email: z.string().trim().email("Informe um e-mail válido").max(255),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres").max(72),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos para continuar" }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não coincidem" });

function Signup() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      confirm: fd.get("confirm"),
      terms,
    });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: window.location.origin + "/login", data: { full_name: parsed.data.name } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Este e-mail já está cadastrado." : "Não foi possível criar sua conta.");
      return;
    }
    setSent(true);
  }

  if (sent)
    return (
      <AuthCard title="Confira seu e-mail 📬" subtitle="Enviamos um link de confirmação. Depois de confirmar, é só entrar.">
        <Button asChild className="w-full">
          <Link to="/login">Ir para o login</Link>
        </Button>
      </AuthCard>
    );

  return (
    <AuthCard title="Crie sua horta" subtitle="Gratuito. Leva menos de um minuto.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {[
          { id: "name", label: "Nome", type: "text", ac: "name" },
          { id: "email", label: "E-mail", type: "email", ac: "email" },
          { id: "password", label: "Senha", type: "password", ac: "new-password" },
          { id: "confirm", label: "Confirmar senha", type: "password", ac: "new-password" },
        ].map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Input id={f.id} name={f.id} type={f.type} autoComplete={f.ac} />
            {errors[f.id] && <p className="text-sm text-destructive">{errors[f.id]}</p>}
          </div>
        ))}
        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={terms} onCheckedChange={(v) => setTerms(v === true)} />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
            Aceito os termos de uso e a política de privacidade.
          </Label>
        </div>
        {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
