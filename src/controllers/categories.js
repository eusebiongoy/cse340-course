// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getServiceProjectsByCategoryId,
    updateCategoryAssignments
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';


// Get all categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

// NEW: Category details page
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getServiceProjectsByCategoryId(categoryId);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    const title = category.name;

    res.render('category', {
        title,
        category,
        projects
    });
};


// ================================
// ADDED: ASSIGN CATEGORIES FEATURE
// ================================

// Show assign categories form
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getServiceProjectsByCategoryId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};


// Process assign categories form
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    let selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};


// Export controller functions
export { 
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};