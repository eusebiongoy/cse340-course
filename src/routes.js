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

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// ================================
// ORGANIZATIONS
// ================================
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', showNewOrganizationForm);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

// ================================
// PROJECTS
// ================================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', showEditProjectForm);

router.post(
    '/edit-project/:id',
    projectValidation,
    processEditProjectForm
);

// ================================
// CATEGORIES
// ================================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// CREATE CATEGORY
router.get('/new-category', showCreateCategoryForm);

router.post('/new-category', processCreateCategory);

// EDIT CATEGORY
router.get('/edit-category/:id', showEditCategoryForm);

router.post('/edit-category/:id', processEditCategory);

// ASSIGN CATEGORIES
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// ================================
// ERROR TEST
// ================================
router.get('/test-error', testErrorPage);

export default router;