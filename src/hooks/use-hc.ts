import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchWeather, type Garden, type GardenPlant, type Plant, type Profile, type Task } from "@/lib/hc";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: 60_000,
  });
}

export function useProfile() {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useGarden() {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["garden", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gardens")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Garden | null;
    },
  });
}

export function usePlants() {
  return useQuery({
    queryKey: ["plants"],
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("plants").select("*").order("name");
      if (error) throw error;
      return data as Plant[];
    },
  });
}

export function useGardenPlants() {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["garden_plants", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("garden_plants")
        .select("*, plants(*)")
        .order("planted_at", { ascending: false });
      if (error) throw error;
      return data as GardenPlant[];
    },
  });
}

export function useTasks() {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("due_date");
      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useHarvests() {
  const { data: user } = useUser();
  return useQuery({
    queryKey: ["harvests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("harvests").select("*").order("harvest_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWeather(garden: Garden | null | undefined) {
  const lat = garden?.latitude != null ? Number(garden.latitude) : null;
  const lon = garden?.longitude != null ? Number(garden.longitude) : null;
  return useQuery({
    queryKey: ["weather", lat, lon],
    enabled: lat != null && lon != null,
    staleTime: 30 * 60_000,
    retry: 1,
    queryFn: () => fetchWeather(lat!, lon!),
  });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: [k] })));
}
