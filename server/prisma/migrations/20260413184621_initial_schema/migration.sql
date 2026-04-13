-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'coordinator');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'pending', 'waived');

-- CreateTable
CREATE TABLE "College" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'coordinator',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "enrollment_no" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "college_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'upcoming',
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripRegistration" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "emergency_contact" TEXT NOT NULL,
    "medical_notes" TEXT,

    CONSTRAINT "TripRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_contact_email_key" ON "College"("contact_email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollment_no_key" ON "Student"("enrollment_no");

-- CreateIndex
CREATE INDEX "Student_college_id_idx" ON "Student"("college_id");

-- CreateIndex
CREATE INDEX "Trip_organizer_id_idx" ON "Trip"("organizer_id");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- CreateIndex
CREATE INDEX "TripRegistration_trip_id_idx" ON "TripRegistration"("trip_id");

-- CreateIndex
CREATE INDEX "TripRegistration_student_id_idx" ON "TripRegistration"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "TripRegistration_trip_id_student_id_key" ON "TripRegistration"("trip_id", "student_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripRegistration" ADD CONSTRAINT "TripRegistration_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripRegistration" ADD CONSTRAINT "TripRegistration_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
