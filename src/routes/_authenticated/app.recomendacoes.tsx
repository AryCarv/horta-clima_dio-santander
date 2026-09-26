import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PlantCard } from "@/components/hc/common";
import { useGarden, usePlants, useProfile, useWeather } from "@/hooks/use-hc";
import { recommend } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/recomendacoes")({
  head: () => ({ meta: [{ title: "O que posso plantar agora? — HortaClima" }, { name: "description", content: "Recomendações para seu espaço." }] }),
  component: Recs,
});

function Recs() {
  const { data: plants } = usePlants();
  const { data: garden } = useGarden();
  const { data: profile } = useProfile();
  const { data: w } = useWeather(garden);
  const avg = w ? w.daily.reduce((s, d) => s + d.max, 0) / w.daily.length : null;
  const recs = (plants ?? []).map((p) => recommend(p, garden ?? null, profile ?? null, undefined, avg)).sort((a, b) => b.score - a.score).slice(0, 8);
  return (
    <div>
      <PageHeader title="O que posso plantar agora?" subtitle="Sugestões baseadas no seu espaço, luz, experiência, mês atual e clima." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recs.map((r) => <PlantCard key={r.plant.id} plant={r.plant} rec={r} />)}</div>
      <p className="mt-6 text-xs text-muted-foreground">As compatibilidades são heurísticas gerais e não substituem avaliação agronômica.</p>
    </div>
  );
}
