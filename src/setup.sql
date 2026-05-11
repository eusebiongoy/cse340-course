-- ========================================
-- Organization Table
-- ========================================

DROP TABLE IF EXISTS organization;

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
DROP TABLE IF EXISTS Projects;

CREATE TABLE Projects (
    ProjectID SERIAL PRIMARY KEY,
    OrganizationID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Location VARCHAR(255),
    ProjectDate DATE,

    CONSTRAINT fk_organization
        FOREIGN KEY (OrganizationID)
        REFERENCES organization(organization_id)
);

INSERT INTO Projects
(OrganizationID, Title, Description, Location, ProjectDate)
VALUES

-- Organization 1
(1, 'Community Cleanup', 'Cleaning public parks and streets', 'Lubumbashi', '2026-06-10'),
(1, 'Food Donation Drive', 'Providing meals to low-income families', 'Kolwezi', '2026-06-15'),
(1, 'Tree Planting Campaign', 'Planting trees in schools and communities', 'Likasi', '2026-06-20'),
(1, 'School Supply Distribution', 'Giving school materials to children', 'Lubumbashi', '2026-06-25'),
(1, 'Health Awareness Workshop', 'Teaching disease prevention and hygiene', 'Kasumbalesa', '2026-06-30'),

-- Organization 2
(2, 'Youth Sports Tournament', 'Organizing football matches for youth', 'Lubumbashi', '2026-07-05'),
(2, 'Blood Donation Event', 'Collecting blood donations for hospitals', 'Kolwezi', '2026-07-08'),
(2, 'Computer Training Program', 'Teaching basic computer skills', 'Likasi', '2026-07-12'),
(2, 'Women Empowerment Seminar', 'Training women in entrepreneurship', 'Lubumbashi', '2026-07-18'),
(2, 'Charity Fundraiser', 'Raising funds for orphanages', 'Kasumbalesa', '2026-07-25'),

-- Organization 3
(3, 'River Cleanup Project', 'Removing waste from rivers', 'Likasi', '2026-08-02'),
(3, 'Free Medical Checkup', 'Offering free health screenings', 'Lubumbashi', '2026-08-07'),
(3, 'Community Gardening', 'Building community vegetable gardens', 'Kolwezi', '2026-08-10'),
(3, 'Literacy Program', 'Teaching reading and writing skills', 'Kasumbalesa', '2026-08-15'),
(3, 'Clothing Donation Campaign', 'Distributing clothes to families in need', 'Lubumbashi', '2026-08-20');

SELECT * FROM Projects;

-- DROP FIRST (safe reset)
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;

-- =========================
-- CATEGORIES TABLE
-- =========================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Sample categories
INSERT INTO categories (name) VALUES
('Community Service'),
('Education'),
('Health'),
('Environment'),
('Youth Development');

-- =========================
-- PROJECT_CATEGORIES TABLE
-- =========================
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(projectid)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- BrightFuture Builders
INSERT INTO project_categories VALUES (1, 1);
INSERT INTO project_categories VALUES (2, 1);
INSERT INTO project_categories VALUES (2, 2);
INSERT INTO project_categories VALUES (4, 2);
INSERT INTO project_categories VALUES (5, 3);

-- GreenHarvest Growers
INSERT INTO project_categories VALUES (6, 5);
INSERT INTO project_categories VALUES (7, 3);
INSERT INTO project_categories VALUES (8, 2);
INSERT INTO project_categories VALUES (9, 5);
INSERT INTO project_categories VALUES (10, 1);

-- UnityServe Volunteers
INSERT INTO project_categories VALUES (11, 1);
INSERT INTO project_categories VALUES (12, 3);
INSERT INTO project_categories VALUES (13, 4);
INSERT INTO project_categories VALUES (14, 2);
INSERT INTO project_categories VALUES (15, 1);

SELECT * FROM Categories;