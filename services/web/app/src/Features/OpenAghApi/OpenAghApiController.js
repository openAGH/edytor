const http = require('http');
const async = require('async');
const fs = require('fs');
const Path = require('path')
const UserCreator = require('../User/UserCreator');
const UserGetter = require('../User/UserGetter');
const UserUpdater = require('../User/UserUpdater');
const UserRegistrationHandler = require('../User/UserRegistrationHandler');
const AuthenticationManager = require('../Authentication/AuthenticationManager');
const CollaboratorsHandler = require('../Collaborators/CollaboratorsHandler');
const ProjectCreationHandler = require('../Project/ProjectCreationHandler');
const ProjectGetter = require('../Project/ProjectGetter');
const ProjectEntityHandler = require('../Project/ProjectEntityHandler');
const ProjectZipStreamManager = require('../Downloads/ProjectZipStreamManager');
const ProjectLocator = require('../Project/ProjectLocator');
const DocumentUpdaterHandler = require('../DocumentUpdater/DocumentUpdaterHandler');
const FileStoreHandler = require('../FileStore/FileStoreHandler');
const ProjectUploadManager = require('../Uploads/ProjectUploadManager');
const ProjectDeleter = require('../Project/ProjectDeleter');

const OpenAghApiController = {
	login(req, res) {
		let dataResponse = '', getRecived = false;

		// fetch('http://localhost/login')
		// 	.then(response => console.log(response));
		// http.request('http://localhost/login', (resG) => {
		// 	console.log({
		// 		resG
		// 	});
		// 	resG.on('data', (chunk) => {
		// 		console.log("BODY: " + chunk);
		// 		dataResponse = chunk;
		// 		getRecived = true;
		// 		res.send(dataResponse);
		// 	});
		// });

		// if (getRecived) {
		// 	return res.send(dataResponse);
		// }
	},

	registerUser(req, res) {
        UserRegistrationHandler.registerNewUserAndSendActivationEmail(
                'test@agh.edu.pl',
                (err, user, setNewPasswordUrl) => {
                    console.log({err, user, setNewPasswordUrl});
                    return false;
                }
            );
		// let dataResponse = '', getRecived = false;

		// fetch('http://localhost/login')
		// 	.then(response => console.log(response));
		// http.request('http://localhost/login', (resG) => {
		// 	console.log({
		// 		resG
		// 	});
		// 	resG.on('data', (chunk) => {
		// 		console.log("BODY: " + chunk);
		// 		dataResponse = chunk;
		// 		getRecived = true;
		// 		res.send(dataResponse);
		// 	});
		// });

		// if (getRecived) {
		// 	return res.send(dataResponse);
		// }
        res.send("createUser");
	},

	_setNewPassword(req, res) {
		const newPassword = 'test_xd';
		UserGetter.getUserByAnyEmail(
			'sebek1113@gmail.com',
			(err, user) => {
				if (err != null) {
					res.send("Error getting user.");
					return false;
				}

				AuthenticationManager.setUserPassword(
					user,
					newPassword,
					(err, updatedUser) => {
						if (null != err) {
							console.log(err);
							res.status(503).send("Error occured while attempting to confirm new user email.");
						}
			
						if (null === updatedUser || undefined === updatedUser) {
							res.status(403).send("Cannot set password for new user.");
						}

						res.send("password successfully changed!");
					}
				);
			}
		)
	},

    createUser(req, res) {
		const newUserAttr = {
			email: 'testowy-email2@agh.edu.pl',
			first_name: 'testowyyy',
			last_name: 'testowy',
		};
		const newUserPass = 'test123';
		UserCreator.createNewUser(newUserAttr, (err, newUser) => {
			if (null != err) {
				console.log(err);
				res.status(503).send("Error occured while creating new user");
				return false;
			}

			if (null == newUser) {
				res.status(403).send("Cannot create new user with this attributes.");
				return false;
			}

			UserUpdater.confirmEmail(
				newUser._id, 
				newUser.email, 
				(err, userProbably) => {
					if (null != err) {
						console.log(err);
						res.status(503).send("Error occured while attempting to confirm new user email.");
					}
		
					if (null != userProbably) {
						res.status(403).send("Cannot confirm new user.");
					}

					AuthenticationManager.setUserPassword(
						newUser,
						newUserPass,
						(err, userPro) => {
							if (null != err) {
								console.log(err);
								res.status(503).send("Error occured while attempting to confirm new user email.");
							}
				
							if (null != userProbably) {
								res.status(403).send("Cannot set password for new user.");
							}

							res.send("user successfully created!");
						}
					);
				}
			);
		});
        // UserRegistrationHandler.registerNewUserAndSendActivationEmail(
        //         'test@agh.edu.pl',
        //         (err, user, setNewPasswordUrl) => {
        //             console.log({err, user, setNewPasswordUrl});
        //             return false;
        //         }
        //     );
		// let dataResponse = '', getRecived = false;

		// fetch('http://localhost/login')
		// 	.then(response => console.log(response));
		// http.request('http://localhost/login', (resG) => {
		// 	console.log({
		// 		resG
		// 	});
		// 	resG.on('data', (chunk) => {
		// 		console.log("BODY: " + chunk);
		// 		dataResponse = chunk;
		// 		getRecived = true;
		// 		res.send(dataResponse);
		// 	});
		// });

		// if (getRecived) {
		// 	return res.send(dataResponse);
		// }
        // res.send("NOT IMPLEMENTED!");
	},

	addUser2Project(req, res) {
		UserGetter.getUserByAnyEmail(
			'sebac@agh.edu.pl',
			(err, sendingUser) => {
				if (err != null) {
					res.send("Error getting user.");
					return false;
				}
				console.log({sendingUser});
				UserGetter.getUserByAnyEmail(
					'seba_test@agh.edu.pl',
					(err, invitedUser) => {
						if (err != null) {
							res.send("Error getting invitedUser.");
							return false;
						}
						CollaboratorsHandler.addUserIdToProject(
							'621deeb8139d870090e3b243',
							sendingUser._id,
							invitedUser._id,
							'readAndWrite',
							(err) => {
								if (err != null) {
									res.send("Error inviting user.");
									return false;
								}
								res.send("userInvited");
								return true;
							}
						);
					}
				);
			}
		);
	},

	createProject(req, res) {
		UserGetter.getUserByAnyEmail(
			'sebac@agh.edu.pl',
			(err, owner) => {
				const projectName = "This module has been created by helper.";
				if (err != null) {
					res.status(503).send("Error getting user.");
					return false;
				}

				if (!owner) {
					res.status(404).send("Uset not found.");
					return false;
				}

				ProjectCreationHandler.createBasicProject(
					owner._id, 
					projectName, 
					(err, project) => {
						if (err != null) {
							console.log(err);
							res.status(503).send("Error occured while creating a project.");
						}
						res.send({
							project_id: project._id,
							owner_ref: project.owner_ref,
							owner: {
								first_name: owner.first_name,
								last_name: owner.last_name,
								email: owner.email,
								_id: owner._id,
							},
						})
					}
				);
			}
		);
	},

	getProjectJson(req, res) {
		const projectId = "61af0fbbeddbbe008f0864f0";
		ProjectGetter.getProject(
			projectId,
			(err,  project) => {
				if (err != null) {
					console.log(err);
					return res.send("Error occured during getting project from database.");
				}
				ProjectEntityHandler.getAllEntitiesFromProject(
					project,
					(err, docs, files) => {
						if (err != null) {
							console.log(err);
							return res.send("Error occured during creating project json.");
						}
						const entities = docs
							.concat(files)
							// Sort by path ascending
							.sort((a, b) => (a.path > b.path ? 1 : a.path < b.path ? -1 : 0))
							.map(e => ({
								path: e.path,
								type: e.doc != null ? 'doc' : 'file',
							}));
						res.json({ project_id: projectId, entities });
					}
				);
			}
		);
	},

	getProject(req, res) {
		// const projectId = "62260670cb369e008f21b400";
		const projectId = "61af0fbbeddbbe008f0864f0";
		const format = 'zip';

		ProjectEntityHandler.getAllDocs(projectId, (err, docs) => {
			console.log("### DOCS ###");
			console.log(docs);
			Object.entries(docs).map(([path, doc]) => {
				console.log(`doc: ${doc}`);
				console.log(doc);
				console.log(doc._id);
				console.log(`path: ${path}`);
				// `http://localhost:3013`,
				console.log(`http://localhost:3013/project/${projectId}/output/${doc._id}`);
				http.get(`http://localhost:3013/project/${projectId}/output/${doc._id}`, (res) => {
					console.log(`statusCode: ${res.statusCode}`);
					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });
					res.on('end', () => {
						try {
							const parsedData = JSON.parse(rawData);
							console.log(parsedData);
						} catch (e) {
							console.error(e.message);
						}
					});
				});
				// ProjectLocator.findElement(
				// 	{ project_id: projectId, element_id: doc._id, type: 'doc' },
				// 	(err, file, path, searchFolder) => {
				// 		console.log("found file:");
				// 		console.log(file);
				// 		console.log('path:');
				// 		console.log(path);
				// 		console.log('searchFolder:'); 
				// 		console.log(searchFolder);
				// 	}
				// );
				// FileStoreHandler.getFileStream(
				// 	projectId, 
				// 	doc._id, 
				// 	null, 
				// 	(err, readStream) => {
				// 		console.log("readStream START");
				// 		console.log(readStream);
				// 		http.request(readStream.uri.href, (res) => {
				// 			console.log("RES");
				// 			console.log(res);
				// 			console.log("BODY");
				// 			console.log("readStream END");
				// 		});
				// 	}
				// );
			});
		});
		ProjectEntityHandler.getAllFiles(projectId, (err, files) => {
			console.log("### FILES ###");
			// console.log(files);
			Object.entries(files).map(([path, file]) => {
				// console.log(file);
				// console.log(`file: ${file}`);
				// console.log(file._id);
				// console.log(`path: ${path}`);
			});
		});

		return DocumentUpdaterHandler.flushProjectToMongo(
			projectId,
			function (err) {
				if (err != null) {
					console.log(err);
					return res.send("Error occured during flushing project to database.");
				}
				return ProjectGetter.getProject(
					projectId,
					{ name: true },
					function (err, project) {
						if (err != null) {
							console.log(err);
							return res.send("Error occured during getting project from database.");
						}
						return ProjectZipStreamManager.createZipStreamForProject(
							projectId,
							function (err, stream) {
								if (err != null) {
									console.log(err);
									return res.send("Error occured during creating zip stream.");
								}
								res.set({
									'Content-Type': 'application/zip',
									'Content-Disposition': `attachment; filename="${project.name}.zip"`,
								})
								// res.setContentDisposition('attachment', {
								// 	filename: `${project.name}.zip`,
								// })
								// res.contentType('application/zip')
								// console.log("stream:");
								// console.log(stream);
								return stream.pipe(res);
							}
						)
					}
			  )
			}
		);
	},

	uploadProject(req, res) {
		// const projectId = "62260670cb369e008f21b400";
		user_id = "61af0f73eddbbe008f0864c8";
		name = "test_2";
		path = "/var/tmp/test.zip";

		ProjectUploadManager.createProjectFromZipArchive(
			user_id, 
			name, 
			path, 
			(err, project) => {
				if(err != null)
					return res.status(503).json({
						error: true,
						message: error.message
					});
				return res.send({ error: false, project_id: project._id })
			}
		)
	},

	async uploadAllProjects(req, res) {
		// const projectId = "62260670cb369e008f21b400";
		user_id = "61af0f73eddbbe008f0864c8";
		const import_path = "/var/tmp/import_files/";
		let delete_results = [];

		try {
			const projects_archs = fs.readdirSync(import_path);
			for (const project_arch of projects_archs) {
				const project_name = Path.basename(project_arch, '.zip');
				try {
					const user_projects = await ProjectGetter.promises.findUsersProjectsByName(user_id, project_name);
					const precise_match = user_projects.find(project => project.name === project_name);
					if(precise_match) {
						delete_result = await ProjectDeleter.promises.deleteProject(precise_match._id);
						delete_results.push({id:precise_match._id, name:project_name});
					}
				} catch (err) {
					return res.status(503).json({
						success:false,
						error_obj: err,
						message: err.message,
						occuered: "During getting project by name"
					});
				}
				try {
					project = await ProjectUploadManager.promises.createProjectFromZipArchiveWithName(
							user_id, 
							Path.basename(project_arch, '.zip'), 
							Path.join(import_path, project_arch)
						);
				} catch(err) {
					return res.status(503).json({
						error: true, 
						error_obj: err,
						message: err.message, 
						occuered: "During creating project from archive",
						archive_name: project_arch,
						archives: projects_archs,
					});
				}
			}
			return res.send({success:true, archives: projects_archs, delete_results: delete_results});
		} catch(err) {
			return res.status(503).json({
				error: true, 
				message: err.message, 
				occuered: "During opening path with all projects zip."
			});
		}
	},

	async deleteAllAdminProjects(req, res) {
		// const projectId = "62260670cb369e008f21b400";
		admin_id = "61af0f73eddbbe008f0864c8";
		try {
			const results = await ProjectDeleter.promises.deleteUsersProjects(admin_id);
			return res.send({success:true, deleter_results: results});
		} catch(err) {
			return res.status(503).json({
				error: true, 
				message: err.message, 
				occuered: "During deleting all admin projects."
			});
		}
	}
}

module.exports = OpenAghApiController;