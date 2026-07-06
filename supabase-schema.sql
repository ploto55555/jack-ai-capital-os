-- Jack AI Capital OS V4 Cloud Database
-- Run this in Supabase SQL Editor first.

create table if not exists paper_trades (
  id text primary key,
  symbol text,
  strategy_id text,
  strategy_name text,
  status text,
  outcome text,
  direction text,
  potential_r numeric,
  gpt_tokens integer,
  gpt_cost numeric,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists strategy_runs (
  id text primary key,
  opened integer default 0,
  rejected integer default 0,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists snowball_memory (
  id text primary key,
  type text,
  symbol text,
  payload jsonb not null,
  created_at timestamptz default now()
);

create index if not exists paper_trades_symbol_idx on paper_trades(symbol);
create index if not exists paper_trades_strategy_idx on paper_trades(strategy_id);
create index if not exists paper_trades_status_idx on paper_trades(status);
create index if not exists paper_trades_created_idx on paper_trades(created_at desc);
create index if not exists strategy_runs_created_idx on strategy_runs(created_at desc);
create index if not exists snowball_memory_created_idx on snowball_memory(created_at desc);

alter table paper_trades enable row level security;
alter table strategy_runs enable row level security;
alter table snowball_memory enable row level security;

-- We use SUPABASE_SERVICE_ROLE_KEY only inside Vercel serverless API.
-- Do NOT expose the service role key in frontend code.
