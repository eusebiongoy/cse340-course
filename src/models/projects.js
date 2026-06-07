import db from './db.js';

/**
 * Get all projects with organization + categories
 */
async function getAllProjects() {
    const result = await db.query(`
        SELECT 
            p.projectid,
            p.title,
            p.description,
            p.location,
            p.projectdate,
            o.name AS organization_name,
            STRING_AGG(c.name, ', ') AS categories
        FROM projects p
        JOIN organization o
            ON p.organizationid = o.organization_id
        LEFT JOIN project_categories pc
            ON p.projectid = pc.project_id
        LEFT JOIN categories c
            ON pc.category_id = c.category_id
        GROUP BY 
            p.projectid,
            o.name
        ORDER BY p.projectid;
    `);

    return result.rows;
}

/**
 * Get projects filtered by category
 */
async function getProjectsByCategory(categoryId) {
    const result = await db.query(`
        SELECT 
            p.projectid,
            p.title,
            p.description,
            p.location,
            p.projectdate,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organizationid = o.organization_id
        JOIN project_categories pc
            ON p.projectid = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.projectdate;
    `, [categoryId]);

    return result.rows;
}

/**
 * Get projects by organization
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            projectid,
            organizationid,
            title,
            description,
            location,
            projectdate
        FROM projects
        WHERE organizationid = $1
        ORDER BY projectdate;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};

/**
 * Get upcoming service projects (limited)
 */
async function getUpcomingProjects(number_of_projects) {
    const query = `
        SELECT 
            p.projectid AS project_id,
            p.title,
            p.description,
            p.location,
            p.projectdate AS date,
            p.organizationid AS organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organizationid = o.organization_id
        WHERE p.projectdate >= CURRENT_DATE
        ORDER BY p.projectdate ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

/**
 * Get single project by ID
 */
async function getProjectDetails(id) {
    const query = `
        SELECT 
            p.projectid AS project_id,
            p.title,
            p.description,
            p.location,
            p.projectdate AS date,
            p.organizationid AS organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organizationid = o.organization_id
        WHERE p.projectid = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Get categories for a specific project
 */
async function getCategoriesByProjectId(projectId) {
    const result = await db.query(`
        SELECT c.category_id, c.name
        FROM categories c
        JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `, [projectId]);

    return result.rows;
};

/**
 * Create a new project
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO projects (title, description, location, projectdate, organizationid)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING projectid;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].projectid);
    }

    return result.rows[0].projectid;
};

/**
 * Update an existing project
 */
const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE projects
        SET
            title = $1,
            description = $2,
            location = $3,
            projectdate = $4,
            organizationid = $5
        WHERE projectid = $6
        RETURNING projectid;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].projectid);
    }

    return result.rows[0].projectid;
};



// =====================================================
//  ADDED: VOLUNTEER FUNCTIONS (NEW FEATURE)
// =====================================================

/**
 * Add volunteer to a project
 */
async function addVolunteer(userId, projectId) {
    const query = `
        INSERT INTO user_projects (user_id, projectid)
        VALUES ($1, $2)
        ON CONFLICT (user_id, projectid) DO NOTHING;
    `;

    await db.query(query, [userId, projectId]);
}

/**
 * Remove volunteer from a project
 */
async function removeVolunteer(userId, projectId) {
    const query = `
        DELETE FROM user_projects
        WHERE user_id = $1 AND projectid = $2;
    `;

    await db.query(query, [userId, projectId]);
}

/**
 * Check if user is volunteering for a project
 */
async function isUserVolunteer(userId, projectId) {
    const query = `
        SELECT 1
        FROM user_projects
        WHERE user_id = $1 AND projectid = $2;
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0;
}

/**
 * Get all projects a user is volunteering for
 */
async function getUserVolunteerProjects(userId) {
    const query = `
        SELECT p.*
        FROM projects p
        JOIN user_projects up
            ON p.projectid = up.projectid
        WHERE up.user_id = $1
        ORDER BY p.projectdate;
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};



// Export model functions
export { 
    getAllProjects, 
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategory,
    getCategoriesByProjectId,
    createProject,
    updateProject,

    //  ADDED EXPORTS
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getUserVolunteerProjects
};