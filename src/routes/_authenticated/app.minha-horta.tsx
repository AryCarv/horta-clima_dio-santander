import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddPlantDialog } from "@/components/hc/AddPlantDialog";
import { EmptyState, PageHeader } from "@/components/hc/common";
import { useGardenPlants, useInvalidate, useTasks, useUser } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVE_STATUSES, STATUS, daysSince, fmtDate, plantEmoji, todayISO, type GardenPlant } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/minha-horta")({
  head: () => ({ meta: [{ title: "Minha Horta — HortaClima" }, { name: "description", content: "Plantas em cultivo." }] }),
  component: MyGarden,
});

function MyGarden() {
  const { data: gps, isLoading } = useGardenPlants();
  const { data: tasks } = useTasks();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const list = (gps ?? []).filter((g) =>
    filter === "active" ? ACTIVE_STATUSES.includes(g.status)
    : filter === "soon" ? ACTIVE_STATUSES.includes(g.status) && !!g.expected_harvest_start && daysSince(g.expected_harvest_start) >= -14
    : filter === "done" ? !ACTIVE_STATUSES.includes(g.status) : true);
  const pending = (tasks ?? []).filter((t) => t.status === "pending");
  return (
    <div>
      <PageHeader title="Minha Horta" action={<Button onClick={() => setOpen(true)}>+ Adicionar planta</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Em cultivo", (gps ?? []).filter((g) => ACTIVE_STATUSES.includes(g.status)).length], ["Tarefas pendentes", pending.length], ["Prontas p/ colheita", (gps ?? []).filter((g) => g.status === "ready").length], ["Ciclos concluídos", (gps ?? []).filter((g) => !ACTIVE_STATUSES.includes(g.status)).length]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border bg-card p-4"><p className="text-2xl font-semibold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
        ))}
      </div>
      <Tabs value={filter} onValueChange={setFilter} className="mb-4"><TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger><TabsTrigger value="active">Ativas</TabsTrigger><TabsTrigger value="soon">Próx. colheita</TabsTrigger><TabsTrigger value="done">Concluídas</TabsTrigger>
      </TabsList></Tabs>
      {!isLoading && list.length === 0 ? (
        <EmptyState title="Sua horta ainda está vazia." action={<Button asChild><Link to="/app/recomendacoes">Escolher minha primeira planta</Link></Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">{list.map((g) => <GPCard key={g.id} gp={g} nextTask={pending.find((t) => t.garden_plant_id === g.id)?.title} />)}</div>
      )}
      <AddPlantDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function GPCard({ gp, nextTask }: { gp: GardenPlant; nextTask?: string }) {
  const invalidate = useInvalidate();
  const { data: user } = useUser();
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("unidades");
  const [harv, setHarv] = useState(false);
  async function setStatus(s: string) {
    await supabase.from("garden_plants").update({ status: s }).eq("id", gp.id);
    invalidate("garden_plants");
  }
  async function harvest() {
    if (!user) return;
    const { error } = await supabase.from("harvests").insert({ user_id: user.id, garden_id: gp.garden_id, garden_plant_id: gp.id, harvest_date: todayISO(), quantity: qty ? Number(qty) : null, unit });
    if (error) return toast.error("Não foi possível registrar a colheita.");
    await supabase.from("garden_plants").update({ status: "harvested" }).eq("id", gp.id);
    toast.success("🥕 Colheita registrada!");
    setHarv(false);
    invalidate("garden_plants", "harvests");
  }
  async function remove() {
    if (!confirm("Remover esta planta e suas tarefas?")) return;
    await supabase.from("garden_plants").delete().eq("id", gp.id);
    invalidate("garden_plants", "tasks");
  }
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl">{plantEmoji(gp.plants?.slug)}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2"><h3 className="font-display text-lg font-semibold">{gp.plants?.name} ×{gp.quantity}</h3><Badge variant="secondary">{STATUS[gp.status]}</Badge></div>
          <p className="text-xs text-muted-foreground">Plantio {fmtDate(gp.planted_at)} · {Math.max(0, daysSince(gp.planted_at))} dias</p>
          <p className="text-xs text-muted-foreground">Colheita prevista: {fmtDate(gp.expected_harvest_start)} – {fmtDate(gp.expected_harvest_end)}</p>
          {nextTask && <p className="mt-1 text-xs">Próxima tarefa: {nextTask}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Select value={gp.status} onValueChange={setStatus}><SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select>
        <Button size="sm" variant="outline" onClick={() => setHarv(!harv)}>Registrar colheita</Button>
        <Button size="sm" variant="ghost" onClick={remove}>Remover</Button>
      </div>
      {harv && (
        <div className="mt-3 flex gap-2">
          <Input type="number" min={0} placeholder="Qtd." value={qty} onChange={(e) => setQty(e.target.value)} className="h-8 w-24" />
          <Select value={unit} onValueChange={setUnit}><SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["g", "kg", "unidades", "maços"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
          <Button size="sm" onClick={harvest}>Salvar</Button>
        </div>
      )}
    </div>
  );
}
