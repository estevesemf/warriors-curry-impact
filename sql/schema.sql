create table if not exists teams (
    id bigserial primary key,
    team_key text not null unique,
    name text not null,
    city text not null,
    abbreviation text not null unique
);

create table if not exists players (
    id bigserial primary key,
    player_key text not null unique,
    team_id bigint not null references teams(id),
    external_nba_id text,
    external_balldontlie_id text,
    first_name text not null,
    last_name text not null,
    position text,
    draft_year integer,
    draft_round integer,
    draft_pick integer,
    active boolean not null default true
);

create table if not exists seasons (
    id bigserial primary key,
    season_label text not null unique,
    start_year integer not null,
    end_year integer not null,
    check (end_year = start_year + 1)
);

create table if not exists data_sources (
    id bigserial primary key,
    source_key text not null unique,
    name text not null,
    url text not null,
    publisher text not null,
    access_type text not null,
    license_notes text,
    retrieved_at date not null
);

create table if not exists team_season_stats (
    id bigserial primary key,
    team_id bigint not null references teams(id),
    season_id bigint not null references seasons(id),
    wins integer not null,
    losses integer not null,
    win_pct numeric(5, 3) generated always as (
        case
            when wins + losses = 0 then 0
            else round((wins::numeric / (wins + losses)), 3)
        end
    ) stored,
    playoff_result text,
    championships integer not null default 0,
    source_id bigint references data_sources(id),
    unique (team_id, season_id)
);

create table if not exists player_season_stats (
    id bigserial primary key,
    player_id bigint not null references players(id),
    team_id bigint not null references teams(id),
    season_id bigint not null references seasons(id),
    games integer,
    points_per_game numeric(5, 1),
    assists_per_game numeric(5, 1),
    rebounds_per_game numeric(5, 1),
    three_pm_per_game numeric(5, 1),
    three_pct numeric(5, 3),
    source_id bigint references data_sources(id),
    unique (player_id, team_id, season_id)
);

create table if not exists timeline_events (
    id bigserial primary key,
    season_id bigint references seasons(id),
    event_date date not null,
    title text not null,
    body text not null,
    era_key text not null,
    impact_area text not null,
    player_id bigint references players(id),
    source_id bigint references data_sources(id)
);

create table if not exists business_metrics (
    id bigserial primary key,
    team_id bigint not null references teams(id),
    season_id bigint references seasons(id),
    metric_name text not null,
    metric_value numeric(12, 2) not null,
    unit text not null,
    estimated boolean not null default true,
    source_id bigint references data_sources(id),
    unique (team_id, season_id, metric_name, source_id)
);

create table if not exists media_metrics (
    id bigserial primary key,
    entity_name text not null,
    season_id bigint references seasons(id),
    metric_name text not null,
    metric_value numeric(14, 2) not null,
    unit text not null,
    period_start date,
    period_end date,
    source_id bigint references data_sources(id)
);

create table if not exists merchandise_rankings (
    id bigserial primary key,
    season_id bigint references seasons(id),
    period_label text not null,
    ranking_type text not null,
    rank integer not null,
    player_id bigint references players(id),
    team_id bigint references teams(id),
    source_id bigint references data_sources(id),
    constraint merchandise_rankings_unique unique nulls not distinct (
        season_id,
        period_label,
        ranking_type,
        player_id,
        team_id
    )
);

create index if not exists idx_team_season_stats_season_id on team_season_stats(season_id);
create index if not exists idx_player_season_stats_player_id on player_season_stats(player_id);
create index if not exists idx_timeline_events_era_key on timeline_events(era_key);
create index if not exists idx_business_metrics_metric_name on business_metrics(metric_name);
create index if not exists idx_media_metrics_metric_name on media_metrics(metric_name);
