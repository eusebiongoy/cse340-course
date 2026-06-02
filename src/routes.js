import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategoryForm,
    processCreateCategory,
    showEditCategoryForm,
    processEditCategory
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// ================================
// ORGANIZATIONS
// ================================
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// ================================
// PROJECTS
// ================================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireRole('admin'), showNewProjectForm);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

// ================================
// CATEGORIES
// ================================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// CREATE CATEGORY
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);

router.post(
    '/new-category',
    requireRole('admin'),
    processCreateCategory
);

// EDIT CATEGORY
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    processEditCategory
);

// ASSIGN CATEGORIES
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

// ================================
// USER AUTH ROUTES
// ================================
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// Login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// ================================
// 👇 NEW USERS PAGE (ADMIN ONLY)
// ================================
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

// ================================
// ERROR TEST
// ================================
router.get('/test-error', testErrorPage);

export default router;