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


// Export model functions (NO DUPLICATES)
export { 
    getAllProjects, 
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategory,
    getCategoriesByProjectId
};