\echo '1. Quantidade de linhas por tabela principal'
select 'seasons' as table_name, count(*) as rows from seasons
union all
select 'team_season_stats', count(*) from team_season_stats
union all
select 'player_season_stats', count(*) from player_season_stats
union all
select 'timeline_events', count(*) from timeline_events
union all
select 'business_metrics', count(*) from business_metrics
order by table_name;

\echo '2. Media de vitorias antes e depois de Curry'
select *
from story_before_after_summary
order by period_key;

\echo '3. Eras narrativas'
select *
from story_era_summary
order by
    case era_key
        when 'pre_curry' then 1
        when 'arrival' then 2
        when 'dynasty' then 3
        when 'chase_reset' then 4
        when 'title_2022' then 5
        when 'post_title' then 6
        else 7
    end;

\echo '4. Temporadas com mais vitorias'
select season_label, era_key, arena_key, wins, losses, win_pct, playoff_result
from story_season_overview
order by wins desc
limit 10;

\echo '5. Relacao simples entre vitorias e valuation'
select
    story_season_overview.season_label,
    story_season_overview.wins,
    story_business_metrics.metric_value as valuation_usd_million
from story_season_overview
join story_business_metrics
    on story_business_metrics.season_label = story_season_overview.season_label
where story_business_metrics.metric_name = 'valuation'
order by story_season_overview.start_year;

\echo '6. Stats de Curry por temporada'
select season_label, era_key, arena_key, games, points_per_game, assists_per_game, three_pm_per_game, three_pct
from story_curry_seasons
order by start_year;
