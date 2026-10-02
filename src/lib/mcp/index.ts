import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPlants from "./tools/list-plants";
import listTasks from "./tools/list-tasks";
import completeTask from "./tools/complete-task";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "hortaclima-desafio-de-projeto-dio",
  title: "HortaClima - Desafio de Projeto DIO",
  version: "0.1.0",
  instructions:
    "Ferramentas do HortaClima para a horta do usuário conectado: listar plantas cultivadas, listar tarefas e concluir/reabrir tarefas.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPlants, listTasks, completeTask],
});
