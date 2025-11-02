-- Porikroma Travel Platform Database Schema
-- MySQL 8.0+

-- Drop existing database and recreate (optional)
DROP DATABASE IF EXISTS porikroma;
CREATE DATABASE porikroma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE porikroma;

-- Users table (added is_deleted for soft delete)
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Hashed password
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,  -- With country code, e.g., +8801234567890
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY') NOT NULL,
    date_of_birth DATE,
    profile_picture_url VARCHAR(500),  -- ImgBB/Unsplash URL
    bio TEXT,
    location VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    travel_preferences TEXT,
    dietary_restrictions TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    role ENUM('TRAVELLER', 'ADMIN') DEFAULT 'TRAVELLER',
    is_deleted BOOLEAN DEFAULT FALSE,  -- Soft delete for admin user deletion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User authentication tokens (for OTP email verification, password reset)
CREATE TABLE user_tokens (
    token_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token_type ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'REMEMBER_ME') NOT NULL,
    token_value VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Destinations
CREATE TABLE destinations (
    destination_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_name VARCHAR(100) NOT NULL,
    country VARCHAR(60) DEFAULT 'Bangladesh',
    state_province VARCHAR(60),
    city VARCHAR(60),
    description TEXT,
    featured_image VARCHAR(500),  -- ImgBB/Unsplash URL
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    best_visit_time VARCHAR(100),
    weather_info TEXT,
    local_language VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'BDT',
    time_zone VARCHAR(50),
    entry_requirements TEXT,
    safety_rating ENUM('VERY_SAFE', 'SAFE', 'MODERATE', 'CAUTION', 'AVOID') DEFAULT 'SAFE',
    budget_level ENUM('BUDGET', 'MID_RANGE', 'LUXURY', 'PREMIUM') DEFAULT 'MID_RANGE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sub-destinations
CREATE TABLE sub_destinations (
    sub_destination_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    sub_destination_name VARCHAR(100) NOT NULL,
    category ENUM('HISTORICAL', 'NATURAL', 'CULTURAL', 'ADVENTURE', 'RELIGIOUS', 'ENTERTAINMENT', 'SHOPPING', 'BEACH', 'MOUNTAIN') NOT NULL,
    description TEXT,
    featured_image VARCHAR(500),  -- ImgBB/Unsplash URL
    address VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    entry_fee DECIMAL(8,2) DEFAULT 0.00,
    opening_hours VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    website_url VARCHAR(300),
    duration_hours DECIMAL(4,2),
    difficulty_level ENUM('EASY', 'MODERATE', 'HARD', 'EXTREME') DEFAULT 'EASY',
    accessibility_info TEXT,
    best_visit_time VARCHAR(100),
    facilities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- Accommodations
CREATE TABLE accommodations (
    accommodation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    accommodation_name VARCHAR(100) NOT NULL,
    accommodation_type ENUM('HOTEL', 'RESORT', 'GUESTHOUSE', 'HOSTEL', 'APARTMENT', 'VILLA', 'COTTAGE') NOT NULL,
    description TEXT,
    address VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    website_url VARCHAR(300),
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '12:00:00',
    price_per_night DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'BDT',
    amenities TEXT,
    room_types TEXT,
    cancellation_policy TEXT,
    photos JSON,  -- Array of ImgBB/Unsplash URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- Transportation
CREATE TABLE transport (
    transport_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    transport_type ENUM('BUS', 'TRAIN', 'FLIGHT', 'CAR_RENTAL', 'BOAT', 'MOTORCYCLE') NOT NULL,
    operator_name VARCHAR(100),
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    departure_time TIME,
    arrival_time TIME,
    duration_minutes INT,
    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'BDT',
    seat_types TEXT,
    amenities TEXT,
    booking_info TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    website_url VARCHAR(300),
    frequency VARCHAR(100),
    seasonal_availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- Trips
CREATE TABLE trips (
    trip_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_name VARCHAR(200) NOT NULL,  -- Customizable name
    destination_id BIGINT NOT NULL,
    creator_user_id BIGINT NOT NULL,
    trip_photo_url VARCHAR(500),  -- ImgBB/Unsplash URL
    trip_budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status ENUM('PLANNING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE,
    FOREIGN KEY (creator_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trip members
CREATE TABLE trip_members (
    trip_member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    member_role ENUM('CREATOR', 'ADMIN', 'MEMBER') DEFAULT 'MEMBER',
    invitation_status ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'REMOVED') DEFAULT 'PENDING',
    invited_by BIGINT,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    budget_contribution DECIMAL(10,2),
    emergency_contact VARCHAR(200),
    dietary_preferences TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE KEY unique_trip_member (trip_id, user_id)
);

-- Trip sub-destinations
CREATE TABLE trip_subdestinations (
    trip_subdestination_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    sub_destination_id BIGINT NOT NULL,
    estimated_cost DECIMAL(10,2),
    status ENUM('PLANNED', 'CONFIRMED', 'COMPLETED', 'SKIPPED') DEFAULT 'PLANNED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_destination_id) REFERENCES sub_destinations(sub_destination_id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_subdestination (trip_id, sub_destination_id)
);

-- Trip accommodations
CREATE TABLE trip_accommodations (
    trip_accommodation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    accommodation_id BIGINT NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    number_of_rooms INT DEFAULT 1,
    room_type VARCHAR(100),
    total_cost DECIMAL(10,2),
    booking_status ENUM('PLANNED', 'BOOKED', 'CONFIRMED', 'CANCELLED') DEFAULT 'PLANNED',
    booking_reference VARCHAR(100),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(accommodation_id) ON DELETE CASCADE
);

-- Trip transport
CREATE TABLE trip_transport (
    trip_transport_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    transport_id BIGINT NOT NULL,
    journey_type ENUM('TO_DESTINATION', 'FROM_DESTINATION', 'LOCAL_TRANSPORT') DEFAULT 'TO_DESTINATION',
    travel_date DATE,
    departure_time TIME,
    arrival_time TIME,
    number_of_passengers INT DEFAULT 1,
    seat_preference VARCHAR(100),
    total_cost DECIMAL(10,2),
    booking_status ENUM('PLANNED', 'BOOKED', 'CONFIRMED', 'CANCELLED') DEFAULT 'PLANNED',
    booking_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (transport_id) REFERENCES transport(transport_id) ON DELETE CASCADE
);

-- Trip invitations
CREATE TABLE trip_invitations (
    invitation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    inviter_user_id BIGINT NOT NULL,
    invitee_user_id BIGINT NOT NULL,
    invitation_message TEXT,
    status ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED') DEFAULT 'PENDING',
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (inviter_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (invitee_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User notifications
CREATE TABLE user_notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    notification_type ENUM('TRIP_INVITATION', 'TRIP_UPDATE', 'PAYMENT_REMINDER', 'GENERAL') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type ENUM('TRIP', 'USER', 'EXPENSE') NULL,
    related_entity_id BIGINT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trip messages
CREATE TABLE trip_messages (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    message_type ENUM('TEXT', 'IMAGE', 'FILE', 'LOCATION', 'SYSTEM', 'POLL') DEFAULT 'TEXT',
    content TEXT NOT NULL,
    attachment_url VARCHAR(500),  -- ImgBB URL for images
    poll_options JSON,  -- e.g., {"options": ["Yes", "No"], "votes": {user_id: option}}
    reply_to_message_id BIGINT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_message_id) REFERENCES trip_messages(message_id) ON DELETE SET NULL
);

-- Trip expenses
CREATE TABLE trip_expenses (
    expense_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    paid_by_user_id BIGINT NOT NULL,
    expense_category ENUM('ACCOMMODATION', 'TRANSPORT', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'EMERGENCY', 'OTHER') NOT NULL,
    description VARCHAR(200) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),  -- ImgBB URL
    is_shared BOOLEAN DEFAULT TRUE,
    split_method ENUM('EQUAL', 'PERCENTAGE', 'AMOUNT', 'CUSTOM') DEFAULT 'EQUAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Expense settlements
CREATE TABLE expense_settlements (
    settlement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    expense_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount_owed DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    is_checked BOOLEAN DEFAULT FALSE,  -- Checkbox for "paid/confirmed"
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES trip_expenses(expense_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_settlement (expense_id, user_id)
);

-- Reviews
CREATE TABLE reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    entity_type ENUM('DESTINATION', 'SUB_DESTINATION', 'ACCOMMODATION', 'TRANSPORT') NOT NULL,
    entity_id BIGINT NOT NULL,
    trip_id BIGINT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review_title VARCHAR(200),
    review_content TEXT,
    photos JSON,  -- Array of ImgBB/Unsplash URLs
    is_public BOOLEAN DEFAULT TRUE,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE SET NULL,
    UNIQUE KEY unique_review (user_id, entity_type, entity_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_destinations_country_state ON destinations(country, state_province);
CREATE INDEX idx_sub_destinations_destination ON sub_destinations(destination_id);
CREATE INDEX idx_sub_destinations_category ON sub_destinations(category);
CREATE INDEX idx_trips_creator ON trips(creator_user_id);
CREATE INDEX idx_trips_destination ON trips(destination_id);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trip_members_trip ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user ON trip_members(user_id);
CREATE INDEX idx_trip_members_status ON trip_members(invitation_status);
CREATE INDEX idx_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_notifications_unread ON user_notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON user_notifications(created_at);
CREATE INDEX idx_messages_trip ON trip_messages(trip_id);
CREATE INDEX idx_messages_created ON trip_messages(created_at);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_entity ON reviews(entity_type, entity_id);