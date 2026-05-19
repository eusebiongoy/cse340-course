// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getServiceProjectsByCategoryId 
} from '../models/categories.js';

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

// Export controller functions
export { 
    showCategoriesPage,
    showCategoryDetailsPage
};