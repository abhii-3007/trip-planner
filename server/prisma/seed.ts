import { PrismaClient, Role, TripStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── College ──────────────────────────────────────────────────────────────
  const college = await prisma.college.upsert({
    where: { contact_email: 'admin@greenfield.edu' },
    update: {},
    create: {
      name: 'Greenfield University',
      address: '42 University Avenue, Pune, Maharashtra 411001',
      contact_email: 'admin@greenfield.edu',
    },
  });
  console.log(`✅ College: ${college.name}`);

  // ── Admin User ────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greenfield.edu' },
    update: {},
    create: {
      name: 'Dr. Ananya Sharma',
      email: 'admin@greenfield.edu',
      password_hash: passwordHash,
      role: Role.admin,
    },
  });
  console.log(`✅ Admin User: ${admin.email}`);

  // ── Coordinator User ──────────────────────────────────────────────────────
  const coordHash = await bcrypt.hash('coord123', 10);
  const coordinator = await prisma.user.upsert({
    where: { email: 'coordinator@greenfield.edu' },
    update: {},
    create: {
      name: 'Prof. Rajesh Kumar',
      email: 'coordinator@greenfield.edu',
      password_hash: coordHash,
      role: Role.coordinator,
    },
  });
  console.log(`✅ Coordinator: ${coordinator.email}`);

  // ── Trips ─────────────────────────────────────────────────────────────────
  const trips = await Promise.all([
    prisma.trip.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'Himalayan Science Expedition',
        destination: 'Manali, Himachal Pradesh',
        description:
          'An enriching academic expedition to the Himalayan Research Institute. Students will attend workshops on glaciology, biodiversity, and high-altitude ecology. Includes guided treks and field data collection sessions.',
        start_date: new Date('2025-06-10'),
        end_date: new Date('2025-06-16'),
        max_capacity: 40,
        organizer_id: admin.id,
        status: TripStatus.upcoming,
        image_url:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      },
    }),
    prisma.trip.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        title: 'Cultural Heritage Tour — Rajasthan',
        destination: 'Jaipur & Udaipur, Rajasthan',
        description:
          'Explore the rich cultural heritage of Rajasthan through visits to historical forts, palaces, and museums. Includes lectures by historians and a hands-on pottery workshop with local artisans.',
        start_date: new Date('2025-07-05'),
        end_date: new Date('2025-07-10'),
        max_capacity: 35,
        organizer_id: coordinator.id,
        status: TripStatus.upcoming,
        image_url:
          'https://images.unsplash.com/photo-1477587458883-47145ed31ffd?w=800&q=80',
      },
    }),
    prisma.trip.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        title: 'Marine Biology Field Study',
        destination: 'Goa & Lakshadweep',
        description:
          'A comprehensive marine biology field study covering coral reef ecosystems, marine fauna identification, and water quality testing. Includes snorkeling sessions with expert marine biologists.',
        start_date: new Date('2025-08-20'),
        end_date: new Date('2025-08-27'),
        max_capacity: 25,
        organizer_id: admin.id,
        status: TripStatus.upcoming,
        image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      },
    }),
  ]);
  console.log(`✅ Created ${trips.length} trips`);

  // ── Students ──────────────────────────────────────────────────────────────
  const studentData = [
    {
      name: 'Priya Menon',
      email: 'priya.menon@student.greenfield.edu',
      phone: '9876543210',
      enrollment_no: 'GU2021CS001',
      department: 'Computer Science',
      year: 3,
    },
    {
      name: 'Arjun Patel',
      email: 'arjun.patel@student.greenfield.edu',
      phone: '9876543211',
      enrollment_no: 'GU2022BIO002',
      department: 'Biology',
      year: 2,
    },
    {
      name: 'Sneha Rao',
      email: 'sneha.rao@student.greenfield.edu',
      phone: '9876543212',
      enrollment_no: 'GU2021PHY003',
      department: 'Physics',
      year: 3,
    },
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@student.greenfield.edu',
      phone: '9876543213',
      enrollment_no: 'GU2023HIST004',
      department: 'History',
      year: 1,
    },
    {
      name: 'Kavya Nair',
      email: 'kavya.nair@student.greenfield.edu',
      phone: '9876543214',
      enrollment_no: 'GU2022ENV005',
      department: 'Environmental Science',
      year: 2,
    },
  ];

  const students = await Promise.all(
    studentData.map((s) =>
      prisma.student.upsert({
        where: { email: s.email },
        update: {},
        create: { ...s, college_id: college.id },
      })
    )
  );
  console.log(`✅ Created ${students.length} students`);

  // ── Registrations ─────────────────────────────────────────────────────────
  const registrations = await Promise.all([
    prisma.tripRegistration.upsert({
      where: { trip_id_student_id: { trip_id: 1, student_id: students[0].id } },
      update: {},
      create: {
        trip_id: 1,
        student_id: students[0].id,
        payment_status: PaymentStatus.paid,
        emergency_contact: '9800000001',
        medical_notes: 'No known allergies',
      },
    }),
    prisma.tripRegistration.upsert({
      where: { trip_id_student_id: { trip_id: 1, student_id: students[1].id } },
      update: {},
      create: {
        trip_id: 1,
        student_id: students[1].id,
        payment_status: PaymentStatus.pending,
        emergency_contact: '9800000002',
      },
    }),
    prisma.tripRegistration.upsert({
      where: { trip_id_student_id: { trip_id: 2, student_id: students[2].id } },
      update: {},
      create: {
        trip_id: 2,
        student_id: students[2].id,
        payment_status: PaymentStatus.paid,
        emergency_contact: '9800000003',
        medical_notes: 'Mild lactose intolerance',
      },
    }),
    prisma.tripRegistration.upsert({
      where: { trip_id_student_id: { trip_id: 2, student_id: students[3].id } },
      update: {},
      create: {
        trip_id: 2,
        student_id: students[3].id,
        payment_status: PaymentStatus.waived,
        emergency_contact: '9800000004',
      },
    }),
    prisma.tripRegistration.upsert({
      where: { trip_id_student_id: { trip_id: 3, student_id: students[4].id } },
      update: {},
      create: {
        trip_id: 3,
        student_id: students[4].id,
        payment_status: PaymentStatus.paid,
        emergency_contact: '9800000005',
        medical_notes: 'Slight motion sickness',
      },
    }),
  ]);
  console.log(`✅ Created ${registrations.length} registrations`);

  console.log('\n🎉 Seed complete!\n');
  console.log('--- Credentials ---');
  console.log('Admin     → admin@greenfield.edu / admin123');
  console.log('Coordinator → coordinator@greenfield.edu / coord123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
