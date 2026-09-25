import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarden, useInvalidate, usePlants, useUser } from "@/hooks/use-hc";
import { CONTAINERS, buildTasks, harvestWindow, todayISO } from "@/lib/hc";

export function AddPlantDialog({
  open,
  onOpenChange,
  plantId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plantId?: string;
}) {
  const { data: plants } = usePlants();
  const { data: garden } = useGarden();
  const { data: user } = useUser();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const [pid, setPid] = useState(plantId ?? "");
  const [date, setDate] = useState(todayISO());
  const [container, setContainer] = useState("pot");
  const [liters, setLiters] = useState("");
  const [qty, setQty] = useState("1");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setPid(plantId ?? "");
  }, [open, plantId]);

  async function save() {
    const plant = plants?.find((p) => p.id === pid);
    if (!plant) return toast.error("Escolha uma planta.");
    if (!garden || !user) return toast.error("Complete a configuração da sua horta primeiro.");
    const q = parseInt(qty, 10);
    if (!q || q < 1 || q > 1000) return toast.error("Informe uma quantidade entre 1 e 1000.");
    if (!date) return toast.error("Informe a data de plantio.");
    if (notes.length > 1000) return toast.error("Observações muito longas.");
    setSaving(true);
    const win = harvestWindow(plant, date);
    const { data: gp, error } = await supabase
      .from("garden_plants")
      .insert({
        user_id: user.id,
        garden_id: garden.id,
        plant_id: plant.id,
        status: date > todayISO() ? "planned" : "planted",
        planted_at: date,
        expected_harvest_start: win.start,
        expected_harvest_end: win.end,
        container_type: container,
        container_size_liters: liters ? Number(liters) : null,
        quantity: q,
        notes: notes.trim() || null,
      })
      .select()
      .single();
    if (error || !gp) {
      setSaving(false);
      return toast.error("Não foi possível salvar. Tente novamente.");
    }
    await supabase.from("tasks").insert(
      buildTasks(plant, date).map((t) => ({ ...t, user_id: user.id, garden_id: garden.id, garden_plant_id: gp.id, source: "template" })),
    );
    setSaving(false);
    await invalidate("garden_plants", "tasks");
    toast.success(`🌱 ${plant.name} adicionada à sua horta!`);
    onOpenChange(false);
    setNotes("");
    navigate({ to: "/app/minha-horta" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar planta à horta</DialogTitle>
          <DialogDescription>Vamos calcular a previsão de colheita e criar tarefas básicas.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Planta</Label>
            <Select value={pid} onValueChange={setPid}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma planta" />
              </SelectTrigger>
              <SelectContent>
                {plants?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ap-date">Data do plantio</Label>
              <Input id="ap-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-qty">Quantidade</Label>
              <Input id="ap-qty" type="number" min={1} max={1000} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Recipiente</Label>
              <Select value={container} onValueChange={setContainer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTAINERS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-l">Tamanho (litros)</Label>
              <Input id="ap-l" type="number" min={0} placeholder="Opcional" value={liters} onChange={(e) => setLiters(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ap-notes">Observações</Label>
            <Textarea id="ap-notes" maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
