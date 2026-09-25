import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader } from "@/components/hc/common";
import { useGarden, useGardenPlants, useInvalidate, useTasks, useUser } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";
import { TASK_TYPES, fmtDate, todayISO } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas — HortaClima" }, { name: "description", content: "Cuidados da sua horta." }] }),
  component: Tasks,
});

function Tasks() {
  const { data: tasks } = useTasks();
  const { data: gps } = useGardenPlants();
  const { data: garden } = useGarden();
  const { data: user } = useUser();
  const invalidate = useInvalidate();
  const [tab, setTab] = useState("today");
  const [title, setTitle] = useState(""); const [date, setDate] = useState(todayISO());
  const [edit, setEdit] = useState<{ id: string; title: string; due_date: string } | null>(null);
  const t0 = todayISO();
  const list = (tasks ?? []).filter((t) => tab === "done" ? t.status === "completed" : t.status === "pending" && (tab === "today" ? t.due_date === t0 : tab === "late" ? t.due_date < t0 : t.due_date > t0));
  const name = (id: string | null) => gps?.find((g) => g.id === id)?.plants?.name;
  async function toggle(id: string, done: boolean) {
    await supabase.from("tasks").update({ status: done ? "completed" : "pending", completed_at: done ? new Date().toISOString() : null }).eq("id", id);
    if (done) toast.success("Tarefa concluída 🌿");
    invalidate("tasks");
  }
  async function add() {
    if (!title.trim() || !garden || !user) return toast.error("Informe um título.");
    await supabase.from("tasks").insert({ user_id: user.id, garden_id: garden.id, title: title.trim().slice(0, 150), due_date: date, task_type: "management" });
    setTitle(""); invalidate("tasks");
  }
  async function saveEdit() {
    if (!edit || !edit.title.trim()) return;
    await supabase.from("tasks").update({ title: edit.title.trim().slice(0, 150), due_date: edit.due_date }).eq("id", edit.id);
    setEdit(null); invalidate("tasks");
  }
  return (
    <div>
      <PageHeader title="Tarefas" />
      <div className="mb-4 flex flex-wrap gap-2"><Input placeholder="Nova tarefa" value={title} onChange={(e) => setTitle(e.target.value)} className="w-64" maxLength={150} /><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" /><Button onClick={add}>Adicionar</Button></div>
      <Tabs value={tab} onValueChange={setTab} className="mb-4"><TabsList><TabsTrigger value="today">Hoje</TabsTrigger><TabsTrigger value="next">Próximas</TabsTrigger><TabsTrigger value="late">Atrasadas</TabsTrigger><TabsTrigger value="done">Concluídas</TabsTrigger></TabsList></Tabs>
      {list.length === 0 ? <EmptyState emoji="✅" title="Nenhuma tarefa aqui" /> : (
        <ul className="space-y-2">{list.map((t) => (
          <li key={t.id} className={`rounded-xl border bg-card p-3 ${tab === "late" ? "border-sun bg-accent/40" : ""}`}>
            {edit?.id === t.id ? (
              <div className="flex flex-wrap gap-2"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="w-64" /><Input type="date" value={edit.due_date} onChange={(e) => setEdit({ ...edit, due_date: e.target.value })} className="w-40" /><Button size="sm" onClick={saveEdit}>Salvar</Button></div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><p className={`font-semibold ${t.status === "completed" ? "line-through opacity-60" : ""}`}>{t.title}</p>
                  {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                  <div className="mt-1 flex gap-2 text-xs"><Badge variant="secondary">{TASK_TYPES[t.task_type] ?? t.task_type}</Badge><span>{fmtDate(t.due_date)}</span>{name(t.garden_plant_id) && <span>· {name(t.garden_plant_id)}</span>}</div></div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => toggle(t.id, t.status !== "completed")}>{t.status === "completed" ? "Reabrir" : "Concluir"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEdit({ id: t.id, title: t.title, due_date: t.due_date })}>Editar</Button>
                  <Button size="sm" variant="ghost" onClick={async () => { await supabase.from("tasks").delete().eq("id", t.id); invalidate("tasks"); }}>Excluir</Button>
                </div>
              </div>)}
          </li>))}</ul>)}
    </div>
  );
}
