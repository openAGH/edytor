const OpenAghApiController = require('./OpenAghApiController.js');
const RateLimiterMiddleware = require('../Security/RateLimiterMiddleware');

module.exports = {
	apply(apiRouter) {
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
		'/openaghhelper/admin/project/delete/all',
		OpenAghApiController.deleteAllAdminProjects
	  ),
	  apiRouter.get(
		'/openaghhelper/login',
		OpenAghApiController.login
	  ),
	  apiRouter.get(
		'/openaghhelper/register-user',
		OpenAghApiController.registerUser
	  ),
	  apiRouter.get(
		'/openaghhelper/change-password',
		OpenAghApiController._setNewPassword
	  ),
	  apiRouter.get(
		'/openaghhelper/create-user',
		OpenAghApiController.createUser
	  ),
	  apiRouter.get(
		'/openaghhelper/add-user-to-project',
		OpenAghApiController.addUser2Project
	  ),
	  apiRouter.get(
		'/openaghhelper/create-project',
		OpenAghApiController.createProject
	  ),
	  apiRouter.get(
		'/openaghhelper/get-project',
		OpenAghApiController.getProject
	  )
	}
}