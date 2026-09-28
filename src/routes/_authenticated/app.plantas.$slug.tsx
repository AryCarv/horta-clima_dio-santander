import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddPlantDialog } from "@/components/hc/AddPlantDialog";
import { EmptyState } from "@/components/hc/common";
import { useGarden, usePlants, useProfile } from "@/hooks/use-hc";
import { CATEGORY, DIFFICULTY, SUN, plantEmoji, recommend } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/plantas/$slug")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Detalhes da planta — HortaClima" }, { name: "description", content: "Cuidados, plantio e colheita." }] }),
  component: Detail,
});

function Detail() {
  const { slug } = Route.useParams();
  const { data: plants, isLoading } = usePlants();
  const { data: garden } = useGarden();
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);
  const p = plants?.find((x) => x.slug === slug);
  if (isLoading) return null;
  if (!p) return <EmptyState title="Planta não encontrada" action={<Button asChild><Link to="/app/plantas">Ver catálogo</Link></Button>} />;
  const r = recommend(p, garden ?? null, profile ?? null);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-secondary text-5xl">{plantEmoji(p.slug)}</div>
        <div className="flex-1"><h1 className="text-3xl font-semibold">{p.name}</h1><p className="text-muted-foreground">{CATEGORY[p.category]} · {DIFFICULTY[p.difficulty]}</p></div>
        <Button size="lg" onClick={() => setOpen(true)}>Adicionar à minha horta</Button>
      </div>
      <p>{p.description}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["☀️ Luz", SUN[p.sunlight_requirement]], ["💧 Água", p.water_need], ["📅 Ciclo", `${p.harvest_days_min}–${p.harvest_days_max} dias`], ["🏠 Espaço", p.minimum_container_liters ? `Vaso de ${p.minimum_container_liters} L+` : "—"]].map(([a, b]) => (
          <div key={a} className="rounded-2xl border bg-card p-4"><p className="text-sm text-muted-foreground">{a}</p><p className="font-semibold capitalize">{b}</p></div>))}
      </div>
      <div className="rounded-2xl border bg-secondary/50 p-5">
        <h2 className="text-lg font-semibold">É adequada para mim? — Compatibilidade {r.level}</h2>
        <p className="text-sm font-semibold">{r.label}</p>
        <ul className="mt-2 space-y-1 text-sm">{r.reasons.map((x) => <li key={x.text}>{x.ok ? "✓" : "⚠️"} {x.text}</li>)}</ul>
        <p className="mt-2 text-xs text-muted-foreground">Indicação geral, não é garantia de cultivo.</p>
      </div>
      {[["Cuidados gerais", p.general_care], ["Plantio", p.planting_guidance], ["Colheita", p.harvest_guidance]].map(([t, x]) => (
        <section key={t}><h2 className="text-xl font-semibold">{t}</h2><p className="mt-1 text-muted-foreground">{x}</p></section>))}
      <p className="text-xs text-muted-foreground">{p.source_reference} · Informações gerais; variam conforme variedade, região e manejo.</p>
      <AddPlantDialog open={open} onOpenChange={setOpen} plantId={p.id} />
    </div>
  );
}
