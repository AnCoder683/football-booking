-- CreateTable
CREATE TABLE "Branch" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "playersPerTeam" INTEGER NOT NULL,
    "pricePerSlot" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Business constraints maintained in SQL (not representable in Prisma schema).
ALTER TABLE "Court"
    ADD CONSTRAINT "Court_playersPerTeam_check" CHECK ("playersPerTeam" IN (5, 7, 11)),
    ADD CONSTRAINT "Court_pricePerSlot_check" CHECK ("pricePerSlot" BETWEEN 1 AND 536870911);

-- Collapse ECMAScript whitespace (same set as JS /\s+/gu), then trim.
-- pg_c_utf8 gives Unicode lowercasing; C compares the resulting key exactly,
-- preserving Vietnamese accents. Keep the original display name in "name".
-- This also protects inactive courts; do not add an isActive predicate.
CREATE UNIQUE INDEX "Court_branchId_normalizedName_key" ON "Court" (
    "branchId",
    (lower(btrim(regexp_replace(
        "name",
        U&'[\0009-\000D\0020\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]+',
        ' ',
        'g'
    )) COLLATE "pg_c_utf8") COLLATE "C")
);
