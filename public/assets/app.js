const state = {
    mode: 'story',
    seasonFilter: 'all',
    curryFilter: 'all',
    topic: 'court',
    data: null,
};

const charts = {};
let storyObserver = null;

const format = new Intl.NumberFormat('pt-BR');

const topicTitles = {
    court: 'Quadra',
    curry: 'Stephen Curry',
    media: 'Midia',
    finance: 'Financeiro',
    culture: 'Cultura',
};

const topicNotes = {
    court: 'Comparacao entre as temporadas antes do draft de 2009 e a era Curry.',
    curry: 'Medias individuais de Curry agrupadas por fases uteis da narrativa.',
    media: 'Amostras de audiencia, receita e metricas publicas ligadas ao alcance da franquia.',
    finance: 'Evolucao de valor estimado e receita anual disponiveis nos CSVs.',
    culture: 'Rankings publicos de camisa e merchandise usados como sinal de relevancia cultural.',
};

const eraLabels = {
    all: 'Todas',
    pre_curry: 'Antes de Curry',
    arrival: 'Chegada',
    dynasty: 'Dinastia',
    chase_reset: 'Transicao Chase',
    title_2022: 'Titulo 2022',
    post_title: 'Pos titulo 2022',
    post_klay: 'Pos-Klay',
};

const arenaLabels = {
    oracle: 'Oracle/Oakland',
    chase_center: 'Chase Center',
};

const seasonFilterOptions = {
    all: 'Todas',
    pre_curry: 'Antes de Curry',
    curry_era: 'Era Curry',
    title_years: 'Anos de titulo',
    oracle_dynasty: 'Dinastia Oracle',
    chase_center: 'Chase Center',
    post_klay: 'Pos-Klay',
};

const curryFilterOptions = {
    all: 'Todas',
    arrival: 'Chegada',
    dynasty: 'Dinastia',
    title_years: 'Anos de titulo',
    chase_center: 'Chase Center',
    post_klay: 'Pos-Klay',
};

const storyVisuals = {
    oracleInterior: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Oracle_Arena.JPG?width=900',
        alt: 'Interior da Oracle Arena antes da era Curry',
        credit: 'Cutlass Supreme, public domain',
    },
    oracleExterior: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Theoraclearena.jpg?width=900',
        alt: 'Oracle Arena em Oakland vista de fora',
        credit: 'Coolcaesar, CC BY-SA 3.0',
    },
    curryShooting2011: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Curry_shooting.jpg?width=1200',
        alt: 'Stephen Curry arremessando pelos Warriors em 2011',
        credit: 'Keith Allison, CC BY-SA 2.0',
    },
    warriors2013: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Golden_State_Warriors_2013.jpg?width=1200',
        alt: 'Jogo dos Warriors em 2013',
        credit: 'Matthew Addie, CC BY 2.0',
    },
    warriors2015Champions: {
        url: 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2015/06/17/klaythompsoncurrycampeoesnbasplashezra-shawgetty.jpg',
        alt: 'Stephen Curry e Klay Thompson comemorando o titulo de 2015',
        credit: 'Foto: Ezra Shaw / Getty Images',
    },
    curryDribble2016: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Curry_dribbling_2016_(cropped).jpg?width=900',
        alt: 'Stephen Curry chamando jogada em 2016',
        credit: 'Keith Allison, CC BY-SA 2.0',
    },
    curryParade2017: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Curry_Warriors_Parade_2017_02.png?width=1200',
        alt: 'Stephen Curry na parada do titulo dos Warriors em 2017',
        credit: 'Jozie, CC BY-SA 4.0',
    },
    curryDurant2018: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Curry_and_Kevin_Durant.jpg?width=1200',
        alt: 'Stephen Curry e Kevin Durant na temporada do bicampeonato',
        credit: 'Cyrus Saatsaz, CC BY-SA 4.0',
    },
    warriorsCeltics2022Court: {
        url: 'https://s2-ge.glbimg.com/taIN6RVvduBsX5SU7sDVuMGbBZA=/0x0:3016x2011/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/0/X/6UQKW1RVStRENXfditkQ/2022-06-17t034716z-1160531043-mt1usatoday18549445-rtrmadp-3-nba-finals-golden-state-warriors-at-boston-celtics.jpg',
        alt: 'Warriors contra Celtics em quadra nas finais de 2022',
        credit: 'Foto: Bob DeChiara-USA TODAY Sports',
    },
    klayCourtWarriors: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Klay_Thompson_vs._Jared_Dudley_(cropped).jpg?width=1200',
        alt: 'Klay Thompson arremessando em jogo pelos Warriors',
        credit: 'Keith Allison, CC BY-SA 2.0',
    },
    oracleFinals2019: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Oracle_Arena_June_2019.jpg?width=1200',
        alt: 'Oracle Arena durante as finais de 2019',
        credit: 'Cullen328, CC BY-SA 3.0',
    },
    chaseEast: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chase_Center_-_East_Side_-_San_Francisco.jpg?width=1200',
        alt: 'Fachada do Chase Center em San Francisco',
        credit: 'Tony Wasserman, CC BY-SA 2.0',
    },
    curry2022: {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Steph_Curry_(51914632287).jpg?width=1200',
        alt: 'Stephen Curry em 2022',
        credit: 'Erik Drost, CC BY 2.0',
    },
    guiSantos: {
        url: 'https://conteudo.imguol.com.br/c/esporte/6c/2024/10/27/gui-santos-executa-arremesso-durante-partida-do-golden-state-warriors-na-nba-1730065379602_v2_360x480.jpg.webp',
        alt: 'Gui Santos arremessando pelo Golden State Warriors',
        credit: 'Foto: Instagram de Gui Santos via UOL',
    },
};

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    window.addEventListener('resize', resizeCharts);
});

