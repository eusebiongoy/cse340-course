// Import any needed model functions
import { 
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Constant for number of upcoming projects
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define controller functions

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const title = 'Service Project Details';

    res.render('project', { title, project });
};

// Export any controller functions
export { 
    showProjectsPage,
    showProjectDetailsPage
};