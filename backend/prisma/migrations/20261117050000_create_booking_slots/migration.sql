CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "courtId" UUID NOT NULL,
    "startAt" TIMESTAMPTZ(3) NOT NULL,
    "endAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "pricePerSlot" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMPTZ(3),
    "cancelledById" UUID,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Booking_duration_check" CHECK (
        "endAt" - "startAt" IN (INTERVAL '30 minutes', INTERVAL '60 minutes', INTERVAL '90 minutes', INTERVAL '120 minutes')
    ),
    CONSTRAINT "Booking_startAt_check" CHECK (
        EXTRACT(MINUTE FROM "startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh') IN (0, 30)
        AND EXTRACT(SECOND FROM "startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh') = 0
    ),
    CONSTRAINT "Booking_hours_check" CHECK (
        ("startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::date = ("endAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::date
        AND ("startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::time >= TIME '06:00'
        AND ("endAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::time <= TIME '22:00'
    ),
    CONSTRAINT "Booking_pricePerSlot_check" CHECK ("pricePerSlot" BETWEEN 1 AND 536870911),
    CONSTRAINT "Booking_totalPrice_check" CHECK (
        "totalPrice" BETWEEN 1 AND 2147483644
        AND "totalPrice"::numeric = "pricePerSlot"::numeric * (EXTRACT(EPOCH FROM ("endAt" - "startAt")) / 1800)
    ),
    CONSTRAINT "Booking_cancellation_check" CHECK (
        ("status" = 'CONFIRMED' AND "cancelledAt" IS NULL AND "cancelledById" IS NULL)
        OR ("status" = 'CANCELLED' AND "cancelledAt" IS NOT NULL AND "cancelledById" IS NOT NULL)
    )
);

CREATE TABLE "BookingSlot" (
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "courtId" UUID NOT NULL,
    "startAt" TIMESTAMPTZ(3) NOT NULL,
    "releasedAt" TIMESTAMPTZ(3),
    CONSTRAINT "BookingSlot_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BookingSlot_startAt_check" CHECK (
        EXTRACT(MINUTE FROM "startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh') IN (0, 30)
        AND EXTRACT(SECOND FROM "startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh') = 0
        AND ("startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::time >= TIME '06:00'
        AND ("startAt" AT TIME ZONE 'Asia/Ho_Chi_Minh')::time <= TIME '21:30'
    )
);

CREATE UNIQUE INDEX "Booking_id_courtId_key" ON "Booking" ("id", "courtId");
CREATE UNIQUE INDEX "BookingSlot_bookingId_startAt_key" ON "BookingSlot" ("bookingId", "startAt");
CREATE UNIQUE INDEX "BookingSlot_courtId_startAt_active_key" ON "BookingSlot" ("courtId", "startAt")
    WHERE "releasedAt" IS NULL;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "BookingSlot" ADD CONSTRAINT "BookingSlot_bookingId_courtId_fkey" FOREIGN KEY ("bookingId", "courtId") REFERENCES "Booking"("id", "courtId") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "BookingSlot" ADD CONSTRAINT "BookingSlot_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
