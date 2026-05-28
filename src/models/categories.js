import db from './db.js';

// Get all categories
export async function getAllCategories() {
    const result = await db.query(`
        SELECT * 
        FROM categories
        ORDER BY name
    `);

    return result.rows;
}


// Get a single category by ID
export async function getCategoryById(id) {
    const result = await db.query(`
        SELECT *
        FROM categories
        WHERE category_id = $1
    `, [id]);

    return result.rows[0];
}


// Get all service projects for a given category
export async function getServiceProjectsByCategoryId(categoryId) {
    const result = await db.query(`
        SELECT sp.*
        FROM projects sp
        JOIN project_categories pc
            ON sp.projectid = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.title
    `, [categoryId]);

    return result.rows;
}


// Create a new category
export async function createCategory(name) {
    const result = await db.query(`
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING *;
    `, [name]);

    return result.rows[0];
}


// Update existing category
export async function updateCategory(id, name) {
    const result = await db.query(`
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING *;
    `, [name, id]);

    return result.rows[0];
}


// INTERNAL helper (not exported)
async function assignCategoryToProject(projectId, categoryId) {
    const result = await db.query(`
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2);
    `, [projectId, categoryId]);

    return result;
}


export async function updateCategoryAssignments(projectId, categoryIds) {
    await db.query(`
        DELETE FROM project_categories
        WHERE project_id = $1;
    `, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}