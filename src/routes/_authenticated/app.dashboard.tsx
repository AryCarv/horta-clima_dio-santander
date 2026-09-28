import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState, PlantCard, WeatherIcon } from "@/components/hc/common";
import { useGarden, useGardenPlants, useInvalidate, usePlants, useProfile, useTasks, useWeather } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVE_STATUSES, fmtDate, recommend, temp, todayISO, weatherLabel } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/dashboard")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Dashboard — HortaClima" }, { name: "description", content: "Sua horta hoje." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useProfile();
  const { data: garden } = useGarden();
  const { data: plants } = usePlants();
  const { data: gps } = useGardenPlants();
  const { data: tasks } = useTasks();
  const { data: w, isError } = useWeather(garden);
  const invalidate = useInvalidate();
  const h = new Date().getHours();
  const greet = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const today = todayISO();
  const todays = (tasks ?? []).filter((t) => t.status === "pending" && t.due_date <= today);
  const active = (gps ?? []).filter((g) => ACTIVE_STATUSES.includes(g.status));
  const recs = (plants ?? []).map((p) => recommend(p, garden ?? null, profile ?? null)).sort((a, b) => b.score - a.score).slice(0, 4);
  const next = active.filter((g) => g.expected_harvest_start).sort((a, b) => a.expected_harvest_start!.localeCompare(b.expected_harvest_start!))[0];

  async function done(id: string) {
    await supabase.from("tasks").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
    invalidate("tasks");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{greet}, {profile?.full_name?.split(" ")[0] ?? ""}!</h1>
        <p className="text-muted-foreground">Veja como está sua horta hoje.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">📍 {garden?.city ?? "Sem cidade"}</p>
          {w ? (
            <>
              <div className="mt-2 flex items-center gap-3"><WeatherIcon code={w.current.code} className="h-10 w-10" /><span className="text-4xl font-semibold">{temp(w.current.temperature, profile?.temperature_unit)}</span></div>
              <p className="text-sm">{weatherLabel(w.current.code).label} · chuva {w.daily[0].rainProb}%</p>
              <p className="text-xs text-muted-foreground">Máx {temp(w.daily[0].max, profile?.temperature_unit)} · Mín {temp(w.daily[0].min, profile?.temperature_unit)}</p>
            </>
          ) : <p className="mt-2 text-sm text-muted-foreground">{isError ? "Clima indisponível no momento." : "Carregando clima…"}</p>}
          <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/app/clima">Ver previsão</Link></Button>
        </div>
        <div className="rounded-2xl border bg-card p-5 md:col-span-2">
          <h2 className="text-lg font-semibold">O que fazer hoje</h2>
          {todays.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Nada pendente para hoje. 🌿</p> : (
            <ul className="mt-2 space-y-2">{todays.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm"><Checkbox onCheckedChange={() => done(t.id)} aria-label="Concluir" />{t.title}{t.due_date < today && <span className="text-xs text-sun-foreground">(pendente desde {fmtDate(t.due_date)})</span>}</li>
            ))}</ul>
          )}
        </div>
      </div>
      {active.length === 0 ? (
        <EmptyState title="Sua horta ainda está vazia." action={<Button asChild><Link to="/app/recomendacoes">Escolher minha primeira planta</Link></Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5"><h2 className="text-lg font-semibold">Minha Horta</h2>
            <p className="mt-2 text-sm">{active.length} plantas ativas · {(tasks ?? []).filter((t) => t.status === "pending").length} tarefas pendentes</p></div>
          <div className="rounded-2xl border bg-card p-5"><h2 className="text-lg font-semibold">Próxima colheita</h2>
            <p className="mt-2 text-sm">{next ? `${next.plants?.name} — a partir de ${fmtDate(next.expected_harvest_start)}` : "—"}</p></div>
        </div>
      )}
      <div>
        <h2 className="mb-3 text-xl font-semibold">O que plantar agora</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recs.map((r) => <PlantCard key={r.plant.id} plant={r.plant} rec={r} />)}</div>
      </div>
    </div>
  );
}
