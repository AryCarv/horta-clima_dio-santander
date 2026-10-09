# HortaClima 🌱

<p align="center">
  <strong>Seu assistente para cultivar alimentos em pequenos espaços.</strong><br />
  Planeje sua horta, organize os cuidados e entenda como o clima pode influenciar o cultivo.
</p>

<p align="center">
  <img alt="Status do projeto" src="https://img.shields.io/badge/status-MVP%20em%20desenvolvimento-f0c36a" />
  <img alt="Idioma" src="https://img.shields.io/badge/idioma-Portugu%C3%AAs%20(Brasil)-2e7d32" />
  <img alt="Tipo de aplicação" src="https://img.shields.io/badge/tipo-aplicativo%20web-3977a8" />
</p>

---

## Sobre o projeto

O **HortaClima** é um aplicativo web em desenvolvimento para ajudar pessoas a começar e manter uma horta em casa, mesmo quando há pouco espaço disponível.

A proposta combina três elementos:

- **Cultivo em pequenos espaços:** orientações para vasos, jardineiras, varandas, sacadas, corredores, áreas de serviço e pequenos quintais.
- **Organização do cultivo:** plantas cadastradas, calendário, tarefas, diário e registros de colheita.
- **Clima aplicado à horta:** informações meteorológicas apresentadas junto de orientações gerais para ajudar o usuário a decidir o que merece atenção.

Mais do que exibir informações isoladas, o objetivo é transformar conhecimento sobre cultivo e clima em **ações simples e práticas**.

> **O que posso plantar? Quando devo plantar? Como devo cuidar? O que merece atenção hoje?**

O nome **HortaClima** é provisório e poderá ser revisto futuramente.

## Problema que queremos resolver

Quem deseja cultivar alimentos em casa nem sempre sabe quais plantas combinam com o espaço disponível, quanta luz elas precisam, quando iniciar o plantio ou como organizar os cuidados ao longo do ciclo.

Além disso, uma previsão meteorológica genérica nem sempre deixa claro o que o usuário deve observar na própria horta. O HortaClima pretende aproximar essas informações do contexto do cultivo doméstico.

## Objetivo do MVP

Validar se uma ferramenta simples que reúna **perfil da horta, catálogo de plantas, tarefas, calendário e clima** ajuda iniciantes a planejar e acompanhar melhor seus cultivos.

O MVP deve priorizar uma experiência acessível para quem ainda está aprendendo, evitando a complexidade de um sistema agrícola profissional.

## Público-alvo

O público inicial são pessoas que:

- moram em casas ou apartamentos;
- têm pouco espaço para cultivar;
- são iniciantes ou têm pouca experiência com horticultura;
- querem produzir temperos e hortaliças para consumo doméstico;
- procuram orientação clara, organizada e fácil de acompanhar.

O projeto considera espaços como vasos, jardineiras, pequenos canteiros, varandas, sacadas, corredores, terraços e quintais compactos.

## Funcionalidades previstas no MVP

> O projeto está em desenvolvimento. A lista abaixo descreve o escopo planejado; a implementação e o funcionamento de cada recurso devem ser verificados na versão atual do código.

- **Cadastro e autenticação:** criação de conta, login, logout e recuperação de senha.
- **Configuração inicial da horta:** localização aproximada, tipo e tamanho do espaço, luminosidade, experiência e objetivos de cultivo.
- **Catálogo de plantas:** consulta e filtros por categoria, dificuldade, luminosidade e adequação a pequenos espaços.
- **Recomendações de cultivo:** sugestões explicáveis com base no perfil informado pelo usuário e nas características cadastradas das plantas.
- **Minha Horta:** acompanhamento das plantas que o usuário está cultivando.
- **Calendário:** visualização de plantios, tarefas e previsões de colheita.
- **Tarefas:** organização de cuidados e marcação de atividades concluídas.
- **Clima:** consulta da previsão meteorológica associada à cidade selecionada.
- **Orientações relacionadas ao clima:** avisos gerais, como verificar a umidade do substrato antes de irrigar quando houver possibilidade de chuva.
- **Diário da horta:** registro de observações e evolução do cultivo, com suporte planejado a imagens.
- **Registro de colheitas:** anotação de data, quantidade e observações.
- **Configurações:** gerenciamento do perfil, da localização e das preferências.

