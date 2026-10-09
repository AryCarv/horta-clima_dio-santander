# HortaClima 🌱

<p align="center">
  <strong>Seu assistente para cultivar alimentos em pequenos espaços.</strong><br />
  Planeje a horta, organize os cuidados e entenda como o clima pode influenciar o cultivo.
</p>

<p align="center">
  <a href="https://horta-clima-dio-santander.vercel.app/">
    <img src="https://img.shields.io/badge/Aplicação-online-2e7d32?style=for-the-badge" alt="Acessar aplicação" />
  </a>
  <a href="https://github.com/AryCarv/horta-clima_dio-santander">
    <img src="https://img.shields.io/badge/GitHub-repositório-181717?style=for-the-badge&logo=github" alt="Repositório no GitHub" />
  </a>
  <img src="https://img.shields.io/badge/Status-MVP%20em%20desenvolvimento-f9a825?style=for-the-badge" alt="Status: MVP em desenvolvimento" />
</p>

> **HortaClima** é um aplicativo web em desenvolvimento que ajuda pessoas a planejar e acompanhar hortas domésticas, especialmente em vasos, jardineiras, varandas, sacadas e pequenos quintais. O projeto combina organização do cultivo, sugestões de plantas e informações meteorológicas para transformar dados em ações práticas.

---

<img width="1366" height="645" alt="ScreenShot_20261009150402" src="https://github.com/user-attachments/assets/7223fbb1-2d53-4efc-aab2-326d78d18d78" />

<img width="1366" height="645" alt="ScreenShot_20261009150731" src="https://github.com/user-attachments/assets/9fa67bef-2716-4f3d-a9fd-272e97118115" />

<img width="1366" height="645" alt="ScreenShot_20261009150747" src="https://github.com/user-attachments/assets/f38bede2-eed2-4710-8efb-efd4812186b3" />

---

