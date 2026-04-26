drop view if exists
    story_curry_era_summary,
    story_merchandise_rankings,
    story_timeline,
    story_business_metrics,
    story_curry_seasons,
    story_era_summary,
    story_before_after_summary,
    story_season_overview
cascade;

create or replace view story_season_overview as
select
    seasons.season_label,
    seasons.start_year,
    seasons.end_year,
    case
        when seasons.start_year < 2009 then 'pre_curry'
        when seasons.start_year between 2009 and 2013 then 'arrival'
        when seasons.start_year between 2014 and 2018 then 'dynasty'
        when seasons.start_year between 2019 and 2020 then 'chase_reset'
        when seasons.start_year = 2021 then 'title_2022'
        when seasons.start_year between 2022 and 2023 then 'post_title'
        else 'post_klay'
    end as era_key,
    case
        when seasons.start_year >= 2019 then 'chase_center'
        else 'oracle'
    end as arena_key,
    team_season_stats.wins,
    team_season_stats.losses,
    team_season_stats.win_pct,
    team_season_stats.playoff_result,
    team_season_stats.championships,
    data_sources.name as source_name,
    data_sources.url as source_url
from team_season_stats
join teams on teams.id = team_season_stats.team_id
join seasons on seasons.id = team_season_stats.season_id
left join data_sources on data_sources.id = team_season_stats.source_id
where teams.team_key = 'gsw';

create or replace view story_before_after_summary as
select
    case
        when start_year < 2009 then 'before_curry'
        else 'curry_era'
    end as period_key,
    count(*) as seasons,
    round(avg(wins), 1) as avg_wins,
    round(avg(win_pct), 3) as avg_win_pct,
    sum(championships) as titles
from story_season_overview
group by period_key;

create or replace view story_era_summary as
select
    era_key,
    count(*) as seasons,
    round(avg(wins), 1) as avg_wins,
    round(avg(win_pct), 3) as avg_win_pct,
    sum(championships) as titles,
    max(wins) as best_wins
from story_season_overview
group by era_key;

create or replace view story_curry_seasons as
select
    seasons.season_label,
    seasons.start_year,
    case
        when seasons.start_year < 2009 then 'pre_curry'
        when seasons.start_year between 2009 and 2013 then 'arrival'
        when seasons.start_year between 2014 and 2018 then 'dynasty'
        when seasons.start_year between 2019 and 2020 then 'chase_reset'
        when seasons.start_year = 2021 then 'title_2022'
        when seasons.start_year between 2022 and 2023 then 'post_title'
        else 'post_klay'
    end as era_key,
    case
        when seasons.start_year >= 2019 then 'chase_center'
        else 'oracle'
    end as arena_key,
    player_season_stats.games,
    player_season_stats.points_per_game,
    player_season_stats.assists_per_game,
    player_season_stats.rebounds_per_game,
    player_season_stats.three_pm_per_game,
    player_season_stats.three_pct,
    coalesce(team_season_stats.championships, 0) as championships,
    data_sources.name as source_name,
    data_sources.url as source_url
from player_season_stats
join players on players.id = player_season_stats.player_id
join seasons on seasons.id = player_season_stats.season_id
left join team_season_stats on team_season_stats.team_id = player_season_stats.team_id
    and team_season_stats.season_id = player_season_stats.season_id
left join data_sources on data_sources.id = player_season_stats.source_id
where players.player_key = 'curry';

create or replace view story_business_metrics as
select
    seasons.season_label,
    seasons.start_year,
    business_metrics.metric_name,
    business_metrics.metric_value,
    business_metrics.unit,
    business_metrics.estimated,
    data_sources.name as source_name,
    data_sources.url as source_url
from business_metrics
join teams on teams.id = business_metrics.team_id
left join seasons on seasons.id = business_metrics.season_id
left join data_sources on data_sources.id = business_metrics.source_id
where teams.team_key = 'gsw';

create or replace view story_timeline as
select
    timeline_events.id,
    seasons.season_label,
    seasons.start_year,
    timeline_events.event_date,
    timeline_events.title,
    timeline_events.body,
    timeline_events.era_key,
    timeline_events.impact_area,
    coalesce(players.first_name || ' ' || players.last_name, '') as player_name,
    data_sources.name as source_name,
    data_sources.url as source_url
from timeline_events
left join seasons on seasons.id = timeline_events.season_id
left join players on players.id = timeline_events.player_id
left join data_sources on data_sources.id = timeline_events.source_id;

create or replace view story_merchandise_rankings as
select
    seasons.season_label,
    seasons.start_year,
    merchandise_rankings.period_label,
    merchandise_rankings.ranking_type,
    merchandise_rankings.rank,
    coalesce(players.first_name || ' ' || players.last_name, teams.name) as subject_name,
    data_sources.name as source_name,
    data_sources.url as source_url
from merchandise_rankings
left join seasons on seasons.id = merchandise_rankings.season_id
left join players on players.id = merchandise_rankings.player_id
left join teams on teams.id = merchandise_rankings.team_id
left join data_sources on data_sources.id = merchandise_rankings.source_id;

create or replace view story_curry_era_summary as
select
    era_key,
    count(*) as seasons,
    round(avg(points_per_game), 1) as avg_points,
    round(avg(assists_per_game), 1) as avg_assists,
    round(avg(three_pm_per_game), 1) as avg_three_pm
from story_curry_seasons
group by era_key;
