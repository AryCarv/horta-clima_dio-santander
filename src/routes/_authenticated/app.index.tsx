import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
});
