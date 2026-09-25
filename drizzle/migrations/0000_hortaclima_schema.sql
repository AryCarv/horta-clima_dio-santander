
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  experience_level text check (experience_level in ('beginner','basic','intermediate','advanced')),
  onboarding_completed boolean not null default false,
  temperature_unit text not null default 'C',
  week_start text not null default 'sunday',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.gardens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null default 'Minha Horta',
  space_types text[] not null default '{}',
  size_category text,
  size_m2 numeric,
  sunlight_level text check (sunlight_level in ('full_sun','partial_sun','low_light','unknown')),
  city text, state text, country text,
  latitude numeric, longitude numeric,
  objectives text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.gardens(user_id);
grant select, insert, update, delete on public.gardens to authenticated;
grant all on public.gardens to service_role;
alter table public.gardens enable row level security;
create policy "own gardens" on public.gardens for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  sunlight_requirement text not null check (sunlight_requirement in ('full_sun','partial_sun','low_light')),
  water_need text not null,
  suitable_for_small_spaces boolean not null default true,
  minimum_container_liters numeric,
  harvest_days_min integer not null,
  harvest_days_max integer not null,
  ideal_temperature_min numeric,
  ideal_temperature_max numeric,
  planting_months int[] not null default '{1,2,3,4,5,6,7,8,9,10,11,12}',
  general_care text not null,
  planting_guidance text not null,
  harvest_guidance text not null,
  source_reference text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.plants to anon, authenticated;
grant all on public.plants to service_role;
alter table public.plants enable row level security;
create policy "public catalog" on public.plants for select to anon, authenticated using (active);

create table public.garden_plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  garden_id uuid not null references public.gardens(id) on delete cascade,
  plant_id uuid not null references public.plants(id),
  status text not null default 'planted' check (status in ('planned','planted','growing','ready','harvested','ended')),
  planted_at date not null default current_date,
  expected_harvest_start date,
  expected_harvest_end date,
  container_type text,
  container_size_liters numeric,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 1000),
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.garden_plants(user_id);
create index on public.garden_plants(garden_id);
grant select, insert, update, delete on public.garden_plants to authenticated;
grant all on public.garden_plants to service_role;
alter table public.garden_plants enable row level security;
create policy "own garden_plants" on public.garden_plants for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and exists (select 1 from public.gardens g where g.id = garden_id and g.user_id = auth.uid()));

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  garden_id uuid not null references public.gardens(id) on delete cascade,
  garden_plant_id uuid references public.garden_plants(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  description text,
  task_type text not null default 'observation',
  due_date date not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  completed_at timestamptz,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.tasks(user_id, due_date);
grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "own tasks" on public.tasks for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  garden_id uuid not null references public.gardens(id) on delete cascade,
  garden_plant_id uuid references public.garden_plants(id) on delete set null,
  title text not null check (char_length(title) between 1 and 150),
  content text check (char_length(content) <= 5000),
  entry_type text not null default 'observation',
  entry_date date not null default current_date,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.journal_entries(user_id, entry_date desc);
grant select, insert, update, delete on public.journal_entries to authenticated;
grant all on public.journal_entries to service_role;
alter table public.journal_entries enable row level security;
create policy "own journal" on public.journal_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.harvests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  garden_id uuid not null references public.gardens(id) on delete cascade,
  garden_plant_id uuid not null references public.garden_plants(id) on delete cascade,
  harvest_date date not null default current_date,
  quantity numeric check (quantity is null or quantity >= 0),
  unit text,
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);
create index on public.harvests(user_id);
grant select, insert, update, delete on public.harvests to authenticated;
grant all on public.harvests to service_role;
alter table public.harvests enable row level security;
create policy "own harvests" on public.harvests for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger t1 before update on public.profiles for each row execute function public.set_updated_at();
create trigger t2 before update on public.gardens for each row execute function public.set_updated_at();
create trigger t3 before update on public.garden_plants for each row execute function public.set_updated_at();
create trigger t4 before update on public.tasks for each row execute function public.set_updated_at();
create trigger t5 before update on public.journal_entries for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create policy "own photos read" on storage.objects for select to authenticated using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos insert" on storage.objects for insert to authenticated with check (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos delete" on storage.objects for delete to authenticated using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);

