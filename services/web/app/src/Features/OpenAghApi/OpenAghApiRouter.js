const OpenAghApiController = require('./OpenAghApiController.js');
const RateLimiterMiddleware = require('../Security/RateLimiterMiddleware');

module.exports = {
	apply(apiRouter) {
	  apiRouter.get(
		'/openaghhelper/user/login',
		OpenAghApiController.login
	  ),
	  apiRouter.get(
		'/openaghhelper/user/register-user',
		OpenAghApiController.registerUser
	  ),
	  apiRouter.get(
		'/openaghhelper/user/change-password',
		OpenAghApiController._setNewPassword
	  ),
	  apiRouter.get(
		'/openaghhelper/user/create-user',
		OpenAghApiController.createUser
	  ),
	  apiRouter.get(
		'/openaghhelper/user/add-user-to-project',
		OpenAghApiController.addUser2Project
	  ),
	  apiRouter.get(
		'/openaghhelper/project/create',
		OpenAghApiController.createProject
	  ),
	  apiRouter.get(
		'/openaghhelper/project',
		OpenAghApiController.getProject
	  ),
	  apiRouter.get(
		'/openaghhelper/project/new/upload',
		RateLimiterMiddleware.rateLimit({
		  endpointName: 'project-upload',
		  maxRequests: 20,
		  timeInterval: 60,
		}),
		OpenAghApiController.uploadProject
	  ),
	  apiRouter.get(
		'/openaghhelper/project/new/upload/all',
		RateLimiterMiddleware.rateLimit({
		  endpointName: 'project-upload',
		  maxRequests: 20,
		  timeInterval: 60,
		}),
		OpenAghApiController.uploadAllProjects
	  ),
	  apiRouter.get(
		'/openaghhelper/project/delete/all',
		OpenAghApiController._deleteAllAdminProjects
	  )
	}
}