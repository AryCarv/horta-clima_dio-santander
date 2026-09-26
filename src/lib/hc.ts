import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export type Plant = Tables<"plants">;
export type Garden = Tables<"gardens">;
export type Profile = Tables<"profiles">;
export type GardenPlant = Tables<"garden_plants"> & { plants?: Plant | null };
export type Task = Tables<"tasks">;

// ---------- Rótulos ----------
export const EXPERIENCE: Record<string, string> = {
  beginner: "Nunca cultivei",
  basic: "Sou iniciante",
  intermediate: "Já cultivo algumas plantas",
  advanced: "Tenho bastante experiência",
};
export const SPACES: Record<string, string> = {
  balcony: "Varanda",
  sacada: "Sacada",
  backyard: "Quintal",
  corridor: "Corredor",
  terrace: "Terraço",
  service_area: "Área de serviço",
  pot: "Vasos",
  planter: "Jardineiras",
  other: "Outro",
};
export const SIZES: Record<string, string> = {
  very_small: "Muito pequeno",
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
};
export const SUN: Record<string, string> = {
  full_sun: "Muito sol",
  partial_sun: "Sol parcial",
  low_light: "Pouco sol",
  unknown: "Não sei",
};
export const OBJECTIVES: Record<string, string> = {
  tempero: "Temperos",
  folha: "Folhas",
  hortalica: "Hortaliças",
  fruto: "Frutos",
  food: "Produzir alimentos para casa",
  learn: "Aprender a cultivar",
  unknown: "Ainda não sei",
};
export const DIFFICULTY: Record<string, string> = { easy: "Fácil", medium: "Média", hard: "Difícil" };
export const CATEGORY: Record<string, string> = {
  folha: "Folha",
  tempero: "Tempero",
  fruto: "Fruto",
  raiz: "Raiz",
  "hortaliça": "Hortaliça",
};
export const STATUS: Record<string, string> = {
  planned: "Planejada",
  planted: "Plantada",
  growing: "Em crescimento",
  ready: "Pronta para colheita",
  harvested: "Colhida",
  ended: "Encerrada",
};
export const ACTIVE_STATUSES = ["planned", "planted", "growing", "ready"];
export const TASK_TYPES: Record<string, string> = {
  observation: "Observação",
  irrigation: "Irrigação",
  fertilization: "Adubação",
  transplant: "Transplante",
  management: "Manejo",
  harvest: "Colheita",
};
export const JOURNAL_TYPES: Record<string, string> = {
  observation: "Observação",
  planting: "Plantio",
  problem: "Problema",
  growth: "Crescimento",
  harvest: "Colheita",
  other: "Outro",
};
export const CONTAINERS: Record<string, string> = {
  pot: "Vaso",
  planter: "Jardineira",
  bed: "Canteiro",
  bag: "Saco de cultivo",
  other: "Outro",
};

export const todayISO = () => format(new Date(), "yyyy-MM-dd");
export const fmtDate = (d?: string | null) => (d ? format(parseISO(d), "dd/MM/yyyy") : "—");

// ---------- Recomendação v1 (heurística determinística) ----------
export type Recommendation = {
  plant: Plant;
  score: number;
  label: string;
  level: "Alta" | "Média" | "Baixa";
  reasons: { ok: boolean; text: string }[];
};

const BIG_SPACES = ["backyard", "terrace"];