async function loadDashboard() {
    const status = document.querySelector('#data-status');
    status.textContent = 'Carregando';
    status.classList.remove('error');

    try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        state.data = await response.json();
        status.textContent = 'PostgreSQL';
        render();
    } catch (error) {
        status.textContent = 'Banco indisponivel';
        status.classList.add('error');
        renderError(error);
    }
}

function render() {
    if (!state.data) {
        return;
    }

    renderModeControls();
    renderSources();

    if (state.mode === 'story') {
        renderStoryView();
        return;
    }

    renderGraphView();
}

function renderModeControls() {
    document.querySelectorAll('[data-mode]').forEach((button) => {
        const isActive = button.dataset.mode === state.mode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
        button.onclick = () => {
            state.mode = button.dataset.mode;
            setViewVisibility();
            render();
            document.querySelector('#content-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
    });

    setViewVisibility();
}

function setViewVisibility() {
    const storyView = document.querySelector('#story-view');
    const graphsView = document.querySelector('#graphs-view');
    const storyIsActive = state.mode === 'story';

    storyView.hidden = !storyIsActive;
    graphsView.hidden = storyIsActive;
    storyView.classList.toggle('is-active', storyIsActive);
    graphsView.classList.toggle('is-active', !storyIsActive);
}

function renderStoryView() {
    renderStoryTimeline();
}

function renderGraphView() {
    renderSummaryCards();

    renderControls('season-era-controls', seasonFilterOptions, state.seasonFilter, (value) => {
        state.seasonFilter = value;
        renderWinsChart();
    });
    renderWinsChart();

    renderControls('topic-controls', state.data.topicOptions, state.topic, (value) => {
        state.topic = value;
        renderFocusAnalysis();
    });
    renderFocusAnalysis();

    renderControls('curry-era-controls', curryFilterOptions, state.curryFilter, (value) => {
        state.curryFilter = value;
        renderCurryChart();
    });
    renderCurryChart();
    renderBusinessChart();

    window.setTimeout(resizeCharts, 0);
}

function renderControls(id, options, active, onClick) {
    const container = document.querySelector(`#${id}`);
    container.innerHTML = '';

    Object.entries(options).forEach(([value, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `control-button${value === active ? ' is-active' : ''}`;
        button.textContent = label;
        button.addEventListener('click', () => onClick(value));
        container.appendChild(button);
    });
}

function renderSummaryCards() {
    const container = document.querySelector('#summary-cards');
    const before = state.data.beforeAfter.find((item) => item.period_key === 'before_curry');
    const after = state.data.beforeAfter.find((item) => item.period_key === 'curry_era');
    const bestSeason = [...state.data.allSeasons].sort((a, b) => Number(b.wins) - Number(a.wins))[0];
    const latestValuation = [...state.data.businessMetrics]
        .filter((item) => item.metric_name === 'valuation')
        .sort((a, b) => Number(b.start_year) - Number(a.start_year))[0];

    const cards = [
        {
            label: 'Media antes',
            value: before ? `${Number(before.avg_wins).toFixed(1)} W` : '-',
            note: before ? `${before.seasons} temporadas antes do draft de 2009` : '',
        },
        {
            label: 'Media era Curry',
            value: after ? `${Number(after.avg_wins).toFixed(1)} W` : '-',
            note: after ? `${after.seasons} temporadas desde 2009-10` : '',
        },
        {
            label: 'Melhor campanha',
            value: bestSeason ? `${bestSeason.wins}-${bestSeason.losses}` : '-',
            note: bestSeason ? bestSeason.season_label : '',
        },
        {
            label: 'Valor recente',
            value: latestValuation ? moneyInBillions(latestValuation.metric_value) : '-',
            note: latestValuation ? `${latestValuation.season_label} estimado` : '',
        },
    ];

    container.innerHTML = cards.map((card) => `
        <article class="metric-card">
            <p class="metric-label">${escapeHtml(card.label)}</p>
            <p class="metric-value">${escapeHtml(card.value)}</p>
            <p class="metric-note">${escapeHtml(card.note)}</p>
        </article>
    `).join('');
}

function renderStoryTimeline() {
    const container = document.querySelector('#story-timeline');
    const events = state.data.timeline;

    container.innerHTML = events.map((event) => {
        const visual = visualForEvent(event);

        return `
            <article class="story-event" tabindex="0">
                <figure class="story-side story-visual">
                    <img src="${escapeAttribute(visual.url)}" alt="${escapeAttribute(visual.alt)}" loading="lazy" referrerpolicy="no-referrer">
                    <figcaption>${escapeHtml(visual.credit)}</figcaption>
                </figure>
                <div class="story-year-node" aria-hidden="true">
                    <span>${escapeHtml(String(event.start_year ?? yearFromDate(event.event_date)))}</span>
                </div>
                <div class="story-side story-copy-card">
                    <p class="timeline-date">${escapeHtml(event.season_label ?? '')} · ${escapeHtml(formatDate(event.event_date))}</p>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.body)}</p>
                    <div class="tag-row">
                        <span class="tag">${escapeHtml(eraLabels[event.era_key] ?? event.era_key)}</span>
                        <span class="tag">${escapeHtml(topicTitleForEvent(event))}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    observeStoryEvents();
}

function observeStoryEvents() {
    if (storyObserver) {
        storyObserver.disconnect();
    }

    if (!('IntersectionObserver' in window)) {
        return;
    }

    storyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, { threshold: 0.34 });

    document.querySelectorAll('.story-event').forEach((event) => storyObserver.observe(event));
}

function renderWinsChart() {
    const seasons = filteredSeasons(state.seasonFilter);
    document.querySelector('#season-count').textContent = `${seasons.length} temporadas`;

    if (seasons.length === 0) {
        renderEmptyChart('wins-chart', 'Nenhuma temporada encontrada.');
        return;
    }

    setChart('wins-chart', {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { top: 28, right: 52, bottom: 58, left: 42 },
        xAxis: {
            type: 'category',
            data: seasons.map((season) => season.season_label),
            axisLabel: { rotate: seasons.length > 14 ? 45 : 0 },
        },
        yAxis: [
            { type: 'value', name: 'Vitorias', min: 0, max: 82 },
            { type: 'value', name: 'Win%', min: 0, max: 100 },
        ],
        series: [
            {
                name: 'Vitorias',
                type: 'line',
                smooth: true,
                symbolSize: 7,
                data: seasons.map((season) => Number(season.wins)),
                color: '#1d4f91',
                markLine: seasons.some((season) => season.season_label === '2009-10')
                    ? {
                        symbol: 'none',
                        lineStyle: { color: '#c94c3a', type: 'dashed' },
                        label: { formatter: 'Draft Curry' },
                        data: [{ xAxis: '2009-10' }],
                    }
                    : undefined,
            },
            {
                name: 'Win%',
                type: 'bar',
                yAxisIndex: 1,
                data: seasons.map((season) => Math.round(Number(season.win_pct) * 100)),
                color: 'rgba(244, 190, 59, 0.72)',
            },
        ],
    });
}

function renderFocusAnalysis() {
    document.querySelector('#focus-chart-title').textContent = topicTitles[state.topic] ?? 'Analise';
    document.querySelector('#focus-chart-note').textContent = topicNotes[state.topic] ?? '';
    document.querySelector('#focus-table-title').textContent = topicTitles[state.topic] ?? 'Consulta';

    if (state.topic === 'court') {
        renderBeforeAfterChart('focus-chart');
    } else if (state.topic === 'curry') {
        renderCurryAverageChart('focus-chart');
    } else if (state.topic === 'media') {
        renderMediaFocusChart('focus-chart');
    } else if (state.topic === 'finance') {
        renderFinanceFocusChart('focus-chart');
    } else {
        renderCultureFocusChart('focus-chart');
    }

    renderTopicTable();
    window.setTimeout(resizeCharts, 0);
}

function renderBeforeAfterChart(id) {
    const data = state.data.beforeAfter;

    setChart(id, {
        tooltip: { trigger: 'axis' },
        grid: { top: 28, right: 16, bottom: 32, left: 44 },
        xAxis: {
            type: 'category',
            data: data.map((item) => item.period_key === 'before_curry' ? 'Antes' : 'Era Curry'),
        },
        yAxis: { type: 'value', name: 'Media W', min: 0, max: 82 },
        series: [{
            name: 'Media de vitorias',
            type: 'bar',
            data: data.map((item) => Number(item.avg_wins)),
            color: ['#8b95a5', '#1d4f91'],
            label: { show: true, position: 'top' },
        }],
    });
}

function renderCurryAverageChart(id) {
    const data = curryComparisonRows();

    setChart(id, {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { top: 28, right: 24, bottom: 58, left: 42 },
        xAxis: {
            type: 'category',
            data: data.map((row) => row.label),
        },
        yAxis: { type: 'value', name: 'Media' },
        series: [
            {
                name: 'Pontos por jogo',
                type: 'bar',
                data: data.map((row) => Number(row.avg_points)),
                color: '#1d4f91',
                label: { show: true, position: 'top' },
            },
            {
                name: 'Assistencias',
                type: 'line',
                data: data.map((row) => Number(row.avg_assists)),
                color: '#2f7d5b',
            },
            {
                name: 'Bolas de 3 por jogo',
                type: 'line',
                data: data.map((row) => Number(row.avg_three_pm)),
                color: '#c94c3a',
            },
        ],
    });
}

function renderMediaFocusChart(id) {
    const data = state.data.mediaMetrics.map((row) => ({
        name: row.entity_name,
        value: normalizedMetricValue(row),
        formatted: formatMetricValue(row),
    }));

    if (data.length === 0) {
        renderEmptyChart(id, 'Nenhuma metrica de midia encontrada.');
        return;
    }

    setChart(id, {
        tooltip: {
            trigger: 'item',
            formatter: (params) => `${escapeHtml(params.name)}<br>${escapeHtml(params.data.formatted)}`,
        },
        grid: { top: 24, right: 18, bottom: 72, left: 58 },
        xAxis: {
            type: 'category',
            data: data.map((row) => row.name),
            axisLabel: { rotate: data.length > 1 ? 25 : 0 },
        },
        yAxis: { type: 'value', name: 'Valor normalizado' },
        series: [{
            name: 'Metricas',
            type: 'bar',
            data,
            color: '#1d4f91',
            label: {
                show: true,
                position: 'top',
                formatter: (params) => params.data.formatted,
            },
        }],
    });
}

function renderFinanceFocusChart(id) {
    const valuation = state.data.businessMetrics.filter((item) => item.metric_name === 'valuation');
    const revenue = state.data.businessMetrics.filter((item) => item.metric_name === 'revenue');
    const labels = [...new Set([...valuation, ...revenue].map((item) => item.season_label))];

    if (labels.length === 0) {
        renderEmptyChart(id, 'Nenhuma metrica financeira encontrada.');
        return;
    }

    setChart(id, {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { top: 28, right: 48, bottom: 58, left: 46 },
        xAxis: {
            type: 'category',
            data: labels,
            axisLabel: { rotate: labels.length > 8 ? 45 : 0 },
        },
        yAxis: [
            { type: 'value', name: 'Valor B' },
            { type: 'value', name: 'Receita M' },
        ],
        series: [
            {
                name: 'Valor estimado US$ bi',
                type: 'line',
                smooth: true,
                data: labels.map((label) => {
                    const row = valuation.find((item) => item.season_label === label);
                    return row ? Number(row.metric_value) / 1000 : null;
                }),
                color: '#1d4f91',
            },
            {
                name: 'Receita US$ mi',
                type: 'bar',
                yAxisIndex: 1,
                data: labels.map((label) => {
                    const row = revenue.find((item) => item.season_label === label);
                    return row ? Number(row.metric_value) : null;
                }),
                color: 'rgba(47, 125, 91, 0.72)',
            },
        ],
    });
}

function renderCultureFocusChart(id) {
    const data = state.data.merchandiseRankings;

    if (data.length === 0) {
        renderEmptyChart(id, 'Nenhum ranking cultural encontrado.');
        return;
    }

    setChart(id, {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        grid: { top: 24, right: 18, bottom: 68, left: 44 },
        xAxis: {
            type: 'category',
            data: data.map((row) => `${row.season_label} ${row.subject_name}`),
            axisLabel: { rotate: data.length > 3 ? 35 : 0 },
        },
        yAxis: { type: 'value', name: 'Rank', inverse: true, min: 1 },
        series: [{
            name: 'Ranking',
            type: 'bar',
            data: data.map((row) => Number(row.rank)),
            color: '#f4be3b',
            label: {
                show: true,
                position: 'top',
                formatter: (params) => `#${params.value}`,
            },
        }],
    });
}