insert into public.plants (name, slug, category, description, difficulty, sunlight_requirement, water_need, suitable_for_small_spaces, minimum_container_liters, harvest_days_min, harvest_days_max, ideal_temperature_min, ideal_temperature_max, planting_months, general_care, planting_guidance, harvest_guidance, source_reference) values
('Alface','alface','folha','Folhosa de ciclo curto, muito usada em saladas e ótima para quem está começando.','easy','partial_sun','moderada',true,3,45,70,15,24,'{1,2,3,4,5,6,7,8,9,10,11,12}','Mantenha o substrato levemente úmido, sem encharcar. Em dias quentes, sombra nas horas mais fortes ajuda.','Semeie em sementeira ou direto no vaso, cobrindo pouco as sementes. Transplante quando tiver 4 a 6 folhas.','Colha as folhas externas conforme crescem ou a planta inteira antes de pendoar.','Referência geral: Embrapa Hortaliças'),
('Rúcula','rucula','folha','Folha de sabor picante, cresce rápido e cabe em vasos e jardineiras.','easy','partial_sun','moderada',true,3,30,50,15,25,'{3,4,5,6,7,8,9}','Regue quando a superfície do substrato estiver seca. Calor intenso pode deixar as folhas mais ardidas.','Semeie direto no recipiente, em linhas rasas.','Corte as folhas quando tiverem cerca de 10 a 15 cm.','Referência geral: Embrapa Hortaliças'),
('Couve','couve','folha','Folhosa resistente e produtiva, pode ser colhida por vários meses.','easy','full_sun','moderada',true,10,60,90,16,26,'{2,3,4,5,6,7,8}','Observe lagartas e pulgões na parte de baixo das folhas. Adubação orgânica periódica ajuda.','Plante mudas em vaso fundo ou canteiro.','Retire as folhas de baixo para cima, deixando o broto central.','Referência geral: Embrapa Hortaliças'),
('Espinafre','espinafre','folha','Folhosa nutritiva que prefere temperaturas mais amenas.','medium','partial_sun','moderada',true,5,40,60,12,22,'{3,4,5,6,7}','Mantenha umidade constante. Evite sol forte no verão.','Semeie direto no recipiente, cobrindo levemente.','Colha as folhas maiores quando estiverem bem formadas.','Referência geral: Embrapa Hortaliças'),
('Coentro','coentro','tempero','Tempero aromático de ciclo curto, muito usado na culinária brasileira.','easy','full_sun','moderada',true,3,30,50,18,28,'{1,2,3,4,8,9,10,11,12}','Não gosta de transplante. Regue com moderação.','Semeie direto no vaso definitivo.','Corte os ramos quando tiverem 15 a 20 cm.','Referência geral: Embrapa Hortaliças'),
('Cebolinha','cebolinha','tempero','Tempero perene e muito fácil, rebrota depois do corte.','easy','partial_sun','moderada',true,2,60,80,13,28,'{1,2,3,4,5,6,7,8,9,10,11,12}','Regue quando o substrato secar na superfície. Divida as touceiras quando ficarem grandes.','Plante mudas ou sementes em vaso ou jardineira.','Corte as folhas a alguns centímetros do solo; ela rebrota.','Referência geral: Embrapa Hortaliças'),
('Salsa','salsa','tempero','Tempero clássico, de crescimento lento no início e colheita contínua.','easy','partial_sun','moderada',true,3,60,90,15,25,'{2,3,4,5,6,7,8,9}','A germinação pode demorar; tenha paciência. Mantenha o solo levemente úmido.','Semeie direto no vaso; deixar as sementes de molho ajuda.','Colha os ramos externos, deixando o centro crescer.','Referência geral: Embrapa Hortaliças'),
('Manjericão','manjericao','tempero','Erva aromática que adora calor e sol.','easy','full_sun','moderada',true,3,40,60,18,30,'{8,9,10,11,12,1,2}','Retire as flores para prolongar a produção de folhas.','Semeie ou plante mudas em local ensolarado.','Colha pontas dos ramos, estimulando novas brotações.','Referência geral: Embrapa Hortaliças'),
('Alecrim','alecrim','tempero','Erva perene e resistente, gosta de solo bem drenado.','easy','full_sun','baixa',true,5,90,120,15,30,'{3,4,5,6,7,8,9}','Regue pouco; o excesso de água é o principal problema.','Plante mudas ou estacas em vaso com boa drenagem.','Corte ramos com tesoura, sem retirar mais de um terço da planta.','Referência geral: Embrapa Hortaliças'),
('Hortelã','hortela','tempero','Erva aromática vigorosa, melhor cultivada em vaso próprio.','easy','partial_sun','alta',true,3,60,90,15,28,'{1,2,3,4,5,6,7,8,9,10,11,12}','Gosta de umidade. Cultive sozinha, pois se espalha rápido.','Plante mudas ou estacas enraizadas.','Colha ramos regularmente para manter a planta compacta.','Referência geral: Embrapa Hortaliças'),
('Tomate-cereja','tomate-cereja','fruto','Tomate pequeno e saboroso, adaptado a vasos grandes.','medium','full_sun','moderada',true,20,70,100,18,30,'{7,8,9,10,11,12,1,2}','Precisa de tutor. Observe folhas e frutos com frequência.','Plante mudas em vaso grande e instale estaca ou suporte.','Colha os frutos quando estiverem bem vermelhos e firmes.','Referência geral: Embrapa Hortaliças'),
('Pimenta','pimenta','fruto','Planta ornamental e produtiva, ótima para varandas ensolaradas.','medium','full_sun','moderada',true,10,90,120,20,30,'{8,9,10,11,12,1}','Gosta de calor. Regue quando o substrato secar na superfície.','Plante mudas em vaso médio com boa drenagem.','Colha os frutos na cor desejada, com tesoura.','Referência geral: Embrapa Hortaliças'),
('Rabanete','rabanete','raiz','Raiz de ciclo muito curto, ideal para ver resultados rápido.','easy','partial_sun','moderada',true,3,25,35,10,25,'{3,4,5,6,7,8,9}','Mantenha umidade regular para evitar raízes rachadas.','Semeie direto, sem transplantar, com espaçamento entre as sementes.','Colha quando a raiz estiver com 2 a 3 cm de diâmetro.','Referência geral: Embrapa Hortaliças'),
('Cenoura','cenoura','raiz','Raiz que precisa de recipiente fundo e solo solto.','medium','full_sun','moderada',true,15,80,110,12,25,'{2,3,4,5,6,7}','Use substrato leve e sem pedras. Faça desbaste das mudas.','Semeie direto em vaso fundo (25 cm ou mais).','Colha quando o topo da raiz aparecer com bom diâmetro.','Referência geral: Embrapa Hortaliças'),
('Beterraba','beterraba','raiz','Raiz nutritiva; as folhas também são comestíveis.','medium','full_sun','moderada',true,10,60,90,10,24,'{2,3,4,5,6,7,8}','Mantenha umidade regular e faça desbaste.','Semeie direto ou transplante mudas com cuidado.','Colha quando a raiz estiver com 5 a 8 cm.','Referência geral: Embrapa Hortaliças'),
('Pepino','pepino','fruto','Planta trepadeira de crescimento rápido, precisa de suporte.','medium','full_sun','alta',false,20,50,70,20,30,'{8,9,10,11,12,1}','Ofereça treliça. Observe a umidade em dias quentes.','Semeie direto em vaso grande com suporte.','Colha os frutos ainda jovens e firmes.','Referência geral: Embrapa Hortaliças'),
('Morango','morango','fruto','Fruta querida que se adapta bem a vasos suspensos e jardineiras.','medium','full_sun','moderada',true,5,60,90,13,26,'{3,4,5,6}','Evite molhar os frutos. Retire estolões se quiser frutos maiores.','Plante mudas sem enterrar a coroa.','Colha os frutos totalmente vermelhos.','Referência geral: Embrapa Clima Temperado'),
('Quiabo','quiabo','hortaliça','Hortaliça de clima quente, planta alta e produtiva.','medium','full_sun','moderada',false,20,60,80,22,32,'{9,10,11,12,1,2}','Gosta de calor. Precisa de espaço e vaso grande.','Semeie direto; deixar as sementes de molho ajuda.','Colha os frutos jovens, com 8 a 12 cm.','Referência geral: Embrapa Hortaliças');
