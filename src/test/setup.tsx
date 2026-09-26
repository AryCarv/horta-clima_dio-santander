import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Mock Supabase query builder
/* eslint-disable @typescript-eslint/no-explicit-any */
const createQueryBuilder = () => {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: { id: "p1", full_name: "Test" }, error: null }),
    single: vi.fn().mockResolvedValue({ data: { id: "p1", full_name: "Test" }, error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    then: (resolve: any, reject: any) => Promise.resolve({ data: [], error: null }).then(resolve, reject),
  };
  return builder;
};

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => createQueryBuilder()),
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: "test-user-id", email: "test@example.com" } },
          error: null,
        }),
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: { path: "test" }, error: null })),
        createSignedUrl: vi.fn(() => Promise.resolve({ data: { signedUrl: "https://example.com/test.jpg" }, error: null })),
        remove: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    },
  },
}));

// Mock global fetch for Open-Meteo
const mockWeatherData = {
  current: {
    temperature_2m: 24,
    apparent_temperature: 25,
    relative_humidity_2m: 65,
    wind_speed_10m: 12,
    precipitation: 0,
    weather_code: 1,
  },
  daily: {
    time: ["2026-09-26", "2026-09-27", "2026-09-28"],
    weather_code: [1, 2, 61],
    temperature_2m_max: [28, 27, 22],
    temperature_2m_min: [18, 17, 16],
    precipitation_probability_max: [10, 20, 80],
    precipitation_sum: [0, 0, 15],
    wind_speed_10m_max: [15, 18, 25],
  },
};

global.fetch = vi.fn((url: RequestInfo | URL) => {
  const urlStr = url.toString();
  if (urlStr.includes("open-meteo.com")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    } as Response);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ results: [] }),
  } as Response);
}) as typeof global.fetch;

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => ({ component: () => null })),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
}));

// Mock Sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  CalendarDays: () => <span data-testid="icon-calendar" />,
  CloudSun: () => <span data-testid="icon-cloud-sun" />,
  LayoutDashboard: () => <span data-testid="icon-dashboard" />,
  ListChecks: () => <span data-testid="icon-list-checks" />,
  LogOut: () => <span data-testid="icon-logout" />,
  Menu: () => <span data-testid="icon-menu" />,
  NotebookPen: () => <span data-testid="icon-notebook" />,
  Settings: () => <span data-testid="icon-settings" />,
  Sprout: () => <span data-testid="icon-sprout" />,
  Leaf: () => <span data-testid="icon-leaf" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Checkbox: () => <span data-testid="icon-checkbox" />,
  Cloud: () => <span data-testid="icon-cloud" />,
  CloudFog: () => <span data-testid="icon-cloud-fog" />,
  CloudLightning: () => <span data-testid="icon-cloud-lightning" />,
  CloudRain: () => <span data-testid="icon-cloud-rain" />,
  Loader2: () => <span data-testid="icon-loader" />,
  Snowflake: () => <span data-testid="icon-snowflake" />,
  Sun: () => <span data-testid="icon-sun" />,
  Droplets: () => <span data-testid="icon-droplets" />,
  Search: () => <span data-testid="icon-search" />,
}));