export function recommend(
  plant: Plant,
  garden: Garden | null,
  profile: Profile | null,
  month = new Date().getMonth() + 1,
  forecastMaxAvg?: number | null,
): Recommendation {
  let score = 0;
  const reasons: Recommendation["reasons"] = [];
  const spaces = garden?.space_types ?? [];
  const bigSpace = spaces.some((s) => BIG_SPACES.includes(s)) || garden?.size_category === "large";

  // Espaço
  if (plant.suitable_for_small_spaces || bigSpace) {
    score += 30;
    reasons.push({ ok: true, text: plant.suitable_for_small_spaces ? "Adequada para vasos e pequenos espaços" : "Seu espaço comporta plantas maiores" });
  } else {
    score -= 30;
    reasons.push({ ok: false, text: "Precisa de mais espaço do que o informado" });
  }

  // Luz
  const sun = garden?.sunlight_level ?? "unknown";
  const req = plant.sunlight_requirement;
  const rank: Record<string, number> = { low_light: 0, partial_sun: 1, full_sun: 2 };
  if (sun === "unknown") {
    score += 10;
    reasons.push({ ok: false, text: "Observe quantas horas de sol o local recebe" });
  } else if (rank[sun] >= rank[req]) {
    score += 25;
    reasons.push({ ok: true, text: "Sua iluminação atende às necessidades gerais" });
  } else if (rank[req] - rank[sun] === 1) {
    score += 10;
    reasons.push({ ok: false, text: "A luz do seu espaço pode ser um pouco limitada" });
  } else {
    score -= 25;
    reasons.push({ ok: false, text: "Precisa de mais sol do que o seu espaço recebe" });
  }

  // Experiência
  const exp = profile?.experience_level ?? "beginner";
  const novice = exp === "beginner" || exp === "basic";
  if (plant.difficulty === "easy") {
    score += 20;
    reasons.push({ ok: true, text: "Compatível com seu nível de experiência" });
  } else if (plant.difficulty === "medium") {
    score += novice ? 10 : 20;
    reasons.push({ ok: !novice || exp === "basic", text: novice ? "Exige um pouco mais de atenção" : "Compatível com seu nível de experiência" });
  } else {
    score += novice ? 0 : 10;
    reasons.push({ ok: !novice, text: "Cultivo mais desafiador" });
  }

  // Época / clima
  const inSeason = plant.planting_months.includes(month);
  let climateBad = false;
  if (forecastMaxAvg != null && plant.ideal_temperature_min != null && plant.ideal_temperature_max != null) {
    climateBad = forecastMaxAvg > Number(plant.ideal_temperature_max) + 5 || forecastMaxAvg < Number(plant.ideal_temperature_min) - 3;
  }
  if (inSeason && !climateBad) {
    score += 15;
    reasons.push({ ok: true, text: "Época geralmente favorável para o plantio" });
  } else if (inSeason || !climateBad) {
    score += 5;
    reasons.push({ ok: false, text: "Observe as condições climáticas locais" });
  } else {
    score -= 10;
    reasons.push({ ok: false, text: "Época ou temperaturas menos favoráveis agora" });
  }

  // Preferência
  const objs = garden?.objectives ?? [];
  const cat = plant.category === "hortaliça" || plant.category === "raiz" ? "hortalica" : plant.category;
  if (objs.includes(cat) || (objs.includes("food") && plant.category !== "tempero") || (objs.includes("learn") && plant.difficulty === "easy")) {
    score += 10;
    reasons.push({ ok: true, text: "Combina com seus objetivos" });
  }

  score = Math.max(0, Math.min(100, score));
  const label =
    score >= 80 ? "Ótima compatibilidade" : score >= 60 ? "Boa compatibilidade" : score >= 40 ? "Compatibilidade moderada" : "Baixa compatibilidade";
  const level = score >= 60 ? "Alta" : score >= 40 ? "Média" : "Baixa";
  return { plant, score, label, level, reasons };
}

// ---------- Geração de tarefas ----------
export function harvestWindow(plant: Plant, plantedAt: string) {
  const d = parseISO(plantedAt);
  return {
    start: format(addDays(d, plant.harvest_days_min), "yyyy-MM-dd"),
    end: format(addDays(d, plant.harvest_days_max), "yyyy-MM-dd"),
  };
}

export function buildTasks(plant: Plant, plantedAt: string) {
  const d = parseISO(plantedAt);
  const at = (n: number) => format(addDays(d, n), "yyyy-MM-dd");
  const n = plant.name.toLowerCase();
  const list: { title: string; description: string; task_type: string; due_date: string }[] = [
    { title: `Verificar necessidade de irrigação da ${n}`, description: "Toque o substrato: se a superfície estiver seca, regue com moderação.", task_type: "irrigation", due_date: at(1) },
    { title: `Observar folhas da ${n}`, description: "Veja cor, manchas e presença de insetos.", task_type: "observation", due_date: at(7) },
    { title: `Verificar necessidade de irrigação da ${n}`, description: "Considere o clima dos últimos dias antes de regar.", task_type: "irrigation", due_date: at(10) },
    { title: `Registrar crescimento da ${n}`, description: "Anote no diário como a planta está se desenvolvendo.", task_type: "observation", due_date: at(14) },
    { title: `Avaliar adubação da ${n}`, description: "Se as folhas estiverem pálidas, considere uma adubação orgânica leve.", task_type: "fertilization", due_date: at(30) },
    { title: `Verificar ponto de colheita da ${n}`, description: plant.harvest_guidance, task_type: "harvest", due_date: at(plant.harvest_days_min) },
  ];
  return list;
}

