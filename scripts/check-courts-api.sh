#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Never reuse/reset the development database or an existing test database.
test_database="football_booking_api_test_$(date -u +%Y%m%d%H%M%S)_${RANDOM}"
echo "API test database: $test_database"
docker compose exec -T db sh -c 'createdb -U "$POSTGRES_USER" "$1"' sh "$test_database"
cat backend/prisma/migrations/*/migration.sql backend/tests/sql/courts-api-fixtures.sql |
    docker compose exec -T db sh -c 'psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$1"' sh "$test_database"

cd backend
TEST_DATABASE_NAME="$test_database" node --import tsx --test tests/courts.test.mjs
echo "API checks passed. Separate test database retained: $test_database"
