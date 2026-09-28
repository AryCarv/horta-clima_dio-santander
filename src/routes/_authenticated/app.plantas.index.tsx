import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHeader, PlantCard } from "@/components/hc/common";
import { usePlants } from "@/hooks/use-hc";
import { CATEGORY, DIFFICULTY, SUN } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/plantas/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Plantas — HortaClima" }, { name: "description", content: "Catálogo de plantas." }] }),
  component: Catalog,
});

function F({ v, set, opts, all }: { v: string; set: (s: string) => void; opts: Record<string, string>; all: string }) {
  return <Select value={v} onValueChange={set}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
    <SelectContent><SelectItem value="all">{all}</SelectItem>{Object.entries(opts).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent></Select>;
}

function Catalog() {
  const { data: plants } = usePlants();
  const [q, setQ] = useState(""); const [d, setD] = useState("all"); const [s, setS] = useState("all"); const [c, setC] = useState("all"); const [small, setSmall] = useState("all"); const [t, setT] = useState("all");
  const list = (plants ?? []).filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) && (d === "all" || p.difficulty === d) && (s === "all" || p.sunlight_requirement === s) &&
    (c === "all" || p.category === c) && (small === "all" || p.suitable_for_small_spaces) && (t === "all" || (t === "fast" ? p.harvest_days_min <= 45 : t === "mid" ? p.harvest_days_min > 45 && p.harvest_days_min <= 70 : p.harvest_days_min > 70)));
  return (
    <div>
      <PageHeader title="Plantas" />
      <div className="mb-5 flex flex-wrap gap-2">
        <Input placeholder="Buscar pelo nome" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
        <F v={d} set={setD} opts={DIFFICULTY} all="Dificuldade" />
        <F v={s} set={setS} opts={{ full_sun: SUN.full_sun, partial_sun: SUN.partial_sun }} all="Luz" />
        <F v={c} set={setC} opts={CATEGORY} all="Tipo" />
        <F v={small} set={setSmall} opts={{ yes: "Pequenos espaços" }} all="Qualquer espaço" />
        <F v={t} set={setT} opts={{ fast: "Até 45 dias", mid: "45–70 dias", long: "Mais de 70 dias" }} all="Tempo" />
      </div>
      {list.length === 0 ? <EmptyState emoji="🔎" title="Nenhuma planta encontrada" text="Tente outros filtros." /> :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PlantCard key={p.id} plant={p} />)}</div>}
    </div>
  );
}
