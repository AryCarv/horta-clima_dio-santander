import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "set_task_status",
  title: "Concluir ou reabrir tarefa",
  description: "Marca uma tarefa da horta do usuário como concluída ou pendente.",
  inputSchema: {
    task_id: z.string().uuid().describe("ID da tarefa."),
    completed: z.boolean().describe("true para concluir, false para reabrir."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ task_id, completed }, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("tasks")
      .update({ status: completed ? "completed" : "pending", completed_at: completed ? new Date().toISOString() : null })
      .eq("id", task_id)
      .select("id, title, status")
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Tarefa não encontrada.");
    return { content: [{ type: "text", text: `Tarefa "${data.title}" agora está ${data.status}.` }], structuredContent: { task: { ...data } } };
  },
});
