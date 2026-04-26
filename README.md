# Warriors Curry Impact

Data storytelling sobre o impacto de Stephen Curry no Golden State Warriors, combinando estatisticas de temporada, contexto historico, indicadores de negocio e visualizacoes interativas.

O projeto foi construido como um case de portfolio para demonstrar modelagem relacional, consultas SQL, organizacao de dados em CSV, backend PHP com PDO e visualizacao no frontend com ECharts.

## Visao geral

A aplicacao apresenta uma narrativa visual sobre a transformacao dos Warriors antes e depois da chegada de Curry. O painel combina:

- linha do tempo dos principais eventos;
- comparativo de vitorias por temporada;
- producao individual de Stephen Curry;
- metricas de negocio, midia e cultura;
- fontes usadas no dataset.

## Stack

- PHP 8.4 com PDO
- PostgreSQL
- SQL, views e importacao de CSVs
- ECharts via CDN
- Docker Compose para ambiente local
- Adminer para inspecao do banco em desenvolvimento

## Como rodar localmente

Crie sua configuracao local a partir do exemplo:

```bash
cp .env.example .env
```

Suba o PostgreSQL e o Adminer:

```bash
docker compose up -d db adminer
```

Rode o site com o PHP local:

```bash
php -S 127.0.0.1:8080 -t public public/router.php
```

Acesse:

- Site: http://127.0.0.1:8080
- API: http://127.0.0.1:8080/api/dashboard
- Adminer: http://127.0.0.1:8081

Credenciais locais do banco:

```text
Sistema: PostgreSQL
Servidor: db
Usuario: warriors
Senha: warriors
Banco: warriors
```

Essas credenciais sao apenas para desenvolvimento local. Nao use esses valores em producao.

Para acessar pelo `psql` local, use `127.0.0.1`:

```bash
psql "postgresql://warriors:warriors@127.0.0.1:5433/warriors"
```

## Dados

Os dados ficam em `data/csv` e sao carregados no PostgreSQL pelos scripts SQL em `sql/`. As views em `sql/views.sql` organizam os dados para consumo da API.

Sempre que editar arquivos em `data/csv`, reimporte os dados:

```bash
docker compose exec db psql -U warriors -d warriors -f /sql/import_csv.sql
docker compose exec db psql -U warriors -d warriors -f /sql/views.sql
```

## Estrutura

```text
public/        Entrada HTTP, assets e frontend
src/           Conexao PDO e repositorio de consultas
sql/           Schema, importacao e views
data/csv/      Dataset manual do projeto
docker/        Dockerfile PHP
```
