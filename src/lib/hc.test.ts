import { describe, it, expect, vi } from "vitest";
import { recommend, fmtDate, todayISO, harvestWindow, buildTasks, daysSince, weatherLabel, interpretWeather, temp, toF, plantEmoji } from "./hc";
import type { Plant, Garden, Profile } from "./hc";

const mockPlant: Plant = {
  id: "1",
  name: "Alface",
  slug: "alface",
  category: "folha",
  description: "Folhosa de ciclo curto",
  difficulty: "easy",
  sunlight_requirement: "partial_sun",
  water_need: "moderada",
  suitable_for_small_spaces: true,
  minimum_container_liters: 3,
  harvest_days_min: 45,
  harvest_days_max: 70,
  ideal_temperature_min: 15,
  ideal_temperature_max: 24,
  planting_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  general_care: "Mantenha úmido",
  planting_guidance: "Semeie direto",
  harvest_guidance: "Colha folhas externas",
  source_reference: "Embrapa",
  image_url: null,
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockGarden: Garden = {
  id: "g1",
  user_id: "u1",
  name: "Minha Horta",
  space_types: ["pot", "balcony"],
  size_category: "small",
  size_m2: 2,
  sunlight_level: "partial_sun",
  city: "São Paulo",
  state: "SP",
  country: "BR",
  latitude: -23.55,
  longitude: -46.63,
  objectives: ["food", "learn"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockProfile: Profile = {
  id: "p1",
  user_id: "u1",
  full_name: "João",
  experience_level: "beginner",
  onboarding_completed: true,
  temperature_unit: "C",
  week_start: "sunday",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("recommend", () => {
  it("should give high score for compatible plant", () => {
    const result = recommend(mockPlant, mockGarden, mockProfile);
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.level).toBe("Alta");
    expect(result.reasons.some((r) => r.ok)).toBe(true);
  });

  it("should penalize incompatible space", () => {
    const bigPlant: Plant = { ...mockPlant, suitable_for_small_spaces: false, minimum_container_liters: 50 };
    const smallGarden: Garden = { ...mockGarden, space_types: ["pot"], size_category: "very_small" };
    const result = recommend(bigPlant, smallGarden, mockProfile);
    expect(result.score).toBeLessThan(60);
    expect(result.reasons.some((r) => !r.ok && r.text.includes("espaço"))).toBe(true);
  });

  it("should penalize incompatible sunlight", () => {
    const sunPlant: Plant = { ...mockPlant, sunlight_requirement: "full_sun" };
    const shadeGarden: Garden = { ...mockGarden, sunlight_level: "low_light" };
    const result = recommend(sunPlant, shadeGarden, mockProfile);
    expect(result.score).toBeLessThan(60);
    expect(result.reasons.some((r) => !r.ok && r.text.includes("sol"))).toBe(true);
  });

  it("should favor easy plants for beginners", () => {
    const hardPlant: Plant = { ...mockPlant, difficulty: "hard" };
    const easyResult = recommend(mockPlant, mockGarden, mockProfile);
    const hardResult = recommend(hardPlant, mockGarden, mockProfile);
    expect(easyResult.score).toBeGreaterThan(hardResult.score);
    expect(hardResult.reasons.some((r) => r.text.includes("desafiador") || r.text.includes("experiência"))).toBe(true);
  });

  it("should consider planting month", () => {
    const summerPlant: Plant = { ...mockPlant, planting_months: [12, 1, 2] };
    const inSeasonResult = recommend(summerPlant, mockGarden, mockProfile, 1);
    const outOfSeasonResult = recommend(summerPlant, mockGarden, mockProfile, 7);
    expect(inSeasonResult.score).toBeGreaterThan(outOfSeasonResult.score);
    expect(inSeasonResult.reasons.some((r) => r.ok && r.text.includes("favorável"))).toBe(true);
    expect(outOfSeasonResult.reasons.some((r) => !r.ok)).toBe(true);
  });

  it("should consider user objectives", () => {
    const herbPlant: Plant = { ...mockPlant, category: "tempero" };
    const herbGarden: Garden = { ...mockGarden, objectives: ["tempero"] };
    const result = recommend(herbPlant, herbGarden, mockProfile);
    expect(result.reasons.some((r) => r.ok && r.text.includes("objetivos"))).toBe(true);
  });
});

describe("fmtDate", () => {
  it("should format ISO date to DD/MM/YYYY", () => {
    expect(fmtDate("2024-03-15")).toBe("15/03/2024");
  });

  it("should return dash for null/undefined", () => {
    expect(fmtDate(null)).toBe("—");
    expect(fmtDate(undefined)).toBe("—");
  });
});

describe("todayISO", () => {
  it("should return today in YYYY-MM-DD format", () => {
    const result = todayISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("harvestWindow", () => {
  it("should calculate harvest window from planted date", () => {
    const window = harvestWindow(mockPlant, "2024-01-01");
    expect(window.start).toBe("2024-02-15"); // 45 days
    expect(window.end).toBe("2024-03-11"); // 70 days
  });
});

describe("buildTasks", () => {
  it("should generate standard tasks for a plant", () => {
    const tasks = buildTasks(mockPlant, "2024-01-01");
    expect(tasks.length).toBe(6);
    expect(tasks[0].task_type).toBe("irrigation");
    expect(tasks[1].task_type).toBe("observation");
    expect(tasks[5].task_type).toBe("harvest");
    expect(tasks[5].due_date).toBe("2024-02-15"); // harvest_days_min
  });
});

describe("daysSince", () => {
  it("should calculate days since a date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 10, 12, 0, 0));
    expect(daysSince("2024-01-01")).toBe(9);
    vi.useRealTimers();
  });
});

describe("weatherLabel", () => {
  it("should return correct label and icon for weather codes", () => {
    expect(weatherLabel(0)).toEqual({ label: "Céu limpo", icon: "sun" });
    expect(weatherLabel(1)).toEqual({ label: "Parcialmente nublado", icon: "cloud-sun" });
    expect(weatherLabel(3)).toEqual({ label: "Nublado", icon: "cloud" });
    expect(weatherLabel(45)).toEqual({ label: "Neblina", icon: "fog" });
    expect(weatherLabel(61)).toEqual({ label: "Chuva", icon: "rain" });
    expect(weatherLabel(71)).toEqual({ label: "Neve", icon: "snow" });
    expect(weatherLabel(95)).toEqual({ label: "Tempestade", icon: "storm" });
  });
});

describe("interpretWeather", () => {
  it("should warn about rain probability >= 60%", () => {
    const weather = {
      current: { temperature: 25, apparent: 26, humidity: 70, wind: 10, precipitation: 0, code: 1 },
      daily: [
        { date: "2024-01-01", code: 1, min: 20, max: 28, rainProb: 70, rainSum: 5, wind: 10 },
      ],
      fetchedAt: new Date().toISOString(),
    };
    const result = interpretWeather(weather);
    expect(result.some((r) => r.text.includes("chuva") && r.text.includes("umidade"))).toBe(true);
  });

  it("should warn about heavy rain >= 20mm", () => {
    const weather = {
      current: { temperature: 25, apparent: 26, humidity: 70, wind: 10, precipitation: 0, code: 1 },
      daily: [
        { date: "2024-01-01", code: 1, min: 20, max: 28, rainProb: 30, rainSum: 25, wind: 10 },
      ],
      fetchedAt: new Date().toISOString(),
    };
    const result = interpretWeather(weather);
    expect(result.some((r) => r.text.includes("chuva significativa"))).toBe(true);
  });

  it("should warn about high temp >= 32°C", () => {
    const weather = {
      current: { temperature: 25, apparent: 26, humidity: 70, wind: 10, precipitation: 0, code: 1 },
      daily: [
        { date: "2024-01-01", code: 1, min: 20, max: 35, rainProb: 10, rainSum: 0, wind: 10 },
      ],
      fetchedAt: new Date().toISOString(),
    };
    const result = interpretWeather(weather);
    expect(result.some((r) => r.text.includes("Temperaturas elevadas"))).toBe(true);
  });

  it("should warn about strong wind >= 40 km/h", () => {
    const weather = {
      current: { temperature: 25, apparent: 26, humidity: 70, wind: 10, precipitation: 0, code: 1 },
      daily: [
        { date: "2024-01-01", code: 1, min: 20, max: 28, rainProb: 10, rainSum: 0, wind: 50 },
      ],
      fetchedAt: new Date().toISOString(),
    };
    const result = interpretWeather(weather);
    expect(result.some((r) => r.text.includes("vento forte"))).toBe(true);
  });
});

describe("temp", () => {
  it("should format Celsius by default", () => {
    expect(temp(25, "C")).toBe("25°C");
    expect(temp(25.6, "C")).toBe("26°C");
  });

  it("should format Fahrenheit when requested", () => {
    expect(temp(25, "F")).toBe("77°F");
    expect(temp(0, "F")).toBe("32°F");
  });
});

describe("toF", () => {
  it("should convert Celsius to Fahrenheit", () => {
    expect(toF(0)).toBe(32);
    expect(toF(100)).toBe(212);
    expect(toF(25)).toBeCloseTo(77);
  });
});

describe("plantEmoji", () => {
  it("should return emoji for known slugs", () => {
    expect(plantEmoji("alface")).toBe("🥬");
    expect(plantEmoji("tomate-cereja")).toBe("🍅");
    expect(plantEmoji("morango")).toBe("🍓");
  });

  it("should return default for unknown slugs", () => {
    expect(plantEmoji("unknown")).toBe("🌱");
    expect(plantEmoji(null)).toBe("🌱");
    expect(plantEmoji(undefined)).toBe("🌱");
  });
});