-- Disposable fixtures for a newly created, separate API test database only.
INSERT INTO "Branch" (id, name, address, "updatedAt") VALUES
    ('30000000-0000-4000-8000-000000000001', 'API Test A', 'Test address A', now()),
    ('30000000-0000-4000-8000-000000000002', 'API Test B', 'Test address B', now());
INSERT INTO "Court" (id, "branchId", name, "playersPerTeam", "pricePerSlot", "isActive", "updatedAt") VALUES
    ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'A Demo', 5, 150000, true, now()),
    ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'B Demo', 7, 250000, true, now()),
    ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'C Demo', 11, 400000, true, now()),
    ('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', 'A Demo', 5, 175000, true, now()),
    ('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '0 Hidden', 5, 100000, false, now());
