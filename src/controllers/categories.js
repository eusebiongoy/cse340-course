import { 
    getAllCategories, 
    getCategoryById, 
    getServiceProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';


// Get all categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};


// Category details page
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
// CREATE CATEGORY
// ================================

// Show create category form
const showCreateCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create Category'
    });
};


// Process create category form
const processCreateCategory = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim().length < 3 || name.trim().length > 100) {
        return res.status(400).render('new-category', {
            title: 'Create Category',
            error: 'Category name must be between 3 and 100 characters'
        });
    }

    await createCategory(name.trim());
    res.redirect('/categories');
};


// ================================
// EDIT CATEGORY
// ================================

// Show edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};


// Process edit category form
const processEditCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim().length < 3 || name.trim().length > 100) {
        return res.status(400).render('edit-category', {
            title: 'Edit Category',
            category: { category_id: categoryId, name },
            error: 'Category name must be between 3 and 100 characters'
        });
    }

    await updateCategory(categoryId, name.trim());
    res.redirect('/categories');
};


// ================================
// ASSIGN CATEGORIES (
// ================================

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();

    const assignedCategories = await getServiceProjectsByCategoryId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};


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
    showCreateCategoryForm,
    processCreateCategory,
    showEditCategoryForm,
    processEditCategory,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};