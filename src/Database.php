<?php

declare(strict_types=1);

final class Database
{
    public static function connect(): PDO
    {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '5433';
        $database = getenv('DB_DATABASE') ?: 'warriors';
        $username = getenv('DB_USERNAME') ?: 'warriors';
        $password = getenv('DB_PASSWORD') ?: 'warriors';

        $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $database);

        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
