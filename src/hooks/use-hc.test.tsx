import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePlants, useProfile, useGarden, useGardenPlants, useTasks, useWeather, useUser } from "./use-hc";
import type { Garden } from "@/lib/hc";

// Create a wrapper for React Query with pre-seeded user
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  queryClient.setQueryData(["user"], { id: "test-user-id", email: "test@example.com" });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePlants", () => {
  it("should fetch plants from Supabase", async () => {
    const { result } = renderHook(() => usePlants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
  });
});

describe("useProfile", () => {
  it("should fetch profile for current user", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe("useGarden", () => {
  it("should fetch garden for current user", async () => {
    const { result } = renderHook(() => useGarden(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe("useGardenPlants", () => {
  it("should fetch garden plants for current user", async () => {
    const { result } = renderHook(() => useGardenPlants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe("useTasks", () => {
  it("should fetch tasks for current user", async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe("useWeather", () => {
  it("should fetch weather when garden has coordinates", async () => {
    const garden = { latitude: -23.55, longitude: -46.63 } as unknown as Garden;
    const { result } = renderHook(() => useWeather(garden), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
  });

  it("should not fetch when garden has no coordinates", async () => {
    const garden = { latitude: null, longitude: null } as unknown as Garden;
    const { result } = renderHook(() => useWeather(garden), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useUser", () => {
  it("should fetch current user", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
  });
});
