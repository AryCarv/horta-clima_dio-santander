import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Loader2, Snowflake, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY, DIFFICULTY, SUN, plantEmoji, searchCities, weatherLabel, type City, type Plant, type Recommendation } from "@/lib/hc";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ emoji = "🌱", title, text, action }: { emoji?: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center">
      <div className="text-5xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {text && <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function WeatherIcon({ code, className = "h-6 w-6" }: { code: number; className?: string }) {
  const i = weatherLabel(code).icon;
  const C = { sun: Sun, "cloud-sun": CloudSun, cloud: Cloud, fog: CloudFog, rain: CloudRain, storm: CloudLightning, snow: Snowflake }[i];
  return <C className={`${className} ${i === "sun" ? "text-sun-foreground" : i === "rain" || i === "storm" ? "text-chart-3" : "text-muted-foreground"}`} />;
}

export function CitySearch({ onSelect, defaultValue = "" }: { onSelect: (c: City) => void; defaultValue?: string }) {
  const [q, setQ] = useState(defaultValue);
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched || q.trim().length < 3) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setErr(false);
      try {
        setResults(await searchCities(q.trim()));
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q, touched]);

  return (
    <div className="relative">
      <Input
        value={q}
        placeholder="Digite o nome da cidade"
        onChange={(e) => {
          setTouched(true);
          setQ(e.target.value);
        }}
        aria-label="Buscar cidade"
      />
      {loading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      {err && <p className="mt-1 text-sm text-destructive">Não foi possível buscar cidades agora.</p>}
      {results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lg">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                onClick={() => {
                  onSelect(c);
                  setQ([c.name, c.admin1].filter(Boolean).join(", "));
                  setTouched(false);
                  setResults([]);
                }}
              >
                <span className="font-semibold">{c.name}</span>
                <span className="text-muted-foreground"> · {[c.admin1, c.country].filter(Boolean).join(", ")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {touched && !loading && !err && q.trim().length >= 3 && results.length === 0 && (
        <p className="mt-1 text-xs text-muted-foreground">Nenhuma cidade encontrada ainda…</p>
      )}
    </div>
  );
}

export function PlantCard({ plant, rec }: { plant: Plant; rec?: Recommendation }) {
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary text-3xl" aria-hidden>
          {plantEmoji(plant.slug)}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">{plant.name}</h3>
          <p className="text-xs text-muted-foreground">
            {CATEGORY[plant.category] ?? plant.category} · {DIFFICULTY[plant.difficulty]} · {SUN[plant.sunlight_requirement]}
          </p>
          <p className="text-xs text-muted-foreground">
            Ciclo: {plant.harvest_days_min}–{plant.harvest_days_max} dias
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {plant.suitable_for_small_spaces && <Badge variant="secondary">Boa para pequenos espaços</Badge>}
        {rec && (
          <Badge className={rec.score >= 60 ? "" : "bg-sun text-sun-foreground hover:bg-sun"}>{rec.label}</Badge>
        )}
      </div>
      {rec && (
        <ul className="mt-3 space-y-0.5 text-xs text-muted-foreground">
          {rec.reasons.slice(0, 3).map((r) => (
            <li key={r.text}>
              {r.ok ? "✓" : "⚠️"} {r.text}
            </li>
          ))}
        </ul>
      )}
      <Button asChild variant="outline" size="sm" className="mt-auto self-start pt-0" style={{ marginTop: "0.9rem" }}>
        <Link to="/app/plantas/$slug" params={{ slug: plant.slug }}>
          Ver detalhes
        </Link>
      </Button>
    </div>
  );
}
