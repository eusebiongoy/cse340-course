import db from './db.js';

/**
 * Get all projects with organization + categories
 */
export async function getAllProjects() {
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
export async function getProjectsByCategory(categoryId) {
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