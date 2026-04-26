begin;

create temp table import_data_sources (
    source_key text,
    name text,
    url text,
    publisher text,
    access_type text,
    license_notes text,
    retrieved_at date
) on commit drop;

copy import_data_sources
from '/data/csv/data_sources.csv'
with (format csv, header true);

insert into data_sources (source_key, name, url, publisher, access_type, license_notes, retrieved_at)
select source_key, name, url, publisher, access_type, license_notes, retrieved_at
from import_data_sources
on conflict (source_key) do update set
    name = excluded.name,
    url = excluded.url,
    publisher = excluded.publisher,
    access_type = excluded.access_type,
    license_notes = excluded.license_notes,
    retrieved_at = excluded.retrieved_at;

create temp table import_teams (
    team_key text,
    name text,
    city text,
    abbreviation text
) on commit drop;

copy import_teams
from '/data/csv/teams.csv'
with (format csv, header true);

insert into teams (team_key, name, city, abbreviation)
select team_key, name, city, abbreviation
from import_teams
on conflict (team_key) do update set
    name = excluded.name,
    city = excluded.city,
    abbreviation = excluded.abbreviation;

create temp table import_seasons (
    season_label text,
    start_year integer,
    end_year integer
) on commit drop;

copy import_seasons
from '/data/csv/seasons.csv'
with (format csv, header true);

insert into seasons (season_label, start_year, end_year)
select season_label, start_year, end_year
from import_seasons
on conflict (season_label) do update set
    start_year = excluded.start_year,
    end_year = excluded.end_year;

create temp table import_players (
    player_key text,
    team_key text,
    external_nba_id text,
    external_balldontlie_id text,
    first_name text,
    last_name text,
    position text,
    draft_year integer,
    draft_round integer,
    draft_pick integer,
    active boolean
) on commit drop;

copy import_players
from '/data/csv/players.csv'
with (format csv, header true);

insert into players (
    player_key,
    team_id,
    external_nba_id,
    external_balldontlie_id,
    first_name,
    last_name,
    position,
    draft_year,
    draft_round,
    draft_pick,
    active
)
select
    import_players.player_key,
    teams.id,
    import_players.external_nba_id,
    import_players.external_balldontlie_id,
    import_players.first_name,
    import_players.last_name,
    import_players.position,
    import_players.draft_year,
    import_players.draft_round,
    import_players.draft_pick,
    import_players.active
from import_players
join teams on teams.team_key = import_players.team_key
on conflict (player_key) do update set
    team_id = excluded.team_id,
    external_nba_id = excluded.external_nba_id,
    external_balldontlie_id = excluded.external_balldontlie_id,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    position = excluded.position,
    draft_year = excluded.draft_year,
    draft_round = excluded.draft_round,
    draft_pick = excluded.draft_pick,
    active = excluded.active;

create temp table import_team_season_stats (
    team_key text,
    season_label text,
    wins integer,
    losses integer,
    playoff_result text,
    championships integer,
    source_key text
) on commit drop;

copy import_team_season_stats
from '/data/csv/team_season_stats.csv'
with (format csv, header true);

insert into team_season_stats (team_id, season_id, wins, losses, playoff_result, championships, source_id)
select
    teams.id,
    seasons.id,
    import_team_season_stats.wins,
    import_team_season_stats.losses,
    nullif(import_team_season_stats.playoff_result, ''),
    import_team_season_stats.championships,
    data_sources.id
from import_team_season_stats
join teams on teams.team_key = import_team_season_stats.team_key
join seasons on seasons.season_label = import_team_season_stats.season_label
join data_sources on data_sources.source_key = import_team_season_stats.source_key
on conflict (team_id, season_id) do update set
    wins = excluded.wins,
    losses = excluded.losses,
    playoff_result = excluded.playoff_result,
    championships = excluded.championships,
    source_id = excluded.source_id;

create temp table import_player_season_stats (
    player_key text,
    team_key text,
    season_label text,
    games integer,
    points_per_game numeric(5, 1),
    assists_per_game numeric(5, 1),
    rebounds_per_game numeric(5, 1),
    three_pm_per_game numeric(5, 1),
    three_pct numeric(5, 3),
    source_key text
) on commit drop;

copy import_player_season_stats
from '/data/csv/player_season_stats.csv'
with (format csv, header true);

insert into player_season_stats (
    player_id,
    team_id,
    season_id,
    games,
    points_per_game,
    assists_per_game,
    rebounds_per_game,
    three_pm_per_game,
    three_pct,
    source_id
)
select
    players.id,
    teams.id,
    seasons.id,
    import_player_season_stats.games,
    import_player_season_stats.points_per_game,
    import_player_season_stats.assists_per_game,
    import_player_season_stats.rebounds_per_game,
    import_player_season_stats.three_pm_per_game,
    import_player_season_stats.three_pct,
    data_sources.id
