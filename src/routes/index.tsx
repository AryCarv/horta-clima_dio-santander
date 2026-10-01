import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CloudSun, Droplets, Sprout, ListChecks, NotebookPen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/hc/AuthCard";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "HortaClima — Cultive sua horta mesmo com pouco espaço" },
      {
        name: "description",
        content: "Planeje o que plantar, acompanhe os cuidados e entenda como o clima afeta sua horta em varandas, vasos e quintais.",
      },
      { property: "og:title", content: "HortaClima — Cultive sua horta mesmo com pouco espaço" },
      {
        property: "og:description",
        content: "Seu assistente para cultivar alimentos em pequenos espaços: recomendações, tarefas e clima.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Sprout, t: "Conte sobre seu espaço", d: "Varanda, vasos ou quintal — e quanto sol ele recebe." },
  { icon: Search, t: "Receba sugestões", d: "Plantas compatíveis com seu espaço, luz e experiência." },
  { icon: ListChecks, t: "Acompanhe os cuidados", d: "Tarefas simples geradas para cada planta." },
  { icon: CloudSun, t: "Entenda o clima", d: "Previsão local traduzida para a sua horta." },
];
const features = [
  { icon: Search, t: "O que plantar agora", d: "Recomendações explicadas, sem mistério." },
  { icon: CalendarDays, t: "Calendário", d: "Plantios, cuidados e colheitas em um só lugar." },
  { icon: Droplets, t: "Tarefas inteligentes", d: "Lembretes flexíveis, que respeitam o clima." },
  { icon: CloudSun, t: "Clima local", d: "Previsão de 7 dias com alertas para a horta." },
  { icon: NotebookPen, t: "Diário da horta", d: "Registre observações e fotos do crescimento." },
  { icon: Sprout, t: "Catálogo de plantas", d: "18 plantas ideais para pequenos espaços." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Comece agora</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pt-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1 text-xs font-semibold text-sun-foreground">
            ☀️ Para varandas, vasos e quintais
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
            Cultive sua própria horta, mesmo com pouco espaço.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Planeje o que plantar, acompanhe os cuidados e entenda como o clima pode afetar sua horta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/cadastro">Começar minha horta</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="grid aspect-[5/4] w-full grid-cols-3 gap-3 rounded-3xl bg-gradient-to-br from-secondary via-accent to-sun p-6 shadow-xl" aria-hidden>
            {["🥬", "🍅", "🌿", "🌶️", "🍓", "🥕", "🧅", "🥒", "🌱"].map((e) => (
              <div key={e} className="grid place-items-center rounded-2xl bg-card/70 text-4xl shadow-sm md:text-5xl">
                {e}
              </div>
            ))}
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl border bg-card p-4 shadow-lg sm:left-8">
            <p className="text-xs text-muted-foreground">Hoje na sua horta</p>
            <p className="font-semibold">🌧️ Chuva prevista — confira a umidade antes de regar</p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold">Como funciona</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.t} className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">Para quem é</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Quem nunca plantou", "Moradores de apartamento", "Quem quer temperos frescos", "Famílias que querem aprender", "Quem busca alimentação natural"].map((t) => (
            <span key={t} className="rounded-full border bg-card px-4 py-2 text-sm">
              {t}
            </span>
          ))}
        </div>

        <h2 className="mt-16 text-3xl font-semibold">Principais recursos</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border bg-card p-5">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-semibold">Sua horta começa com um vaso.</h2>
          <p className="mx-auto mt-3 max-w-md opacity-90">Crie sua conta gratuita e descubra o que plantar hoje.</p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link to="/cadastro">Comece agora</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HortaClima · Dados meteorológicos por Open-Meteo · Informações gerais de cultivo, não
        substituem orientação técnica.
      </footer>
    </div>
  );
}
