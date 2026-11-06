# Warriors Curry Impact

Data storytelling sobre o impacto de Stephen Curry no Golden State Warriors:
linha do tempo dos eventos, vitórias por temporada antes e depois da chegada
dele, produção individual e indicadores de negócio e mídia, tudo em gráficos
interativos sobre um dataset curado à mão.

**É um projeto de vitrine.** Entra no portfólio como case temático publicado, e o
que ele demonstra é modelagem relacional, SQL e visualização de dados — não é
apresentado como arquitetura fullstack autoral. Manutenção é mínima por escolha:
o trabalho de fundo acontece nos outros projetos.

## O que demonstra tecnicamente

- Schema relacional em PostgreSQL com views (`sql/schema.sql`, `sql/views.sql`)
- Dataset próprio em CSV (`data/csv/`) importado por script SQL
- Backend PHP 8 com PDO, prepared statements e allowlist nos filtros
  (`src/StoryRepository.php`), servindo uma API JSON em `/api/dashboard`
- Frontend estático consumindo a API e desenhando os gráficos com ECharts
- Ambiente local em Docker Compose (Postgres + Adminer) e deploy em PHP na Vercel

## Rodar localmente

Pré-requisitos: PHP 8, Docker.

```bash
cp .env.example .env
docker compose up -d db adminer        # Postgres em 127.0.0.1:5433, Adminer em :8081
php -S 127.0.0.1:8080 -t public public/router.php
```

- Site: http://127.0.0.1:8080
- API: http://127.0.0.1:8080/api/dashboard

As credenciais do `.env.example` (`warriors`/`warriors`) são de desenvolvimento
local e não servem para nada publicado.

Depois de editar qualquer CSV em `data/csv`, reimporte:

```bash
docker compose exec db psql -U warriors -d warriors -f /sql/import_csv.sql
docker compose exec db psql -U warriors -d warriors -f /sql/views.sql
```

Os passos acima vêm da configuração do repositório e **não foram executados
nesta revisão**.

## Deploy

`vercel.json` usa o runtime comunitário `vercel-php`, com o Root Directory na
raiz do repositório e sem Output Directory. O Postgres local não vai junto: para
a API funcionar publicada é preciso um Postgres hospedado e as variáveis
`DATABASE_URL` (ou `DB_HOST`/`DB_PORT`/`DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD`)
configuradas na Vercel. Importação no banco remoto:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/import_csv_supabase.sql
psql "$DATABASE_URL" -f sql/views.sql
```

Não há URL pública registrada neste repositório.

## Estrutura

```txt
public/     entrada HTTP, roteador local e frontend (assets/app.js, app.css)
api/        entrada usada pela Vercel
src/        conexão PDO e repositório de consultas
sql/        schema, importação e views
data/csv/   dataset do projeto
docker/     Dockerfile do PHP
```

`CLAUDE.md` (`AGENTS.md` é symlink) tem o contexto para agentes de código,
incluindo o padrão de prepared statement + allowlist que deve ser mantido em
qualquer SQL novo.
