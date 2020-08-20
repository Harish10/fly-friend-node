import addProject from './handlers/addProject';
import editProject from './handlers/editProject';
import removeProject from './handlers/removeProject';
import getProjectDetailById from './handlers/getProjectById';
import getAllProjects from './handlers/getAllProjects';
import addProjectComment from './handlers/addProjectComment';
import editProjectComment from './handlers/editProjectComment';
import removeProjectComment from './handlers/removeProjectComment';
import replyMessageOnComment from './handlers/replyMessageOnComment';
import getProjectComments from './handlers/getProjectComments'

exports.register = (server, options, next) => {
    addProject(server, options);
    editProject(server,options);
    removeProject(server,options);
    getProjectDetailById(server,options);
    getAllProjects(server,options);
    addProjectComment(server,options);
    editProjectComment(server,options);
    removeProjectComment(server,options);
    replyMessageOnComment(server,options);
    getProjectComments(server,options);
    next()
}

exports.register.attributes = {
    name: 'projects'
}