export function daysSince(d: string) {
  return differenceInCalendarDays(new Date(), parseISO(d));
}

// ---------- Clima (Open-Meteo) ----------
export type Weather = {
  current: { temperature: number; apparent: number; humidity: number; wind: number; precipitation: number; code: number };
  daily: { date: string; code: number; min: number; max: number; rainProb: number; rainSum: number; wind: number }[];
  fetchedAt: string;
};

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather");
  const j = await res.json();
  return {
    current: {
      temperature: j.current.temperature_2m,
      apparent: j.current.apparent_temperature,
      humidity: j.current.relative_humidity_2m,
      wind: j.current.wind_speed_10m,
      precipitation: j.current.precipitation,
      code: j.current.weather_code,
    },
    daily: j.daily.time.map((date: string, i: number) => ({
      date,
      code: j.daily.weather_code[i],
      min: j.daily.temperature_2m_min[i],
      max: j.daily.temperature_2m_max[i],
      rainProb: j.daily.precipitation_probability_max[i] ?? 0,
      rainSum: j.daily.precipitation_sum[i] ?? 0,
      wind: j.daily.wind_speed_10m_max[i],
    })),
    fetchedAt: new Date().toISOString(),
  };
}

export type City = { id: number; name: string; admin1?: string; country?: string; latitude: number; longitude: number };
export async function searchCities(q: string): Promise<City[]> {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=pt&format=json`);
  if (!res.ok) throw new Error("geo");
  const j = await res.json();
  return j.results ?? [];
}

export function weatherLabel(code: number): { label: string; icon: "sun" | "cloud-sun" | "cloud" | "fog" | "rain" | "storm" | "snow" } {
  if (code === 0) return { label: "Céu limpo", icon: "sun" };
  if (code <= 2) return { label: "Parcialmente nublado", icon: "cloud-sun" };
  if (code === 3) return { label: "Nublado", icon: "cloud" };
  if (code <= 48) return { label: "Neblina", icon: "fog" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Chuva", icon: "rain" };
  if (code <= 77) return { label: "Neve", icon: "snow" };
  return { label: "Tempestade", icon: "storm" };
}

// Regras de interpretação do clima — centralizadas para revisão futura.
export const WEATHER_RULES = {
  rainProbability: 60, // %
  heavyRainMm: 20, // mm/dia
  highTempC: 32, // °C
  strongWindKmh: 40, // km/h
};

export function interpretWeather(w: Weather) {
  const next = w.daily.slice(0, 3);
  const out: { emoji: string; text: string }[] = [];
  if (next.some((d) => d.rainProb >= WEATHER_RULES.rainProbability))
    out.push({ emoji: "🌧️", text: "Há possibilidade relevante de chuva. Verifique a umidade do solo antes de irrigar." });
  if (next.some((d) => d.rainSum >= WEATHER_RULES.heavyRainMm))
    out.push({ emoji: "🌧️", text: "Há previsão de chuva significativa. Observe a drenagem dos recipientes após a chuva." });
  if (next.some((d) => d.max >= WEATHER_RULES.highTempC))
    out.push({ emoji: "☀️", text: "Temperaturas elevadas previstas. Observe a umidade do substrato e sinais de estresse nas plantas." });
  if (next.some((d) => d.wind >= WEATHER_RULES.strongWindKmh))
    out.push({ emoji: "💨", text: "Há previsão de vento forte. Verifique plantas altas e recipientes leves." });
  return out;
}

export const toF = (c: number) => (c * 9) / 5 + 32;
export function temp(c: number, unit: string | undefined) {
  return unit === "F" ? `${Math.round(toF(c))}°F` : `${Math.round(c)}°C`;
}

export const PLANT_EMOJI: Record<string, string> = {
  alface: "🥬", rucula: "🌿", couve: "🥬", espinafre: "🍃", coentro: "🌿", cebolinha: "🧅", salsa: "🌿",
  manjericao: "🌿", alecrim: "🌲", hortela: "🍃", "tomate-cereja": "🍅", pimenta: "🌶️", rabanete: "🔴",
  cenoura: "🥕", beterraba: "🟣", pepino: "🥒", morango: "🍓", quiabo: "🫛",
};
export const plantEmoji = (slug?: string | null) => (slug && PLANT_EMOJI[slug]) || "🌱";