function renderCurryChart() {
    const seasons = filteredCurrySeasons(state.curryFilter);
    document.querySelector('#curry-season-count').textContent = `${seasons.length} temporadas`;

    if (seasons.length === 0) {
        renderEmptyChart('curry-chart', 'Nenhuma temporada do Curry encontrada.');
        return;
    }

    setChart('curry-chart', {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { top: 28, right: 46, bottom: 58, left: 42 },
        xAxis: {
            type: 'category',
            data: seasons.map((season) => season.season_label),
            axisLabel: { rotate: seasons.length > 10 ? 45 : 0 },
        },
        yAxis: [
            { type: 'value', name: 'PPG', min: 0 },
            { type: 'value', name: '3PM', min: 0 },
        ],
        series: [
            {
                name: 'Pontos por jogo',
                type: 'line',
                smooth: true,
                data: seasons.map((season) => Number(season.points_per_game)),
                color: '#1d4f91',
            },
            {
                name: 'Bolas de 3 por jogo',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                data: seasons.map((season) => Number(season.three_pm_per_game)),
                color: '#2f7d5b',
            },
        ],
    });
}

function renderBusinessChart() {
    renderFinanceFocusChart('business-chart');
}

function renderTopicTable() {
    if (state.topic === 'court') {
        renderTable(['Temporada', 'Periodo', 'Arena', 'Recorde', 'Win%', 'Titulo', 'Playoffs'], state.data.allSeasons.map((row) => [
            row.season_label,
            eraLabels[row.era_key] ?? row.era_key,
            arenaLabels[row.arena_key] ?? row.arena_key,
            `${row.wins}-${row.losses}`,
            `${Math.round(Number(row.win_pct) * 100)}%`,
            Number(row.championships) > 0 ? 'sim' : 'nao',
            row.playoff_result || '-',
        ]));
        return;
    }

    if (state.topic === 'curry') {
        renderTable(['Temporada', 'Periodo', 'Arena', 'Jogos', 'PPG', 'AST', '3PM', 'Titulo'], filteredCurrySeasons('all').map((row) => [
            row.season_label,
            eraLabels[row.era_key] ?? row.era_key,
            arenaLabels[row.arena_key] ?? row.arena_key,
            row.games,
            row.points_per_game,
            row.assists_per_game,
            row.three_pm_per_game,
            Number(row.championships) > 0 ? 'sim' : 'nao',
        ]));
        return;
    }

    if (state.topic === 'media') {
        renderTable(['Entidade', 'Metrica', 'Valor', 'Periodo', 'Fonte'], state.data.mediaMetrics.map((row) => [
            row.entity_name,
            row.metric_name,
            formatMetricValue(row),
            `${formatDate(row.period_start)} a ${formatDate(row.period_end)}`,
            sourceLink(row),
        ]), true);
        return;
    }

    if (state.topic === 'finance') {
        renderTable(['Temporada', 'Metrica', 'Valor', 'Estimado', 'Fonte'], state.data.businessMetrics.map((row) => [
            row.season_label,
            row.metric_name,
            formatMetricValue(row),
            row.estimated ? 'sim' : 'nao',
            sourceLink(row),
        ]), true);
        return;
    }

    renderTable(['Temporada', 'Tipo', 'Rank', 'Nome', 'Periodo'], state.data.merchandiseRankings.map((row) => [
        row.season_label,
        row.ranking_type,
        `#${row.rank}`,
        row.subject_name,
        row.period_label,
    ]));
}

