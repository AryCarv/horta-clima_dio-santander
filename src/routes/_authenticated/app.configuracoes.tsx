import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CitySearch, PageHeader } from "@/components/hc/common";
import { useGarden, useInvalidate, useProfile, useUser } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/configuracoes")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Configurações — HortaClima" }, { name: "description", content: "Perfil e preferências." }] }),
  component: Settings,
});

function Sec({ t, children }: { t: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-card p-5"><h2 className="mb-3 text-lg font-semibold">{t}</h2><div className="space-y-3">{children}</div></section>;
}

function Settings() {
  const { data: user } = useUser(); const { data: profile } = useProfile(); const { data: garden } = useGarden();
  const invalidate = useInvalidate(); const qc = useQueryClient(); const navigate = useNavigate();
  const [name, setName] = useState(""); const [cur, setCur] = useState(""); const [pw, setPw] = useState("");
  const [dark, setDark] = useState(false);
  useEffect(() => { setName(profile?.full_name ?? ""); setDark(document.documentElement.classList.contains("dark")); }, [profile]);
  async function upd(v: { full_name?: string; temperature_unit?: string; week_start?: string }) {
    if (!user) return; const { error } = await supabase.from("profiles").update(v).eq("user_id", user.id);
    if (error) toast.error("Não foi possível salvar."); else { toast.success("Salvo"); invalidate("profile"); }
  }
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Configurações" />
      <Sec t="Perfil"><Label>Nome</Label><div className="flex gap-2"><Input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} /><Button onClick={() => name.trim().length >= 2 && upd({ full_name: name.trim() })}>Salvar</Button></div><p className="text-sm text-muted-foreground">E-mail: {user?.email}</p></Sec>
      <Sec t="Localização"><p className="text-sm">📍 {[garden?.city, garden?.state, garden?.country].filter(Boolean).join(", ")}</p>
        <CitySearch onSelect={async (c) => { if (!garden) return; await supabase.from("gardens").update({ city: c.name, state: c.admin1 ?? null, country: c.country ?? null, latitude: c.latitude, longitude: c.longitude }).eq("id", garden.id); toast.success("Cidade atualizada"); invalidate("garden"); }} />
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/onboarding" })}>Refazer configuração da horta</Button></Sec>
      <Sec t="Preferências">
        <div className="flex items-center justify-between"><Label>Unidade de temperatura</Label><Select value={profile?.temperature_unit ?? "C"} onValueChange={(v) => upd({ temperature_unit: v })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="C">°C</SelectItem><SelectItem value="F">°F</SelectItem></SelectContent></Select></div>
        <div className="flex items-center justify-between"><Label>Início da semana</Label><Select value={profile?.week_start ?? "sunday"} onValueChange={(v) => upd({ week_start: v })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sunday">Domingo</SelectItem><SelectItem value="monday">Segunda</SelectItem></SelectContent></Select></div>
        <div className="flex items-center justify-between"><Label>Aparência</Label><Select value={dark ? "dark" : "light"} onValueChange={(v) => { document.documentElement.classList.toggle("dark", v === "dark"); localStorage.setItem("hc-theme", v); setDark(v === "dark"); }}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem></SelectContent></Select></div>
      </Sec>
      <Sec t="Conta">
        <Input type="password" placeholder="Senha atual" value={cur} onChange={(e) => setCur(e.target.value)} />
        <Input type="password" placeholder="Nova senha (mín. 8)" value={pw} onChange={(e) => setPw(e.target.value)} />
        <div className="flex gap-2"><Button onClick={async () => { if (pw.length < 8) return toast.error("Senha muito curta."); const { error } = await supabase.auth.updateUser({ password: pw, current_password: cur } as never); if (error) toast.error("Não foi possível alterar a senha."); else { toast.success("Senha alterada"); setPw(""); setCur(""); } }}>Alterar senha</Button>
          <Button variant="outline" onClick={async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: "/login", replace: true }); }}>Sair</Button></div>
      </Sec>
      <Sec t="Privacidade"><p className="text-sm text-muted-foreground">Os dados da sua horta pertencem a você e são protegidos por autenticação e políticas de acesso. Guardamos apenas sua cidade, nunca seu endereço.</p></Sec>
    </div>
  );
}
