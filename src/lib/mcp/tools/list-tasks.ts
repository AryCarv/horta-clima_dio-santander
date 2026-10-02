import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_tasks",
  title: "Listar tarefas da horta",
  description: "Lista as tarefas da horta do usuário (rega, adubação, colheita), filtrando por situação.",
  inputSchema: {
    status: z.enum(["pending", "completed", "all"]).default("pending").describe("Situação das tarefas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status }, ctx) => {
    let q = supabaseForUser(ctx).from("tasks").select("id, title, description, task_type, due_date, status").order("due_date").limit(100);
    if (status !== "all") q = q.eq("status", status);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const tasks = (data ?? []).map((t) => ({ ...t }));
    return { content: [{ type: "text", text: JSON.stringify(tasks) }], structuredContent: { tasks } };
  },
});