**[Acessar a aplicação publicada](https://hortaclima.lovable.app/)**

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades do MVP](#funcionalidades-do-mvp)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como funciona a recomendação de plantas](#como-funciona-a-recomendação-de-plantas)
- [Integração meteorológica](#integração-meteorológica)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Executar localmente](#executar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Limitações conhecidas e escopo](#limitações-conhecidas-e-escopo)
- [Roadmap](#roadmap)
- [Documentação complementar](#documentação-complementar)
- [Contribuições e sugestões](#contribuições-e-sugestões)
- [Licença](#licença)

---

## Sobre o projeto

Quem deseja produzir temperos e hortaliças em casa nem sempre sabe quais plantas são adequadas ao espaço disponível, quanto sol elas precisam, quando iniciar o plantio ou como organizar os cuidados ao longo do ciclo.

Além disso, uma previsão meteorológica genérica nem sempre responde à pergunta mais importante para quem cultiva: **“O que devo observar ou fazer na minha horta hoje?”**

O HortaClima procura aproximar essas informações da rotina de cultivo doméstico. A ideia é que a pessoa configure seu espaço, receba sugestões iniciais, registre as plantas cultivadas, acompanhe as tarefas e consulte o clima local.

### Público-alvo

- Pessoas iniciantes em horticultura;
- moradores de casas e apartamentos com pouco espaço;
- pessoas que desejam cultivar temperos e hortaliças para consumo doméstico;
- cultivadores que precisam organizar datas, cuidados e colheitas;
- pessoas interessadas em cultivo doméstico e alimentação mais natural.

### Problema que o produto busca resolver

> “Quero cultivar alimentos em casa, mas preciso saber o que plantar, como organizar o cultivo e quais cuidados merecem atenção ao longo do tempo.”

## Objetivos

O principal objetivo do MVP é avaliar se uma ferramenta simples que reúne perfil da horta, catálogo de plantas, recomendações, tarefas, calendário e clima ajuda iniciantes a organizar melhor o cultivo.

O projeto prioriza:

1. **Simplicidade:** linguagem acessível a quem está começando.
2. **Ação prática:** apoiar decisões do dia a dia, não apenas apresentar informações isoladas.
3. **Pequenos espaços:** foco em hortas domésticas compactas.
4. **Recomendações explicáveis:** apresentar os motivos que influenciam uma sugestão.
5. **Evolução progressiva:** aprimorar o produto com base em testes e feedback.

---

## Funcionalidades do MVP

As funcionalidades abaixo estão identificadas nas rotas e módulos do código atual. Como o projeto continua em evolução, o funcionamento integrado de cada fluxo depende também da configuração do Supabase e de testes no ambiente de execução.

### Conta e configuração inicial

- Cadastro de usuário e login por e-mail e senha;
- opção de autenticação com Google na interface;
- recuperação e redefinição de senha;
- onboarding para registrar experiência, objetivos, tipo de espaço, luminosidade e localização aproximada.

### Dashboard

- resumo do clima para a cidade da horta;
- tarefas pendentes e vencidas;
- quantidade de plantas ativas;
- indicação da próxima colheita estimada;
- sugestões de plantas de acordo com o perfil informado.

### Catálogo e recomendações

- catálogo de culturas com busca e filtros;
- páginas de detalhes das plantas;
- informações gerais sobre dificuldade, luminosidade, cuidados e ciclo de cultivo;
- recomendações de compatibilidade a partir do espaço, luz, experiência, época do ano e dados climáticos disponíveis.

### Minha Horta

- adicionar plantas ao cultivo;
- acompanhar quantidade, data de plantio, status e previsão de colheita;
- filtrar plantas ativas, próximas da colheita e ciclos concluídos;
- atualizar o status do cultivo;
- registrar colheitas com quantidade e unidade;
- remover plantas da horta.

### Tarefas e calendário

- criar tarefas próprias;
- editar, concluir, reabrir e excluir tarefas;
- consultar tarefas de hoje, futuras, atrasadas e concluídas;
- visualizar plantios, tarefas e datas estimadas de colheita em calendário mensal ou semanal.

### Clima local

- pesquisar e selecionar uma cidade;
- consultar as condições meteorológicas atuais;
- visualizar previsão para sete dias;
- consultar temperatura, sensação térmica, umidade, vento e precipitação;
- receber alertas gerais relacionados a chuva, calor e vento;
- tentar novamente quando uma consulta meteorológica falhar.

### Diário da horta

- registrar observações com título, data, tipo e texto;
- associar um registro a uma planta cultivada;
- anexar uma imagem ao registro;
- visualizar e excluir registros.

### Configurações

- editar dados do perfil;
- atualizar cidade da horta;
- configurar preferências como unidade de temperatura e início da semana.

---

## Tecnologias utilizadas

| Tecnologia | Papel no projeto |
|---|---|
| [React](https://react.dev/) | Interface por componentes |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [TanStack Start](https://tanstack.com/start/latest) | Estrutura da aplicação e integração com o roteamento |
| [TanStack Router](https://tanstack.com/router/latest) | Rotas baseadas em arquivos e navegação |
| [Vite](https://vite.dev/) | Ferramentas de desenvolvimento e build |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização responsiva |
| [shadcn/ui](https://ui.shadcn.com/) e [Radix UI](https://www.radix-ui.com/) | Componentes de interface acessíveis |
| [Lucide React](https://lucide.dev/) | Ícones |
| [Supabase](https://supabase.com/) | Autenticação, PostgreSQL e armazenamento de imagens |
| [TanStack Query](https://tanstack.com/query/latest) | Consulta e cache de dados no cliente |
| [Open-Meteo](https://open-meteo.com/) | Geocodificação e dados meteorológicos |
| [date-fns](https://date-fns.org/) | Manipulação e formatação de datas |
| [Zod](https://zod.dev/) | Validação de dados |
| [Vitest](https://vitest.dev/) | Infraestrutura de testes |
| [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Ferramentas de migração/modelagem presentes no repositório |
| [Lovable](https://lovable.dev/) | Ferramenta utilizada para apoiar a criação e evolução do aplicativo |

As versões exatas das dependências e os comandos disponíveis estão definidos em [`package.json`](./package.json).

---

## Como funciona a recomendação de plantas

No MVP, as recomendações usam uma **heurística determinística**, implementada no módulo `src/lib/hc.ts`. Não dependem de IA generativa.

A pontuação considera fatores como:

- adequação da planta a pequenos espaços;
- compatibilidade entre necessidade de luz e luminosidade informada;
- dificuldade do cultivo em relação à experiência do usuário;
- mês de plantio e condições de temperatura disponíveis;
- compatibilidade com os objetivos de cultivo selecionados.

O aplicativo apresenta uma classificação de compatibilidade e os motivos que contribuíram para a recomendação. Essa pontuação é uma orientação geral do produto, não uma garantia de sucesso do plantio.

---

## Integração meteorológica

O projeto utiliza serviços públicos do **Open-Meteo**:

- **Geocoding API:** pesquisa cidades e recupera coordenadas;
- **Forecast API:** consulta condições atuais e previsão diária de sete dias.

A lógica de consulta, normalização da resposta e interpretação básica das condições está centralizada em `src/lib/hc.ts`; o hook `useWeather` e as telas autenticadas utilizam esse serviço.

As regras de interpretação podem gerar orientações gerais, por exemplo:

- verificar a umidade do solo antes de irrigar quando houver possibilidade relevante de chuva;
- observar a drenagem dos recipientes após previsão de chuva significativa;
- prestar atenção à umidade do substrato em períodos de temperatura elevada;
- verificar plantas altas e recipientes leves quando houver previsão de vento forte.

Se a API estiver indisponível, a aplicação deve informar a falha sem inventar dados meteorológicos. As orientações climáticas são gerais e não substituem acompanhamento técnico agronômico.

---

## Arquitetura do projeto

O código segue uma organização modular. Os principais diretórios e arquivos incluem:

```text
.
├── src/
│   ├── components/
│   │   ├── hc/                  # Componentes específicos do HortaClima
│   │   └── ui/                  # Componentes da interface
│   ├── hooks/
│   │   └── use-hc.ts            # Hooks de consulta e invalidação de dados
│   ├── integrations/
│   │   └── supabase/            # Cliente Supabase e tipos do banco
│   ├── lib/
│   │   └── hc.ts                # Tipos, recomendações, tarefas e clima
│   └── routes/
│       ├── index.tsx            # Landing page
│       ├── login.tsx            # Login
│       ├── cadastro.tsx         # Cadastro
│       ├── recuperar-senha.tsx  # Recuperação de senha
│       └── _authenticated/      # Rotas que exigem autenticação
├── drizzle/                     # Arquivos relacionados a banco/migrações
├── public/                      # Arquivos públicos
├── supabase/                    # Configuração do Supabase
├── .env.example                 # Modelo de variáveis de ambiente
├── package.json                 # Dependências e scripts
└── vite.config.ts               # Configuração do Vite
```

### Rotas principais

| Caminho | Finalidade |
|---|---|
| `/` | Página inicial pública |
| `/cadastro` | Criar conta |
| `/login` | Entrar |
| `/recuperar-senha` | Solicitar recuperação de senha |
| `/reset-password` | Redefinir senha |
| `/onboarding` | Configuração inicial da horta |
| `/app/dashboard` | Resumo da horta |
| `/app/minha-horta` | Gerenciar plantas em cultivo |
| `/app/plantas` | Catálogo de plantas |
| `/app/plantas/:slug` | Detalhes de uma planta |
| `/app/recomendacoes` | Recomendações de cultivo |
| `/app/tarefas` | Gerenciar tarefas |
| `/app/calendario` | Calendário de cultivo |
| `/app/clima` | Previsão meteorológica e orientações |
| `/app/diario` | Diário da horta |
| `/app/configuracoes` | Perfil e preferências |

As páginas da área `/app` exigem autenticação.

---

## Modelo de dados

O modelo tipado do Supabase presente no código inclui as seguintes tabelas principais:

| Tabela | Responsabilidade |
|---|---|
| `profiles` | Perfil e preferências do usuário |
| `gardens` | Espaço de cultivo, localização, luminosidade e objetivos |
| `plants` | Catálogo de plantas e informações gerais de cultivo |
| `garden_plants` | Plantas adicionadas à horta do usuário |
| `tasks` | Tarefas relacionadas ao cultivo |
| `journal_entries` | Observações e fotos do diário |
| `harvests` | Registros de colheitas |

O cliente Supabase utiliza tipos TypeScript gerados para reduzir inconsistências entre as consultas e o modelo de dados. A configuração real do backend — tabelas, políticas de acesso, autenticação e Storage — deve corresponder ao código que estiver implantado.

---

## Executar localmente

### Pré-requisitos

- Git;
- Node.js em versão compatível com as dependências do projeto;
- npm;
- acesso às configurações do projeto Supabase utilizado pela aplicação.

### 1. Clonar o repositório

```bash
git clone https://github.com/AryCarv/horta-clima_dio-santander.git
cd horta-clima_dio-santander
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` a partir do modelo disponível:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**Linux/macOS**

```bash
cp .env.example .env.local
```

Depois, preencha as variáveis públicas exigidas pelo cliente Supabase, descritas na seção seguinte. Não copie credenciais reais para o README ou para outros arquivos versionados.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Siga o endereço local informado no terminal.

### 5. Verificar a build

```bash
npm run build
```

### 6. Executar verificações adicionais

```bash
npm run lint
npm test
```

Esses comandos estão declarados em `package.json`. A execução local deve ser feita após a instalação das dependências e a configuração do ambiente.

---

## Variáveis de ambiente

O cliente Supabase procura estas variáveis no ambiente do frontend:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-do-supabase
```

Use os valores correspondentes ao projeto Supabase conectado à aplicação. Em configurações mais antigas, o `.env.example` também menciona `VITE_SUPABASE_ANON_KEY`, mas o cliente atual utiliza `VITE_SUPABASE_PUBLISHABLE_KEY` no navegador.

Algumas operações administrativas ou de migração podem precisar de variáveis de servidor separadas, como `SUPABASE_SERVICE_ROLE_KEY` ou uma URL de conexão PostgreSQL. **Essas credenciais não devem ser prefixadas com `VITE_`, expostas no navegador ou adicionadas ao repositório.** Configure-as somente em ambiente de servidor protegido e quando forem realmente necessárias.

O Open-Meteo é consultado diretamente pela aplicação e, na implementação atual, não utiliza uma chave de API própria.

---

## Scripts disponíveis

Os scripts definidos no `package.json` incluem:

| Comando | Finalidade |
|---|---|
| `npm run dev` | Iniciar o servidor de desenvolvimento |
| `npm run build` | Gerar a build de produção |
| `npm run build:dev` | Gerar build no modo de desenvolvimento |
| `npm run preview` | Visualizar a build localmente |
| `npm run lint` | Executar ESLint |
| `npm run format` | Formatar arquivos com Prettier |
| `npm test` | Executar os testes com Vitest |
| `npm run test:watch` | Executar testes em modo de observação |

---

## Segurança e privacidade

Como o HortaClima lida com contas de usuário, perfil e registros de cultivo, a configuração de segurança do backend é parte essencial do produto.

- Não versionar arquivos com credenciais, como `.env` e `.env.local`.
- Manter somente placeholders em `.env.example`.
- Nunca expor chaves `service_role` ou outras credenciais privilegiadas no frontend.
- Habilitar e testar políticas de **Row Level Security (RLS)** nas tabelas com dados pessoais.
- Restringir o acesso às fotos do diário para que cada pessoa visualize apenas os próprios arquivos.
- Solicitar somente os dados necessários; para o clima, utilizar a cidade/localização aproximada escolhida pelo usuário.
- Tratar erros de APIs externas sem exibir dados inventados.

Antes de publicar alterações, confira se os arquivos de ambiente locais estão excluídos pelo `.gitignore`. Adicionar um arquivo ao `.gitignore` não remove, por si só, um arquivo que já esteja versionado.

---

## Limitações conhecidas e escopo

- O projeto está em desenvolvimento; a presença de uma tela ou rota não garante, por si só, que todos os fluxos estejam testados em produção.
- As recomendações de compatibilidade usam regras determinísticas simples, não um modelo agronômico avançado.
- As informações sobre época de plantio, luz, temperatura e colheita são gerais e podem variar conforme cultivar, região, substrato, recipiente e manejo.
- Os alertas climáticos são orientações básicas, não previsões de irrigação nem diagnósticos de doenças.
- A aplicação não substitui orientação de agrônomos ou outros profissionais especializados.
- Não fazem parte do MVP: pagamentos, marketplace, rede social, sensores, automação de irrigação, diagnóstico de doenças por imagem ou chatbot de IA.

---

## Roadmap

### MVP — versão atual em evolução

- [x] Landing page pública;
- [x] páginas de cadastro e login;
- [x] fluxo de onboarding;
- [x] dashboard;
- [x] catálogo e páginas de plantas;
- [x] mecanismo inicial de recomendações;
- [x] gerenciamento de plantas da horta;
- [x] tarefas e calendário;
- [x] consulta meteorológica e orientações gerais;
- [x] diário com suporte a imagens;
- [x] registros de colheita;
- [x] configurações de perfil e preferências.

> Os itens marcados indicam módulos identificados no código do repositório. Antes de considerar o MVP concluído, ainda é necessário testar os fluxos com uma conta real e confirmar a configuração do Supabase, políticas RLS, armazenamento de imagens e build de produção.

### Próximas melhorias possíveis

- testes de ponta a ponta dos principais fluxos;
- auditoria de segurança e revisão das políticas RLS;
- refinamento da experiência mobile;
- melhor cobertura de estados de erro e carregamento;
- revisão técnica das fichas de cultivo;
- coleta de feedback de usuários iniciantes;
- métricas de ativação e retenção;
- notificações e planejamento avançado, caso sejam validados.

### Ideias futuras — fora do MVP

- assistência com IA;
- análise de imagens;
- conteúdo educacional avançado;
- parcerias com especialistas e lojas de jardinagem;
- comunidade ou outros recursos complementares.

---

## Documentação complementar

- [Especificação funcional do HortaClima no repositório](./README_HortaClima.md)
- [Prompt do aplicativo para o Lovable (PDF)](./Prompt%20para%20App%20-%20HortaClima%20(Lovable).pdf)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do TanStack Start](https://tanstack.com/start/latest)
- [Documentação do Open-Meteo](https://open-meteo.com/en/docs)
- [Materiais da Embrapa sobre hortas em pequenos espaços](https://www.embrapa.br/)

---

## Contribuições e sugestões

Este projeto está em evolução. Para relatar um problema ou sugerir uma melhoria, inclua:

1. Uma descrição clara do problema ou da oportunidade;
2. os passos para reproduzir o comportamento, quando aplicável;
3. o resultado esperado e o observado;
4. capturas de tela, quando ajudarem a explicar uma questão de interface.

As sugestões devem priorizar a proposta central do produto: tornar o cultivo de alimentos em pequenos espaços mais simples e organizado.

---

## Licença

Nenhuma licença de código aberto foi identificada nesta documentação. Até que o mantenedor escolha e adicione uma licença ao repositório, não presuma que o código possa ser reutilizado, redistribuído ou modificado livremente.

---

<p align="center">
  <strong>HortaClima</strong><br />
  <em>Pequenos espaços. Novos cultivos. Mais autonomia.</em>
</p>
