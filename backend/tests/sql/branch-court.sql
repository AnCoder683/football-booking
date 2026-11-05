-- Run only on a fresh, separate test database after applying migration SQL.
BEGIN;

CREATE TEMP TABLE results (test TEXT, expected TEXT, actual TEXT);

-- Each expected failure runs in a PL/pgSQL subtransaction. Assert both
-- SQLSTATE and constraint name so an unrelated error cannot pass the test.
CREATE FUNCTION pg_temp.expect_failure(
    test_name TEXT, statement TEXT, expected_state TEXT, expected_constraint TEXT
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    actual_state TEXT;
    actual_constraint TEXT;
BEGIN
    BEGIN
        EXECUTE statement;
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS actual_state = RETURNED_SQLSTATE,
                                actual_constraint = CONSTRAINT_NAME;
        IF actual_state <> expected_state OR actual_constraint <> expected_constraint THEN
            RAISE EXCEPTION 'FAIL %: expected %/%, got %/%', test_name,
                expected_state, expected_constraint, actual_state, actual_constraint;
        END IF;
        INSERT INTO results VALUES (test_name, expected_state, actual_state);
        RETURN;
    END;
    RAISE EXCEPTION 'FAIL %: statement unexpectedly succeeded', test_name;
END;
$$;

INSERT INTO "Branch" (id, name, address, "updatedAt") VALUES
    ('10000000-0000-4000-8000-000000000001', 'Branch A', 'Demo A', now()),
    ('10000000-0000-4000-8000-000000000002', 'Branch B', 'Demo B', now());

-- This inactive court must still reserve its normalized name.
INSERT INTO "Court" (id, "branchId", name, "playersPerTeam", "pricePerSlot", "isActive", "updatedAt")
VALUES ('20000000-0000-4000-8000-000000000001',
        '10000000-0000-4000-8000-000000000001', ' Sân  A ', 5, 1, false, now());

-- Successful inserts exercise all team sizes and both price boundaries.
INSERT INTO "Court" (id, "branchId", name, "playersPerTeam", "pricePerSlot", "updatedAt") VALUES
    ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Sân B', 7, 536870911, now()),
    ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'San A', 11, 100000, now()),
    ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'sân a', 5, 100000, now());

DO $$ BEGIN
    IF (SELECT count(*) FROM "Court") <> 4 THEN RAISE EXCEPTION 'FAIL valid inserts'; END IF;
    IF NOT (SELECT "isActive" AND "createdAt" IS NOT NULL FROM "Court"
            WHERE id = '20000000-0000-4000-8000-000000000002') THEN
        RAISE EXCEPTION 'FAIL defaults';
    END IF;
END $$;
INSERT INTO results VALUES
    ('Teams 5/7/11 and price min/max', 'accepted', 'accepted'),
    ('Default isActive/createdAt', 'true / timestamp', 'true / timestamp'),
    ('Same name in different branch', 'accepted', 'accepted'),
    ('Vietnamese accents remain distinct', 'accepted', 'accepted');

SELECT pg_temp.expect_failure('Duplicate name, inactive court included',
    $q$UPDATE "Court" SET name = 'sân a' WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23505', 'Court_branchId_normalizedName_key');
SELECT pg_temp.expect_failure('Uppercase Vietnamese duplicate',
    $q$UPDATE "Court" SET name = 'SÂN A' WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23505', 'Court_branchId_normalizedName_key');
SELECT pg_temp.expect_failure('Tab/newline whitespace duplicate',
    $q$UPDATE "Court" SET name = E'\tSân\n A\t' WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23505', 'Court_branchId_normalizedName_key');
SELECT pg_temp.expect_failure('Unicode whitespace duplicate',
    $q$UPDATE "Court" SET name = U&'\00A0Sân\2003A\FEFF' WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23505', 'Court_branchId_normalizedName_key');

SELECT pg_temp.expect_failure('Invalid team size 6',
    $q$UPDATE "Court" SET "playersPerTeam" = 6 WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23514', 'Court_playersPerTeam_check');
SELECT pg_temp.expect_failure('Price zero',
    $q$UPDATE "Court" SET "pricePerSlot" = 0 WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23514', 'Court_pricePerSlot_check');
SELECT pg_temp.expect_failure('Negative price',
    $q$UPDATE "Court" SET "pricePerSlot" = -1 WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23514', 'Court_pricePerSlot_check');
SELECT pg_temp.expect_failure('Price above maximum',
    $q$UPDATE "Court" SET "pricePerSlot" = 536870912 WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23514', 'Court_pricePerSlot_check');

SELECT pg_temp.expect_failure('Missing branch',
    $q$UPDATE "Court" SET "branchId" = '10000000-0000-4000-8000-000000000099' WHERE id = '20000000-0000-4000-8000-000000000002'$q$,
    '23503', 'Court_branchId_fkey');
SELECT pg_temp.expect_failure('Delete referenced branch',
    $q$DELETE FROM "Branch" WHERE id = '10000000-0000-4000-8000-000000000001'$q$,
    '23503', 'Court_branchId_fkey');
SELECT pg_temp.expect_failure('Change referenced branch ID',
    $q$UPDATE "Branch" SET id = '10000000-0000-4000-8000-000000000099' WHERE id = '10000000-0000-4000-8000-000000000001'$q$,
    '23503', 'Court_branchId_fkey');

-- Display the exact data accepted and a concise result table before rollback.
SELECT "branchId", name, "playersPerTeam", "pricePerSlot", "isActive" FROM "Court" ORDER BY id;
SELECT test, expected, actual, expected = actual AS passed FROM results;
SELECT count(*) AS passed_cases FROM results;
ROLLBACK;
SELECT (SELECT count(*) FROM "Branch") AS remaining_branches,
       (SELECT count(*) FROM "Court") AS remaining_courts;
