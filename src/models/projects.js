import db from './db.js';

export async function getAllProjects() {
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
        ORDER BY p.projectid;
    `);

    return result.rows;
}