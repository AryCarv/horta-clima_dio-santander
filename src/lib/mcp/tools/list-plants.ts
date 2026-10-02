import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_plants",
  title: "Listar minhas plantas",
  description: "Lista as plantas cultivadas na horta do usuário, com data de plantio e janela de colheita.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("garden_plants")
      .select("id, quantity, status, planted_at, expected_harvest_start, expected_harvest_end, notes, plants(name)")
      .order("planted_at", { ascending: false });
    if (error) throw new ToolError(error.message);
    const plants = (data ?? []).map((p) => ({
      id: p.id,
      name: (p.plants as { name: string } | null)?.name ?? "",
      quantity: p.quantity,
      status: p.status,
      planted_at: p.planted_at,
      harvest_start: p.expected_harvest_start,
      harvest_end: p.expected_harvest_end,
      notes: p.notes,
    }));
    return { content: [{ type: "text", text: JSON.stringify(plants) }], structuredContent: { plants } };
  },
});
