import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHeader } from "@/components/hc/common";
import { useGarden, useGardenPlants, useInvalidate, useUser } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";
import { JOURNAL_TYPES, fmtDate, todayISO } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/diario")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Diário da Horta — HortaClima" }, { name: "description", content: "Registros da sua horta." }] }),
  component: Journal,
});

function Photo({ path }: { path: string }) {
  const { data } = useQuery({ queryKey: ["photo", path], queryFn: async () => (await supabase.storage.from("journal-photos").createSignedUrl(path, 3600)).data?.signedUrl, staleTime: 50 * 60_000 });
  return data ? <img src={data} alt="Foto do registro" className="mt-2 max-h-64 rounded-lg object-cover" loading="lazy" /> : null;
}

function Journal() {
  const { data: user } = useUser();
  const { data: garden } = useGarden();
  const { data: gps } = useGardenPlants();
  const invalidate = useInvalidate();
  const { data: entries } = useQuery({ queryKey: ["journal", user?.id], enabled: !!user, queryFn: async () => (await supabase.from("journal_entries").select("*").order("entry_date", { ascending: false }).order("created_at", { ascending: false })).data ?? [] });
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("observation"); const [gp, setGp] = useState("none"); const [file, setFile] = useState<File | null>(null); const [saving, setSaving] = useState(false);
  async function save() {
    if (!user || !garden) return;
    if (!title.trim()) return toast.error("Informe um título.");
    if (file && (file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/"))) return toast.error("Envie uma imagem de até 5 MB.");
    setSaving(true);
    let image_path: string | null = null;
    if (file) {
      image_path = `${user.id}/${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() ?? "jpg"}`;
      const up = await supabase.storage.from("journal-photos").upload(image_path, file);
      if (up.error) { setSaving(false); return toast.error("Falha ao enviar a foto."); }
    }
    const { error } = await supabase.from("journal_entries").insert({ user_id: user.id, garden_id: garden.id, title: title.trim().slice(0, 150), content: content.slice(0, 5000), entry_date: date, entry_type: type, garden_plant_id: gp === "none" ? null : gp, image_path });
    setSaving(false);
    if (error) return toast.error("Não foi possível salvar.");
    toast.success("Registro salvo 📓"); setTitle(""); setContent(""); setFile(null); invalidate("journal");
  }
  async function del(id: string, path: string | null) {
    if (path) await supabase.storage.from("journal-photos").remove([path]);
    await supabase.from("journal_entries").delete().eq("id", id); invalidate("journal");
  }
  return (
    <div>
      <PageHeader title="Diário da Horta" />
      <div className="mb-6 space-y-3 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="w-64" maxLength={150} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          <Select value={type} onValueChange={setType}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(JOURNAL_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select>
          <Select value={gp} onValueChange={setGp}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Sem planta</SelectItem>{gps?.map((g) => <SelectItem key={g.id} value={g.id}>{g.plants?.name}</SelectItem>)}</SelectContent></Select>
        </div>
        <Textarea placeholder="O que você observou?" value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} />
        <div className="flex flex-wrap items-center gap-2"><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-64" /><Button onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar registro"}</Button></div>
      </div>
      {entries?.length === 0 ? <EmptyState emoji="📓" title="Nenhum registro ainda" text="Anote observações e acompanhe o crescimento." /> : (
        <ul className="space-y-3">{entries?.map((e) => (
          <li key={e.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{e.title}</h3><p className="text-xs text-muted-foreground">{fmtDate(e.entry_date)} · <Badge variant="secondary">{JOURNAL_TYPES[e.entry_type]}</Badge> {gps?.find((g) => g.id === e.garden_plant_id)?.plants?.name}</p></div>
              <Button size="sm" variant="ghost" onClick={() => del(e.id, e.image_path)}>Excluir</Button></div>
            {e.content && <p className="mt-2 whitespace-pre-wrap text-sm">{e.content}</p>}
            {e.image_path && <Photo path={e.image_path} />}
          </li>))}</ul>)}
    </div>
  );
}
