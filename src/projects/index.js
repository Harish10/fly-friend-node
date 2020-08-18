import addProject from './handlers/addProject';
import editProject from './handlers/editProject';
import removeProject from './handlers/removeProject';
import getProjectDetailById from './handlers/getProjectById';
import getAllProjects from './handlers/getAllProjects';

exports.register = (server, options, next) => {
    addProject(server, options);
    editProject(server,options);
    removeProject(server,options);
    getProjectDetailById(server,options);
    getAllProjects(server,options);
    next()
}

exports.register.attributes = {
    name: 'projects'
}