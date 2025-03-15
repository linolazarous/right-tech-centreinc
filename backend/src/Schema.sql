-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    bio TEXT,
    role VARCHAR(50) DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    job_title VARCHAR(255),
    company VARCHAR(255),
    skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ads Table
CREATE TABLE Ads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliations Table
CREATE TABLE Affiliations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE Analytics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    course_id INT REFERENCES Courses(id),
    activity VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AR Learning Table
CREATE TABLE ARLearning (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ar_content_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ARVR Learning Table
CREATE TABLE ARVRLearning (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    arvr_content_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges Table
CREATE TABLE Badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain Table
CREATE TABLE Blockchain (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    transaction_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Coaching Table
CREATE TABLE CareerCoaching (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    coach_id INT REFERENCES Users(id),
    session_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Path Table
CREATE TABLE CareerPath (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    steps TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Table
CREATE TABLE Certificates (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    course_id INT REFERENCES Courses(id),
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_url VARCHAR(255)
);

-- Coding Challenges Table
CREATE TABLE CodingChallenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50),
    code_template TEXT,
    test_cases JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Creation Table
CREATE TABLE ContentCreation (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50),
    created_by INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Corporate Table
CREATE TABLE Corporate (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INT REFERENCES Users(id),
    price NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum Table
CREATE TABLE Forum (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification Table
CREATE TABLE Gamification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    points INT DEFAULT 0,
    badges INT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration Table
CREATE TABLE Integration (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Table
CREATE TABLE Interview (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    interviewer_id INT REFERENCES Users(id),
    interview_date TIMESTAMP NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE Jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    posted_by INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Matching Table
CREATE TABLE JobMatching (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    job_id INT REFERENCES Jobs(id),
    match_score NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Language Switcher Table
CREATE TABLE LanguageSwitcher (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    preferred_language VARCHAR(50) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard Table
CREATE TABLE Leaderboard (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    score INT DEFAULT 0,
    rank INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Path Table
CREATE TABLE LearningPath (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    courses INT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live QA Table
CREATE TABLE LiveQA (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    asked_by INT REFERENCES Users(id),
    answered_by INT REFERENCES Users(id),
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Localization Table
CREATE TABLE Localization (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    translations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metaverse Table
CREATE TABLE Metaverse (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    virtual_world_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Microlearning Table
CREATE TABLE Microlearning (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_url VARCHAR(255) NOT NULL,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Moderation Table
CREATE TABLE Moderation (
    id SERIAL PRIMARY KEY,
    content_id INT NOT NULL,
    content_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    moderated_by INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offline Table
CREATE TABLE Offline (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Table
CREATE TABLE Payment (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Privacy Table
CREATE TABLE Privacy (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    show_email BOOLEAN DEFAULT FALSE,
    show_profile BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proctoring Table
CREATE TABLE Proctoring (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    exam_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    flagged_events TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Push Notification Table
CREATE TABLE PushNotification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation Table
CREATE TABLE Recommendation (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    recommended_course_id INT REFERENCES Courses(id),
    score NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume Builder Table
CREATE TABLE ResumeBuilder (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    template VARCHAR(255) NOT NULL,
    content JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scholarships Table
CREATE TABLE Scholarships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Assessment Table
CREATE TABLE SkillsAssessment (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    skill VARCHAR(255) NOT NULL,
    score NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Table
CREATE TABLE Social (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    platform VARCHAR(50),
    profile_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Media Table
CREATE TABLE SocialMedia (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    platform VARCHAR(50),
    profile_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Table
CREATE TABLE Subscription (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    plan VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translation Table
CREATE TABLE Translation (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    translations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual Lab Table
CREATE TABLE VirtualLab (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lab_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual Tutor Table
CREATE TABLE VirtualTutor (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tutor_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Career Fair Table
CREATE TABLE VRCareerFair (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    fair_url VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Lab Table
CREATE TABLE VRLab (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lab_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Learning Table
CREATE TABLE VRLearning (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    vr_content_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Zoom Table
CREATE TABLE Zoom (
    id SERIAL PRIMARY KEY,
    meeting_id VARCHAR(255) NOT NULL,
    host_id INT REFERENCES Users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    participants INT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AccessibilitySettings Table
CREATE TABLE AccessibilitySettings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) UNIQUE NOT NULL,
    high_contrast_mode BOOLEAN DEFAULT FALSE,
    font_size VARCHAR(50) DEFAULT 'medium',
    screen_reader_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);