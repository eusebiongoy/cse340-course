// Import any needed model functions
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Show all organizations page
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Show organization details page
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', {
        title,
        organizationDetails,
        projects
    });
};

// Add new organization form (ONLY ONE VERSION)
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

// Process new organization form submission
const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    res.redirect(`/organization/${organizationId}`);
};

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};