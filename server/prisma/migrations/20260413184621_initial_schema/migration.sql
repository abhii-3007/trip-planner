-- CreateTable
CREATE TABLE College (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE
);

-- CreateTable
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'coordinator') NOT NULL DEFAULT 'coordinator'
);

-- CreateTable
CREATE TABLE Student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    enrollment_no VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    college_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES College(id)
);

-- CreateTable
CREATE TABLE Trip (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    max_capacity INT NOT NULL,
    organizer_id INT NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    image_url VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES User(id)
);

-- CreateTable
CREATE TABLE TripRegistration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    student_id INT NOT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('paid', 'pending', 'waived') NOT NULL DEFAULT 'pending',
    emergency_contact VARCHAR(255) NOT NULL,
    medical_notes TEXT,
    FOREIGN KEY (trip_id) REFERENCES Trip(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    UNIQUE (trip_id, student_id)
);
