-- ========================================
-- CLEAN RESET
-- ========================================

DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- ========================================
-- ORGANIZATION TABLE
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- PROJECTS TABLE
-- ========================================

CREATE TABLE projects (
    projectid SERIAL PRIMARY KEY,
    organizationid INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    projectdate DATE,

    CONSTRAINT fk_organization
        FOREIGN KEY (organizationid)
        REFERENCES organization(organization_id)
);

INSERT INTO projects (organizationid, title, description, location, projectdate)
VALUES
(1, 'Community Cleanup', 'Cleaning public parks and streets', 'Lubumbashi', '2026-06-10'),
(1, 'Food Donation Drive', 'Providing meals to low-income families', 'Kolwezi', '2026-06-15'),
(1, 'Tree Planting Campaign', 'Planting trees in schools and communities', 'Likasi', '2026-06-20'),
(1, 'School Supply Distribution', 'Giving school materials to children', 'Lubumbashi', '2026-06-25'),
(1, 'Health Awareness Workshop', 'Teaching disease prevention and hygiene', 'Kasumbalesa', '2026-06-30'),
(2, 'Youth Sports Tournament', 'Organizing football matches for youth', 'Lubumbashi', '2026-07-05'),
(2, 'Blood Donation Event', 'Collecting blood donations for hospitals', 'Kolwezi', '2026-07-08'),
(2, 'Computer Training Program', 'Teaching basic computer skills', 'Likasi', '2026-07-12'),
(2, 'Women Empowerment Seminar', 'Training women in entrepreneurship', 'Lubumbashi', '2026-07-18'),
(2, 'Charity Fundraiser', 'Raising funds for orphanages', 'Kasumbalesa', '2026-07-25'),
(3, 'River Cleanup Project', 'Removing waste from rivers', 'Likasi', '2026-08-02'),
(3, 'Free Medical Checkup', 'Offering free health screenings', 'Lubumbashi', '2026-08-07'),
(3, 'Community Gardening', 'Building community vegetable gardens', 'Kolwezi', '2026-08-10'),
(3, 'Literacy Program', 'Teaching reading and writing skills', 'Kasumbalesa', '2026-08-15'),
(3, 'Clothing Donation Campaign', 'Distributing clothes to families in need', 'Lubumbashi', '2026-08-20');

-- ========================================
-- CATEGORIES TABLE
-- ========================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name)
VALUES
('Community Service'),
('Education'),
('Health'),
('Environment'),
('Youth Development');

-- ========================================
-- PROJECT CATEGORIES TABLE
-- ========================================

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(projectid) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

INSERT INTO project_categories VALUES
(1,1),(2,1),(2,2),(4,2),(5,3),
(6,5),(7,3),(8,2),(9,5),(10,1),
(11,1),(12,3),(13,4),(14,2),(15,1);

-- ========================================
-- ROLES TABLE
-- ========================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- ========================================
-- USERS TABLE
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TEST USER + JOIN DEMO
-- ========================================

INSERT INTO users (name, email, password_hash, role_id)
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

SELECT
    u.user_id,
    u.name,
    u.email,
    r.role_name,
    r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

DELETE FROM users WHERE email = 'test@example.com';

-- ========================================
-- FINAL CHECKS
-- ========================================

SELECT * FROM organization;
SELECT * FROM projects;
SELECT * FROM categories;
SELECT * FROM project_categories;
SELECT * FROM roles;
SELECT * FROM users;