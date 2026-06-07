import { 
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject,

    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getUserVolunteerProjects
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

// Constant for number of upcoming projects
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Show upcoming projects page
 */
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

/**
 * Show project details page
 */
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    let isVolunteer = false;

    if (req.session.user) {
        isVolunteer = await isUserVolunteer(req.session.user.user_id, projectId);
    }

    const title = 'Service Project Details';

    res.render('project', { 
        title, 
        project,
        categories,
        isVolunteer,

        // ⭐ FIX: THIS IS WHAT MAKES BUTTON APPEAR
        user: req.session.user
    });
};

/**
 * Volunteer for a project
 */
const volunteerForProject = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const projectId = req.params.id;

        await addVolunteer(userId, projectId);

        req.flash('success', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error volunteering:', error);
        req.flash('error', 'Error signing up as volunteer.');
        res.redirect(`/project/${req.params.id}`);
    }
};

/**
 * Remove volunteer from project
 */
const removeVolunteerFromProject = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const projectId = req.params.id;

        await removeVolunteer(userId, projectId);

        req.flash('success', 'You have removed yourself as a volunteer.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Error removing volunteer.');
        res.redirect(`/project/${req.params.id}`);
    }
};

/**
 * Show new project form
 */
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

/**
 * Handle new project form submission
 */
const processNewProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

/**
 * Show edit project form
 */
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Service Project';

    res.render('update-project', {
        title,
        project,
        organizations
    });
};

/**
 * Handle edit project form submission
 */
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

/**
 * Validation rules
 */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Export controller functions
export { 
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    volunteerForProject,
    removeVolunteerFromProject
};