from import_player_season_stats
join players on players.player_key = import_player_season_stats.player_key
join teams on teams.team_key = import_player_season_stats.team_key
join seasons on seasons.season_label = import_player_season_stats.season_label
join data_sources on data_sources.source_key = import_player_season_stats.source_key
on conflict (player_id, team_id, season_id) do update set
    games = excluded.games,
    points_per_game = excluded.points_per_game,
    assists_per_game = excluded.assists_per_game,
    rebounds_per_game = excluded.rebounds_per_game,
    three_pm_per_game = excluded.three_pm_per_game,
    three_pct = excluded.three_pct,
    source_id = excluded.source_id;

create temp table import_timeline_events (
    season_label text,
    event_date date,
    title text,
    body text,
    era_key text,
    impact_area text,
    player_key text,
    source_key text
) on commit drop;

copy import_timeline_events
from '/data/csv/timeline_events.csv'
with (format csv, header true);

delete from timeline_events;

insert into timeline_events (
    season_id,
    event_date,
    title,
    body,
    era_key,
    impact_area,
    player_id,
    source_id
)
select
    seasons.id,
    import_timeline_events.event_date,
    import_timeline_events.title,
    import_timeline_events.body,
    import_timeline_events.era_key,
    import_timeline_events.impact_area,
    players.id,
    data_sources.id
from import_timeline_events
left join seasons on seasons.season_label = import_timeline_events.season_label
left join players on players.player_key = nullif(import_timeline_events.player_key, '')
join data_sources on data_sources.source_key = import_timeline_events.source_key;

create temp table import_business_metrics (
    team_key text,
    season_label text,
    metric_name text,
    metric_value numeric(12, 2),
    unit text,
    estimated boolean,
    source_key text
) on commit drop;

copy import_business_metrics
from '/data/csv/business_metrics.csv'
with (format csv, header true);

insert into business_metrics (team_id, season_id, metric_name, metric_value, unit, estimated, source_id)
select
    teams.id,
    seasons.id,
    import_business_metrics.metric_name,
    import_business_metrics.metric_value,
    import_business_metrics.unit,
    import_business_metrics.estimated,
    data_sources.id
from import_business_metrics
join teams on teams.team_key = import_business_metrics.team_key
left join seasons on seasons.season_label = import_business_metrics.season_label
join data_sources on data_sources.source_key = import_business_metrics.source_key
on conflict (team_id, season_id, metric_name, source_id) do update set
    metric_value = excluded.metric_value,
    unit = excluded.unit,
    estimated = excluded.estimated;

create temp table import_media_metrics (
    entity_name text,
    season_label text,
    metric_name text,
    metric_value numeric(14, 2),
    unit text,
    period_start date,
    period_end date,
    source_key text
) on commit drop;

copy import_media_metrics
from '/data/csv/media_metrics.csv'
with (format csv, header true);

delete from media_metrics;

insert into media_metrics (entity_name, season_id, metric_name, metric_value, unit, period_start, period_end, source_id)
select
    import_media_metrics.entity_name,
    seasons.id,
    import_media_metrics.metric_name,
    import_media_metrics.metric_value,
    import_media_metrics.unit,
    import_media_metrics.period_start,
    import_media_metrics.period_end,
    data_sources.id
from import_media_metrics
left join seasons on seasons.season_label = import_media_metrics.season_label
join data_sources on data_sources.source_key = import_media_metrics.source_key;

create temp table import_merchandise_rankings (
    season_label text,
    period_label text,
    ranking_type text,
    rank integer,
    player_key text,
    team_key text,
    source_key text
) on commit drop;

copy import_merchandise_rankings
from '/data/csv/merchandise_rankings.csv'
with (format csv, header true);

insert into merchandise_rankings (season_id, period_label, ranking_type, rank, player_id, team_id, source_id)
select
    seasons.id,
    import_merchandise_rankings.period_label,
    import_merchandise_rankings.ranking_type,
    import_merchandise_rankings.rank,
    players.id,
    teams.id,
    data_sources.id
from import_merchandise_rankings
left join seasons on seasons.season_label = import_merchandise_rankings.season_label
left join players on players.player_key = nullif(import_merchandise_rankings.player_key, '')
left join teams on teams.team_key = nullif(import_merchandise_rankings.team_key, '')
join data_sources on data_sources.source_key = import_merchandise_rankings.source_key
on conflict (season_id, period_label, ranking_type, player_id, team_id) do update set
    rank = excluded.rank,
    source_id = excluded.source_id;

commit;

