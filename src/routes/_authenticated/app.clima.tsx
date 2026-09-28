import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CitySearch, PageHeader, WeatherIcon } from "@/components/hc/common";
import { useGarden, useInvalidate, useProfile, useWeather } from "@/hooks/use-hc";
import { supabase } from "@/integrations/supabase/client";
import { interpretWeather, temp, weatherLabel } from "@/lib/hc";

export const Route = createFileRoute("/_authenticated/app/clima")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Clima — HortaClima" }, { name: "description", content: "Previsão de 7 dias para sua horta." }] }),
  component: Clima,
});

function Clima() {
  const { data: garden } = useGarden();
  const { data: profile } = useProfile();
  const { data: w, isLoading, isError, refetch } = useWeather(garden);
  const invalidate = useInvalidate();
  const u = profile?.temperature_unit;
  return (
    <div className="space-y-6">
      <PageHeader title="Clima" subtitle={`📍 ${[garden?.city, garden?.state].filter(Boolean).join(", ") || "Cidade não definida"}`} />
      <div className="max-w-sm"><p className="mb-1 text-sm text-muted-foreground">Trocar cidade</p>
        <CitySearch onSelect={async (c) => { if (!garden) return; await supabase.from("gardens").update({ city: c.name, state: c.admin1 ?? null, country: c.country ?? null, latitude: c.latitude, longitude: c.longitude }).eq("id", garden.id); toast.success("Cidade atualizada"); invalidate("garden"); }} /></div>
      {isLoading && <Skeleton className="h-40 w-full" />}
      {isError && <div className="rounded-xl border p-4">Não foi possível carregar o clima agora. <Button size="sm" variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {w && (<>
        <div className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2">
          <div className="flex items-center gap-4"><WeatherIcon code={w.current.code} className="h-14 w-14" /><div><p className="text-5xl font-semibold">{temp(w.current.temperature, u)}</p><p>{weatherLabel(w.current.code).label}</p></div></div>
          <div className="grid grid-cols-2 gap-2 text-sm"><span>Sensação: {temp(w.current.apparent, u)}</span><span>Umidade: {w.current.humidity}%</span><span>Vento: {Math.round(w.current.wind)} km/h</span><span>Precipitação: {w.current.precipitation} mm</span></div>
        </div>
        {interpretWeather(w).map((a) => <div key={a.text} className="rounded-xl bg-accent p-3 text-sm text-accent-foreground">{a.emoji} {a.text}</div>)}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{w.daily.map((d) => (
          <div key={d.date} className="rounded-xl border bg-card p-3 text-center text-sm"><p className="font-semibold capitalize">{format(parseISO(d.date), "EEE dd", { locale: ptBR })}</p><WeatherIcon code={d.code} className="mx-auto my-2 h-7 w-7" />
            <p>{temp(d.max, u)} / {temp(d.min, u)}</p><p className="text-xs text-muted-foreground">💧 {d.rainProb}% · {d.rainSum} mm</p><p className="text-xs text-muted-foreground">💨 {Math.round(d.wind)} km/h</p></div>))}</div>
        <p className="text-xs text-muted-foreground">Dados meteorológicos fornecidos por Open-Meteo. Atualizado às {format(parseISO(w.fetchedAt), "HH:mm")}.</p>
      </>)}
    </div>
  );
}
