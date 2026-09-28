import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/hc/common";
import { useGardenPlants, useProfile, useTasks } from "@/hooks/use-hc";

export const Route = createFileRoute("/_authenticated/app/calendario")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Calendário — HortaClima" }, { name: "description", content: "Plantios, cuidados e colheitas." }] }),
  component: Cal,
});

type Ev = { date: string; emoji: string; title: string };

function Cal() {
  const { data: tasks } = useTasks();
  const { data: gps } = useGardenPlants();
  const { data: profile } = useProfile();
  const [view, setView] = useState("month");
  const [cur, setCur] = useState(new Date());
  const [sel, setSel] = useState<Ev | null>(null);
  const ws = profile?.week_start === "monday" ? 1 : 0;
  const evs: Ev[] = [
    ...(tasks ?? []).map((t) => ({ date: t.due_date, emoji: t.task_type === "harvest" ? "🥕" : "💧", title: t.title })),
    ...(gps ?? []).map((g) => ({ date: g.planted_at, emoji: "🌱", title: `Plantio: ${g.plants?.name}` })),
    ...(gps ?? []).filter((g) => g.expected_harvest_start).map((g) => ({ date: g.expected_harvest_start!, emoji: "🥕", title: `Início da colheita: ${g.plants?.name}` })),
  ];
  const start = view === "month" ? startOfWeek(startOfMonth(cur), { weekStartsOn: ws }) : startOfWeek(cur, { weekStartsOn: ws });
  const end = view === "month" ? endOfWeek(endOfMonth(cur), { weekStartsOn: ws }) : endOfWeek(cur, { weekStartsOn: ws });
  const days: Date[] = []; for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  const move = (n: number) => setCur(view === "month" ? addMonths(cur, n) : addDays(cur, 7 * n));
  return (
    <div>
      <PageHeader title="Calendário" subtitle="🌱 Plantio · 💧 Cuidado · 🥕 Colheita" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => move(-1)}>←</Button>
        <span className="min-w-40 text-center font-semibold capitalize">{format(cur, view === "month" ? "MMMM yyyy" : "'Semana de' dd/MM", { locale: ptBR })}</span>
        <Button variant="outline" size="sm" onClick={() => move(1)}>→</Button>
        <Tabs value={view} onValueChange={setView}><TabsList><TabsTrigger value="month">Mês</TabsTrigger><TabsTrigger value="week">Semana</TabsTrigger></TabsList></Tabs>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {days.slice(0, 7).map((d) => <div key={d.toISOString()} className="p-1 text-center font-semibold capitalize text-muted-foreground">{format(d, "EEE", { locale: ptBR })}</div>)}
        {days.map((d) => { const k = format(d, "yyyy-MM-dd"); const e = evs.filter((x) => x.date === k); return (
          <div key={k} className={`min-h-16 rounded-lg border bg-card p-1 ${view === "week" ? "min-h-40" : ""} ${d.getMonth() !== cur.getMonth() && view === "month" ? "opacity-40" : ""}`}>
            <div className="font-semibold">{d.getDate()}</div>
            {e.slice(0, view === "week" ? 10 : 3).map((x, i) => <button key={i} onClick={() => setSel(x)} className="block w-full truncate text-left hover:underline">{x.emoji} <span className="hidden sm:inline">{x.title}</span></button>)}
            {view === "month" && e.length > 3 && <span className="text-muted-foreground">+{e.length - 3}</span>}
          </div>); })}
      </div>
      {sel && <div className="mt-4 rounded-xl border bg-secondary p-4 text-sm"><b>{sel.emoji} {sel.title}</b> — {sel.date.split("-").reverse().join("/")} <Button size="sm" variant="ghost" onClick={() => setSel(null)}>Fechar</Button></div>}
    </div>
  );
}
