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