## Princípios do produto

1. **Simplicidade:** orientar o usuário sem exigir conhecimento técnico prévio.
2. **Ação prática:** ajudar a responder “o que devo fazer agora?” em vez de apenas disponibilizar dados.
3. **Pequenos espaços primeiro:** manter o foco em hortas domésticas compactas.
4. **Recomendações explicáveis:** apresentar, quando possível, os motivos de uma sugestão.
5. **Responsabilidade:** tratar as informações de cultivo como orientações gerais, considerando que os resultados dependem de variedade, região, recipiente, substrato, manejo e outras condições.
6. **Evolução progressiva:** validar o MVP antes de adicionar recursos avançados.

## Tecnologias

A arquitetura especificada para o projeto utiliza as seguintes tecnologias. Consulte o código atual para confirmar a configuração efetivamente presente no repositório.

| Tecnologia | Utilização prevista |
|---|---|
| [React](https://react.dev/) | Construção da interface |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem e manutenção do código |
| [Vite](https://vite.dev/) | Ferramentas de desenvolvimento e build |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização responsiva |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes de interface |
| [Lucide](https://lucide.dev/) | Ícones |
| [Supabase](https://supabase.com/) | Backend, autenticação e banco de dados PostgreSQL |
| [Open-Meteo](https://open-meteo.com/) | Dados meteorológicos e geocodificação, conforme configuração da aplicação |
| [Lovable](https://lovable.dev/) | Ferramenta utilizada para desenvolver a primeira versão do aplicativo |

## Fluxo principal de uso

O fluxo planejado para a experiência central é:

1. Criar uma conta e entrar no aplicativo.
2. Informar a cidade e as características do espaço de cultivo.
3. Consultar sugestões de plantas compatíveis com o perfil da horta.
4. Escolher uma planta e adicioná-la à horta.
5. Organizar tarefas e acompanhar as datas no calendário.
6. Consultar as condições climáticas e as orientações gerais relacionadas.
7. Registrar observações, evolução e colheitas.

## Arquitetura funcional prevista

A aplicação é organizada conceitualmente em módulos:

- **Autenticação e perfil:** identidade do usuário e preferências.
- **Hortas e cultivos:** espaços cadastrados e plantas em acompanhamento.
- **Catálogo:** informações gerais sobre as culturas disponíveis.
- **Recomendações:** cálculo de compatibilidade e explicações.
- **Tarefas e calendário:** planejamento dos cuidados.
- **Clima:** consulta, normalização dos dados meteorológicos e orientações contextuais.
- **Diário e colheitas:** histórico pessoal do cultivo.

No backend, os dados pessoais da horta devem ser isolados por usuário. Caso o Supabase esteja configurado, a proteção das tabelas de usuário deve ser implementada com **Row Level Security (RLS)**, além das verificações na interface.

## Como executar localmente

> As instruções abaixo são um ponto de partida para um projeto Vite. Como a configuração pode variar conforme a versão gerada pelo Lovable, confira os scripts do `package.json` e os arquivos de integração do Supabase do repositório.

### Pré-requisitos

- Node.js em uma versão LTS compatível com as dependências do projeto;
- npm (ou o gerenciador de pacotes definido no repositório);
- acesso ao projeto Supabase, caso o backend esteja habilitado.

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_PROJETO>
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias, conforme os nomes esperados pelo código. Em projetos Vite com Supabase, elas podem seguir um padrão semelhante a este:

```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

**Atenção:** os nomes exatos podem ser diferentes no repositório. Confira o arquivo de inicialização do cliente Supabase e os arquivos de configuração antes de criar o `.env.local`. Não inclua credenciais reais no Git.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Para gerar uma build de produção:

```bash
npm run build
```

Se algum comando não estiver disponível, consulte a seção `scripts` do `package.json`.

## Configuração do backend

Se o projeto utilizar Supabase, confirme os seguintes pontos antes de testar o aplicativo:

1. Projeto Supabase criado e conectado à aplicação.
2. Tabelas e relações do banco criadas conforme a implementação atual.
3. Políticas RLS habilitadas e testadas nas tabelas com dados de usuários.
4. Autenticação e redirecionamentos configurados.
5. Regras de acesso do Storage configuradas caso imagens sejam utilizadas.
6. Variáveis públicas necessárias definidas no ambiente de desenvolvimento e de deploy.

Chaves privilegiadas, como `service_role`, **não devem ser expostas no frontend**.

## Integração meteorológica

A especificação prevê o uso do **Open-Meteo** para consultar a localização e a previsão meteorológica. O funcionamento real depende da integração presente no código e da disponibilidade do serviço.

A interface não deve inventar dados quando a consulta falhar. Nessa situação, deverá informar que o clima está temporariamente indisponível e permitir que o usuário continue utilizando os outros módulos da horta.

As recomendações vinculadas ao clima devem ser apresentadas como orientações gerais, não como garantias de irrigação, produtividade ou ausência de doenças.

## Roadmap

### Fase 1 — MVP

- Estrutura da aplicação e identidade visual;
- autenticação e configuração inicial;
- perfil da horta;
- catálogo inicial de plantas;
- recomendações básicas;
- acompanhamento das plantas;
- tarefas e calendário;
- consulta meteorológica;
- diário e registro de colheitas;
- testes funcionais e revisão de segurança.

### Fase 2 — Aprimoramento

- Melhorias de usabilidade com base em testes reais;
- recomendações mais contextualizadas;
- refinamento do histórico de cultivo;
- notificações e planejamento de ciclos;
- expansão revisada do catálogo de plantas.

### Fase 3 — Recursos futuros

- Assistência com IA;
- análise de imagens, após avaliação de viabilidade e confiabilidade;
- conteúdo educativo avançado;
- parcerias com especialistas e lojas de jardinagem;
- comunidade ou outros recursos complementares, caso sejam validados.

Os recursos das fases futuras não fazem parte do escopo obrigatório do MVP.

## Segurança, privacidade e limites

- Solicitar apenas os dados necessários para o funcionamento do produto.
- Usar a cidade ou localização aproximada escolhida pelo usuário para consultar o clima; não solicitar endereço residencial exato.
- Garantir que cada usuário acesse somente seus próprios registros.
- Não expor chaves secretas no navegador ou no repositório.
- Não apresentar recomendações genéricas como garantia de resultado agronômico.
- Tratar falhas de serviços externos sem interromper o restante da aplicação.

## Como contribuir

O projeto está em evolução. Para sugerir melhorias, relatar problemas ou propor mudanças:

1. Descreva o problema ou a oportunidade com clareza.
2. Informe os passos para reproduzir o problema, quando aplicável.
3. Explique o resultado esperado e o comportamento observado.
4. Para mudanças de interface, inclua capturas de tela quando possível.
5. Mantenha as alterações alinhadas ao escopo do MVP e à experiência de pessoas iniciantes.

## Estado atual

**Status: MVP em desenvolvimento.**

A especificação funcional orienta a construção da primeira versão. A lista de funcionalidades deste README representa o escopo planejado e não constitui, por si só, confirmação de que todos os recursos já estejam implementados ou testados.

À medida que o projeto evoluir, atualize este documento para refletir o estado real do código, as instruções de instalação e as funcionalidades disponíveis.

## Referências úteis

- [Embrapa — publicações sobre hortas em pequenos espaços](https://www.embrapa.br/)
- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do shadcn/ui](https://ui.shadcn.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Open-Meteo](https://open-meteo.com/en/docs)
- [Documentação do Lovable](https://docs.lovable.dev/)

## Licença

A licença do projeto ainda deve ser definida pelo mantenedor. Até que uma licença seja adicionada ao repositório, não presuma que o código possa ser reutilizado, redistribuído ou modificado livremente.

---

<p align="center">
  <strong>HortaClima</strong><br />
  Pequenos espaços. Novos cultivos. Mais autonomia.
</p>
