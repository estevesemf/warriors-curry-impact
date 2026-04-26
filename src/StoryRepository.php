<?php

declare(strict_types=1);

final class StoryRepository
{
    private const ERAS = [
        'all' => 'Todas',
        'pre_curry' => 'Antes de Curry',
        'arrival' => 'Chegada',
        'dynasty' => 'Dinastia',
        'chase_reset' => 'Transicao Chase',
        'title_2022' => 'Titulo 2022',
        'post_title' => 'Pos titulo 2022',
        'post_klay' => 'Pos-Klay',
    ];

    private const TOPICS = [
        'court' => 'Quadra',
        'curry' => 'Curry',
        'media' => 'Midia',
        'finance' => 'Financeiro',
        'culture' => 'Cultura',
    ];

    public function __construct(private readonly PDO $pdo)
    {
    }

    public function dashboard(string $era, string $topic): array
    {
        $era = $this->normalize($era, array_keys(self::ERAS), 'all');
        $topic = $this->normalize($topic, array_keys(self::TOPICS), 'court');

        return [
            'filters' => [
                'era' => $era,
                'topic' => $topic,
            ],
            'eraOptions' => self::ERAS,
            'topicOptions' => self::TOPICS,
            'seasons' => $this->seasons($era),
            'allSeasons' => $this->seasons('all'),
            'beforeAfter' => $this->beforeAfter(),
            'curryEraSummary' => $this->curryEraSummary(),
            'eraSummary' => $this->eraSummary(),
            'currySeasons' => $this->currySeasons($era),
            'allCurrySeasons' => $this->currySeasons('all'),
            'timeline' => $this->timeline(),
            'businessMetrics' => $this->businessMetrics(),
            'mediaMetrics' => $this->mediaMetrics(),
            'merchandiseRankings' => $this->merchandiseRankings(),
            'sources' => $this->sources(),
        ];
    }

    private function normalize(string $value, array $allowed, string $fallback): string
    {
        return in_array($value, $allowed, true) ? $value : $fallback;
    }

    private function seasons(string $era): array
    {
        return $this->all(
            "select season_label, start_year, era_key, arena_key, wins, losses, win_pct, playoff_result, championships, source_name, source_url
             from story_season_overview
             where (? = 'all' or era_key = ?)
             order by start_year",
            [$era, $era]
        );
    }

    private function beforeAfter(): array
    {
        return $this->all(
            "select period_key, seasons, avg_wins, avg_win_pct, titles
             from story_before_after_summary
             order by period_key"
        );
    }
    private function curryEraSummary(): array
    {
        return $this->all(
            "select era_key, seasons, avg_points, avg_assists, avg_three_pm
            from story_curry_era_summary
            order by
                case era_key
                    when 'arrival' then 1
                    when 'dynasty' then 2
                    when 'chase_reset' then 3
                    when 'title_2022' then 4
                    when 'post_title' then 5
                    else 6
                end"
        );
    }
    private function eraSummary(): array
    {
        return $this->all(
            "select era_key, seasons, avg_wins, avg_win_pct, titles, best_wins
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
                end"
        );
    }

    private function currySeasons(string $era): array
    {
        return $this->all(
            "select season_label, start_year, era_key, arena_key, games, points_per_game, assists_per_game, rebounds_per_game,
                    three_pm_per_game, three_pct, championships, source_name, source_url
             from story_curry_seasons
             where (? = 'all' or era_key = ?)
             order by start_year",
            [$era, $era]
        );
    }

    private function timeline(): array
    {
        return $this->all(
            "select id, season_label, start_year, event_date, title, body, era_key, impact_area, player_name, source_name, source_url
             from story_timeline
             order by event_date"
        );
    }

    private function businessMetrics(): array
    {
        return $this->all(
            "select season_label, start_year, metric_name, metric_value, unit, estimated, source_name, source_url
             from story_business_metrics
             order by metric_name, start_year"
        );
    }

    private function mediaMetrics(): array
    {
        return $this->all(
            "select media_metrics.entity_name, seasons.season_label, seasons.start_year, media_metrics.metric_name,
                    media_metrics.metric_value, media_metrics.unit, media_metrics.period_start, media_metrics.period_end,
                    data_sources.name as source_name, data_sources.url as source_url
             from media_metrics
             left join seasons on seasons.id = media_metrics.season_id
             left join data_sources on data_sources.id = media_metrics.source_id
             order by media_metrics.period_start nulls last, media_metrics.entity_name"
        );
    }

    private function merchandiseRankings(): array
    {
        return $this->all(
            "select season_label, start_year, period_label, ranking_type, rank, subject_name, source_name, source_url
             from story_merchandise_rankings
             order by start_year, ranking_type"
        );
    }

    private function sources(): array
    {
        return $this->all(
            "select source_key, name, url, publisher, access_type, license_notes, retrieved_at
             from data_sources
             order by publisher, name"
        );
    }

    private function all(string $sql, array $params = []): array
    {
        $statement = $this->pdo->prepare($sql);
        $statement->execute($params);

        return $statement->fetchAll();
    }
}