function renderSources() {
    const container = document.querySelector('#sources');

    if (!container || !state.data) {
        return;
    }

    container.innerHTML = state.data.sources.map((source) => {
        const href = safeHttpUrl(source.url);
        const title = href
            ? `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>`
            : escapeHtml(source.name);

        return `
            <article class="source-item">
                <strong>${title}</strong>
                <span>${escapeHtml(source.publisher)} · ${escapeHtml(source.access_type)}</span>
                <span>${escapeHtml(source.license_notes ?? '')}</span>
            </article>
        `;
    }).join('');
}

function renderTable(headers, rows, allowHtml = false) {
    const table = document.querySelector('#topic-table');

    if (rows.length === 0) {
        table.innerHTML = '<tbody><tr><td>Nenhum dado encontrado.</td></tr></tbody>';
        return;
    }

    const head = `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${rows.map((row) => `
        <tr>${row.map((cell) => `<td>${allowHtml ? cell : escapeHtml(String(cell ?? ''))}</td>`).join('')}</tr>
    `).join('')}</tbody>`;

    table.innerHTML = `${head}${body}`;
}

function setChart(id, option) {
    const element = document.querySelector(`#${id}`);

    if (!window.echarts) {
        element.innerHTML = '<div class="empty-state">ECharts nao carregou.</div>';
        return;
    }

    if (charts[id]) {
        charts[id].clear();
    } else {
        element.innerHTML = '';
        charts[id] = window.echarts.init(element);
    }

    charts[id].setOption(option, true);
}

