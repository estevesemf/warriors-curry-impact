<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/StoryRepository.php';

sendSecurityHeaders();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';

if ($path === '/api/dashboard') {
    header('Content-Type: application/json; charset=utf-8');

    try {
        $repository = new StoryRepository(Database::connect());
        echo json_encode(
            $repository->dashboard($_GET['era'] ?? 'all', $_GET['topic'] ?? 'court'),
            JSON_THROW_ON_ERROR
        );
    } catch (Throwable $exception) {
        error_log($exception);
        http_response_code(500);
        echo json_encode([
            'error' => 'database_unavailable',
            'message' => 'Nao foi possivel carregar os dados agora.',
        ], JSON_THROW_ON_ERROR);
    }

    return;
}

if ($path !== '/') {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Not found';
    return;
}

function sendSecurityHeaders(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), geolocation=(), microphone=()');
    header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; img-src 'self' data: https://commons.wikimedia.org https://upload.wikimedia.org https://s2-ge.glbimg.com https://i.s3.glbimg.com https://conteudo.imguol.com.br https://p2.trrsf.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Curry Effect</title>
    <link rel="stylesheet" href="/assets/app.css">
    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js" defer></script>
    <script src="/assets/app.js" defer></script>
</head>
<body>
    <main>
        <header class="hero">
            <div class="hero-inner">
                <div class="hero-copy">
                    <p class="eyebrow">Golden State Warriors data story</p>
                    <h1>The Curry Effect</h1>
                    <p class="lede">A virada esportiva, financeira e cultural dos Warriors contada por temporadas, eventos e dados do PostgreSQL.</p>
                </div>
                <div class="status-pill" id="data-status">PostgreSQL</div>
                <p class="hero-credit">Imagem: Christopher Michel, CC BY 2.0</p>
            </div>
        </header>

        <section class="shell mode-switch" aria-label="Escolha da experiencia">
            <button class="mode-card is-active" type="button" data-mode="story">
                <span>Historia</span>
                <strong>Linha do tempo</strong>
            </button>
            <button class="mode-card" type="button" data-mode="graphs">
                <span>Graficos</span>
                <strong>Consultas e comparativos</strong>
            </button>
        </section>

        <div class="shell" id="content-anchor">
            <section class="view is-active" id="story-view" aria-label="Historia">
                <div class="story-heading">
                    <p class="eyebrow">Storytelling</p>
                    <h2>Linha do tempo vertical</h2>
                    <p>A historia alterna contexto e imagem em torno dos anos mais importantes. Passe o mouse sobre cada bloco para destacar o evento.</p>
                </div>
                <div class="story-track" id="story-timeline"></div>
            </section>

            <section class="view" id="graphs-view" aria-label="Graficos" hidden>
                <section class="metric-grid" id="summary-cards" aria-label="Resumo"></section>

                <section class="chart-panel">
                    <div class="panel-heading">
                        <div>
                            <p class="eyebrow">Temporadas</p>
                            <h2>Vitorias por temporada</h2>
                        </div>
                        <div class="panel-actions">
                            <span class="panel-meta" id="season-count"></span>
                            <div class="control-group compact" id="season-era-controls"></div>
                        </div>
                    </div>
                    <div class="chart" id="wins-chart"></div>
                </section>

                <section class="chart-panel analysis-panel">
                    <div class="panel-heading">
                        <div>
                            <p class="eyebrow">Analise por foco</p>
                            <h2 id="focus-chart-title">Quadra</h2>
                            <p class="panel-note" id="focus-chart-note"></p>
                        </div>
                        <div class="panel-actions wide">
                            <div class="control-group compact" id="topic-controls"></div>
                        </div>
                    </div>
                    <div class="analysis-layout">
                        <div class="chart" id="focus-chart"></div>
                        <div class="data-drawer">
                            <div class="drawer-heading">
                                <p class="eyebrow">Consulta</p>
                                <h3 id="focus-table-title">Quadra</h3>
                            </div>
                            <div class="table-wrap">
                                <table id="topic-table"></table>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="workspace split">
                    <div class="chart-panel">
                        <div class="panel-heading">
                            <div>
                                <p class="eyebrow">Stephen Curry</p>
                                <h2>Producao individual</h2>
                            </div>
                            <div class="panel-actions">
                                <span class="panel-meta" id="curry-season-count"></span>
                                <div class="control-group compact" id="curry-era-controls"></div>
                            </div>
                        </div>
                        <div class="chart small" id="curry-chart"></div>
                    </div>

                    <div class="chart-panel">
                        <div class="panel-heading">
                            <div>
                                <p class="eyebrow">Negocio</p>
                                <h2>Valor e receita</h2>
                            </div>
                        </div>
                        <div class="chart small" id="business-chart"></div>
                    </div>
                </section>
            </section>

            <section class="sources-section">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">Fontes</p>
                        <h2>Dados usados no MVP</h2>
                    </div>
                </div>
                <div class="sources" id="sources"></div>
            </section>
        </div>
    </main>
</body>
</html>
