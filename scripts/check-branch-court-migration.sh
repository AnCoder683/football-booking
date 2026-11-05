#!/usr/bin/env bash
set -euo pipefail

# Run from the repository root. Uses only a new, uniquely named test database.
# Keep the database for inspection; never reset/drop an existing database.
test_database="football_booking_migration_test_$(date -u +%Y%m%d%H%M%S)_${RANDOM}"
echo "Test database: $test_database"
docker compose exec -T db sh -c 'createdb -U "$POSTGRES_USER" "$1"' sh "$test_database"
cat backend/prisma/migrations/20261105000000_create_user/migration.sql \
    backend/prisma/migrations/20261105073601_create_branch_court/migration.sql \
    backend/tests/sql/branch-court.sql |
    docker compose exec -T db sh -c 'psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$1"' sh "$test_database"
echo "PASS. Test fixtures rolled back; test database retained: $test_database"
