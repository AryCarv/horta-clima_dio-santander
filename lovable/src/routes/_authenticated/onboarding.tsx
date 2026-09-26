import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/hc/AuthCard";
import { CitySearch } from "@/components/hc/common";
import { useGarden, useInvalidate, useProfile, useUser } from "@/hooks/use-hc";
import { EXPERIENCE, OBJECTIVES, SIZES, SPACES, SUN, type City } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Configurar minha horta — HortaClima" },
      { name: "description", content: "Conte sobre seu espaço para receber recomendações." },
      { property: "og:title", content: "Configurar minha horta — HortaClima" },
      { property: "og:description", content: "Conte sobre seu espaço para receber recomendações." },
    ],
  }),
  component: Onboarding,
});

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
        active ? "border-primary bg-secondary text-secondary-foreground" : "bg-card hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const invalidate = useInvalidate();
  const { data: user } = useUser();
  const { data: profile } = useProfile();
  const { data: garden } = useGarden();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [spaces, setSpaces] = useState<string[]>([]);
  const [size, setSize] = useState("");
  const [m2, setM2] = useState("");
  const [sun, setSun] = useState("");
  const [objs, setObjs] = useState<string[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name && !name) setName(profile.full_name);
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const steps = [
    { q: "Como podemos chamar você?", ok: name.trim().length >= 2 },
    { q: "Qual é sua experiência com cultivo?", ok: !!exp },
    { q: "Onde fica sua horta?", hint: "Pode escolher mais de um.", ok: spaces.length > 0 },
    { q: "Qual o tamanho aproximado?", ok: !!size },
    { q: "Quanto sol o espaço recebe?", ok: !!sun },
    { q: "O que você quer cultivar?", hint: "Pode escolher mais de um.", ok: objs.length > 0 },
    { q: "Onde você mora?", hint: "Usamos apenas a cidade para mostrar o clima. Nunca pedimos seu endereço.", ok: !!city },
    { q: "", ok: true },
  ];

  async function finish() {
    if (!user || !city) return;
    setSaving(true);
    const gardenData = {
      user_id: user.id,
      name: "Minha Horta",
      space_types: spaces,
      size_category: size,
      size_m2: m2 ? Number(m2) : null,
      sunlight_level: sun,
      objectives: objs,
      city: city.name,
      state: city.admin1 ?? null,
      country: city.country ?? null,
      latitude: city.latitude,
      longitude: city.longitude,
    };
    const g = garden
      ? await supabase.from("gardens").update(gardenData).eq("id", garden.id)
      : await supabase.from("gardens").insert(gardenData);
    const p = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, full_name: name.trim(), experience_level: exp, onboarding_completed: true }, { onConflict: "user_id" });
    setSaving(false);
    if (g.error || p.error) return toast.error("Não foi possível salvar. Tente novamente.");
    await invalidate("profile", "garden");
    setStep(7);
  }

  const cur = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Logo />
        {step < 7 && (
          <>
            <Progress value={((step + 1) / 7) * 100} className="mt-6" aria-label="Progresso" />
            <p className="mt-2 text-xs text-muted-foreground">Etapa {step + 1} de 7</p>
          </>
        )}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {step < 7 ? (
            <>
              <h1 className="text-2xl font-semibold">{cur.q}</h1>
              {cur.hint && <p className="mt-1 text-sm text-muted-foreground">{cur.hint}</p>}
              <div className="mt-6">
                {step === 0 && <Input autoFocus value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />}
                {step === 1 && (
                  <div className="grid gap-2">
                    {Object.entries(EXPERIENCE).map(([k, v]) => (
                      <Choice key={k} active={exp === k} onClick={() => setExp(k)}>{v}</Choice>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.entries(SPACES).map(([k, v]) => (
                      <Choice key={k} active={spaces.includes(k)} onClick={() => toggle(spaces, setSpaces, k)}>{v}</Choice>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(SIZES).map(([k, v]) => (
                        <Choice key={k} active={size === k} onClick={() => setSize(k)}>{v}</Choice>
                      ))}
                    </div>
                    <Input type="number" min={0} value={m2} onChange={(e) => setM2(e.target.value)} placeholder="Área em m² (opcional)" />
                  </div>
                )}
                {step === 4 && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(SUN).map(([k, v]) => (
                      <Choice key={k} active={sun === k} onClick={() => setSun(k)}>{v}</Choice>
                    ))}
                  </div>
                )}
                {step === 5 && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(OBJECTIVES).map(([k, v]) => (
                      <Choice key={k} active={objs.includes(k)} onClick={() => toggle(objs, setObjs, k)}>{v}</Choice>
                    ))}
                  </div>
                )}
                {step === 6 && (
                  <div className="space-y-2">
                    <CitySearch onSelect={setCity} />
                    {city && (
                      <p className="text-sm text-primary">
                        📍 {city.name}, {[city.admin1, city.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  Voltar
                </Button>
                {step < 6 ? (
                  <Button disabled={!cur.ok} onClick={() => setStep(step + 1)}>
                    Continuar
                  </Button>
                ) : (
                  <Button disabled={!cur.ok || saving} onClick={finish}>
                    {saving ? "Salvando..." : "Concluir"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="text-6xl">🌱</div>
              <h1 className="mt-4 text-2xl font-semibold">Sua horta está pronta para começar.</h1>
              <p className="mt-2 text-muted-foreground">Separamos plantas que combinam com o seu espaço.</p>
              <Button className="mt-6" size="lg" onClick={() => navigate({ to: "/app/recomendacoes" })}>
                Ver recomendações
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
