<?php

declare(strict_types=1);

final class Database
{
    public static function connect(): PDO
    {
        $databaseUrl = self::env('DATABASE_URL') ?: self::env('POSTGRES_URL');

        if ($databaseUrl !== null) {
            return self::connectUsingConfig(self::configFromUrl($databaseUrl));
        }

        return self::connectUsingConfig([
            'host' => self::env('DB_HOST') ?: self::env('POSTGRES_HOST') ?: '127.0.0.1',
            'port' => self::env('DB_PORT') ?: self::env('POSTGRES_PORT') ?: '5433',
            'database' => self::env('DB_DATABASE') ?: self::env('POSTGRES_DATABASE') ?: self::env('POSTGRES_DB') ?: 'warriors',
            'username' => self::env('DB_USERNAME') ?: self::env('POSTGRES_USER') ?: 'warriors',
            'password' => self::env('DB_PASSWORD') ?: self::env('POSTGRES_PASSWORD') ?: 'warriors',
            'sslmode' => self::env('DB_SSLMODE') ?: self::env('POSTGRES_SSLMODE'),
        ]);
    }

    /**
     * @param array{host:string,port:string,database:string,username:string,password:string,sslmode?:string|null} $config
     */
    private static function connectUsingConfig(array $config): PDO
    {
        $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $config['host'], $config['port'], $config['database']);

        if (!empty($config['sslmode'])) {
            $dsn .= ';sslmode=' . $config['sslmode'];
        }

        // O Neon identifica o banco pelo nome do servidor (SNI). Versões antigas da libpq não mandam
        // esse nome, então passamos o identificador também nas opções da conexão.
        if (str_ends_with($config['host'], '.neon.tech')) {
            $endpoint = str_replace('-pooler', '', explode('.', $config['host'])[0]);
            $dsn .= ";options='endpoint=" . $endpoint . "'";
        }

        return new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => self::usesConnectionPooler($config),
        ]);
    }

    /**
     * @return array{host:string,port:string,database:string,username:string,password:string,sslmode?:string|null}
     */
    private static function configFromUrl(string $databaseUrl): array
    {
        $parts = parse_url($databaseUrl);

        if ($parts === false || empty($parts['host'])) {
            throw new RuntimeException('Invalid database URL.');
        }

        $query = [];
        parse_str($parts['query'] ?? '', $query);

        return [
            'host' => $parts['host'],
            'port' => (string) ($parts['port'] ?? 5432),
            'database' => ltrim($parts['path'] ?? '/postgres', '/') ?: 'postgres',
            'username' => rawurldecode($parts['user'] ?? ''),
            'password' => rawurldecode($parts['pass'] ?? ''),
            'sslmode' => isset($query['sslmode']) ? (string) $query['sslmode'] : null,
        ];
    }

    /**
     * @param array{host:string,port:string,database:string,username:string,password:string,sslmode?:string|null} $config
     */
    private static function usesConnectionPooler(array $config): bool
    {
        return str_contains($config['host'], 'pooler.supabase.com') || $config['port'] === '6543';
    }

    private static function env(string $key): ?string
    {
        $value = getenv($key);

        return $value === false || $value === '' ? null : $value;
    }
}