function renderEmptyChart(id, message) {
    const element = document.querySelector(`#${id}`);

    if (charts[id]) {
        charts[id].dispose();
        charts[id] = null;
    }

    element.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function resizeCharts() {
    Object.values(charts).forEach((chart) => chart?.resize());
}

function filteredSeasons(era) {
    return state.data.allSeasons.filter((season) => seasonMatchesFilter(season, era));
}

function filteredCurrySeasons(era) {
    const seasons = state.data.allCurrySeasons ?? state.data.currySeasons;

    return seasons.filter((season) => currySeasonMatchesFilter(season, era));
}

function seasonMatchesFilter(season, filter) {
    const startYear = Number(season.start_year);

    if (filter === 'all') {
        return true;
    }

    if (filter === 'pre_curry') {
        return startYear < 2009;
    }

    if (filter === 'curry_era') {
        return startYear >= 2009;
    }

    if (filter === 'title_years') {
        return Number(season.championships) > 0;
    }

    if (filter === 'oracle_dynasty') {
        return startYear >= 2014 && startYear <= 2018;
    }

    if (filter === 'chase_center') {
        return season.arena_key === 'chase_center';
    }

    if (filter === 'post_klay') {
        return startYear >= 2024;
    }

    return season.era_key === filter;
}

function currySeasonMatchesFilter(season, filter) {
    const startYear = Number(season.start_year);

    if (filter === 'all') {
        return true;
    }

    if (filter === 'title_years') {
        return Number(season.championships) > 0;
    }

    if (filter === 'chase_center') {
        return season.arena_key === 'chase_center';
    }

    if (filter === 'post_klay') {
        return startYear >= 2024;
    }

    return season.era_key === filter;
}

function curryComparisonRows() {
    const groups = [
        ['arrival', 'Chegada', (season) => season.era_key === 'arrival'],
        ['dynasty', 'Dinastia Oracle', (season) => season.era_key === 'dynasty'],
        ['title_years', 'Anos de titulo', (season) => Number(season.championships) > 0],
        ['chase_center', 'Chase Center', (season) => season.arena_key === 'chase_center'],
        ['post_klay', 'Pos-Klay', (season) => Number(season.start_year) >= 2024],
    ];

    const seasons = state.data.allCurrySeasons ?? state.data.currySeasons;

    return groups.map(([key, label, predicate]) => {
        const groupSeasons = seasons.filter(predicate);

        return {
            key,
            label,
            seasons: groupSeasons.length,
            avg_points: average(groupSeasons, 'points_per_game'),
            avg_assists: average(groupSeasons, 'assists_per_game'),
            avg_three_pm: average(groupSeasons, 'three_pm_per_game'),
        };
    }).filter((row) => row.seasons > 0);
}

function average(rows, key) {
    if (rows.length === 0) {
        return 0;
    }

    const total = rows.reduce((sum, row) => sum + Number(row[key]), 0);
    return Number((total / rows.length).toFixed(1));
}

function visualForEvent(event) {
    const visualsByStartYear = {
        1994: storyVisuals.oracleInterior,
        2006: storyVisuals.oracleExterior,
        2009: storyVisuals.curryShooting2011,
        2012: storyVisuals.warriors2013,
        2014: storyVisuals.warriors2015Champions,
        2015: storyVisuals.curryDribble2016,
        2016: storyVisuals.curryParade2017,
        2017: storyVisuals.curryDurant2018,
        2018: storyVisuals.oracleFinals2019,
        2019: storyVisuals.chaseEast,
        2020: storyVisuals.curry2022,
        2021: storyVisuals.warriorsCeltics2022Court,
        2023: storyVisuals.guiSantos,
        2024: storyVisuals.klayCourtWarriors,
    };

    if (visualsByStartYear[event.start_year]) {
        return visualsByStartYear[event.start_year];
    }

    return storyVisuals.chaseEast;
}

function topicTitleForEvent(event) {
    if (event.player_name) {
        return 'Curry';
    }

    if (['finance', 'business'].includes(event.impact_area)) {
        return 'Financeiro';
    }

    if (event.impact_area === 'titles') {
        return 'Titulos';
    }

    return topicTitles[event.impact_area] ?? event.impact_area;
}

function normalizedMetricValue(row) {
    const value = Number(row.metric_value);

    if (row.unit === 'viewers') {
        return value / 1000000;
    }

    return value;
}

function formatMetricValue(row) {
    const value = Number(row.metric_value);

    if (row.unit === 'USD_MILLION') {
        return `US$ ${format.format(value)} mi`;
    }

    if (row.unit === 'viewers') {
        return `${format.format(value)} espectadores`;
    }

    return `${format.format(value)} ${row.unit}`;
}

function moneyInBillions(value) {
    return `US$ ${(Number(value) / 1000).toFixed(1)}B`;
}

function sourceLink(row) {
    const href = safeHttpUrl(row.source_url);

    if (!href) {
        return '-';
    }

    return `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${escapeHtml(row.source_name ?? 'Fonte')}</a>`;
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return value;
}

function yearFromDate(value) {
    if (!value) {
        return '';
    }

    return String(value).slice(0, 4);
}

function renderError(error) {
    const message = escapeHtml(error.message);

    ['wins-chart', 'focus-chart', 'curry-chart', 'business-chart'].forEach((id) => {
        const element = document.querySelector(`#${id}`);

        if (element) {
            element.innerHTML = `<div class="empty-state">Erro ao carregar dados: ${message}</div>`;
        }
    });

    const story = document.querySelector('#story-timeline');
    const sources = document.querySelector('#sources');
    const summary = document.querySelector('#summary-cards');
    const table = document.querySelector('#topic-table');

    if (story) {
        story.innerHTML = '';
    }

    if (sources) {
        sources.innerHTML = '';
    }

    if (summary) {
        summary.innerHTML = '';
    }

    if (table) {
        table.innerHTML = '';
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
    return escapeHtml(value).replaceAll('`', '&#096;');
}

function safeHttpUrl(value) {
    if (!value) {
        return '';
    }

    try {
        const url = new URL(String(value), window.location.origin);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}
