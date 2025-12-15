#!/bin/bash
set -e

# Create additional databases
# The default database (POSTGRES_DB) is already created by the postgres image

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "adv-course-nestjs-cqrs-demo";
    GRANT ALL PRIVILEGES ON DATABASE "adv-course-nestjs-cqrs-demo" TO postgres;
EOSQL
