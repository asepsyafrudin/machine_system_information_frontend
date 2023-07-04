const port = "https://172.31.71.10:8080";

//users Api
export const registerUserApi = `${port}/api/users/create_users`;
export const getAllUsersApi = `${port}/api/users/get_users`;
export const getUsersByPageApi = (page) => {
  return `${port}/api/users/getUserByPage/${page}`;
};
export const updateUserApi = `${port}/api/users/update_user`;

export const deleteUserApi = (id) => {
  return `${port}/api/users/delete_user/${id}`;
};

export const searchUserApi = (searchValue, page) => {
  return `${port}/api/users/findUser/${searchValue}/${page}`;
};

export const getUserByUserIdApi = (userId) => {
  return `${port}/api/users/getUserByUserId/${userId}`;
};

export const getUserByNPKApi = (npk) => {
  return `${port}/api/users/getUserByNPK/${npk}`;
};

export const getUserByEmailApi = (email) => {
  return `${port}/api/users/getUserByEmail/${email}`;
};

export const changePasswordUserApi = `${port}/api/users/changePassword`;

export const checkUserPassword = `${port}/api/users/comparePassword`;
export const loginApi = `${port}/login`;

export const resetPhotoProfileApi = (id) => {
  return `${port}/api/users/resetPhoto/${id}`;
};

//product Api

export const registerProductApi = `${port}/api/product/create`;
export const getAllProductApi = `${port}/api/product/getAll`;
export const updateProductNameApi = `${port}/api/product/updateProductName`;
export const updateProductStatusApi = `${port}/api/product/updateStatus`;

export const deleteProductApi = (id) => {
  return `${port}/api/product/delete/${id}`;
};

export const searchProductApi = (searchValue) => {
  return `${port}/api/product/${searchValue}`;
};

export const getProductByProductId = (id) => {
  return `${port}/api/product/getProductById/${id}`;
};

//line
export const registerLineApi = `${port}/api/line/create`;
export const getAllLineApi = `${port}/api/line/getAllLine`;
export const updateLineApi = `${port}/api/line/updateLine`;
export const updateStatusLineApi = `${port}/api/line/updateStatusLine`;

export const deleteLineApi = (id) => {
  return `${port}/api/line/delete/${id}`;
};
export const searchLineApi = (searchValue) => {
  return `${port}/api/line/${searchValue}`;
};

//machine
export const registerMachineApi = `${port}/api/machine/create`;
export const getAllMachineApi = `${port}/api/machine/getAll`;
export const updateStatusMachineApi = `${port}/api/machine/updateStatusMachine`;
export const updateMachineApi = `${port}/api/machine/updateMachine`;
export const deleteMachineApi = (id) => {
  return `${port}/api/machine/delete/${id}`;
};
export const searchMachineApi = (searchValue) => {
  return `${port}/api/machine/search/${searchValue}`;
};

//video
export const registerVideoApi = `${port}/api/video/create`;
export const getAllVideoApi = `${port}/api/video/getAllVideo`;
export const updateVideoApi = `${port}/api/video/updateVideo`;
export const updateStatusVideoApi = `${port}/api/video/updateStatusVideo`;
export const deleteVideoApi = (id) => {
  return `${port}/api/video/delete/${id}`;
};
export const searchVideoApi = (searchValue, page) => {
  return `${port}/api/video/search/${searchValue}/${page}`;
};
export const getVideoByIdApi = (id) => {
  return `${port}/api/video/getVideo/${id}`;
};
export const getVideoByPageApi = (page) => {
  return `${port}/api/video/getVideoByPage/${page}`;
};
export const getVideoByUserIdApi = (userId, page) => {
  return `${port}/api/video/getVideoByUserId/${userId}/${page}`;
};

export const getVideoByPageAdminApi = (page) => {
  return `${port}/api/video/getVideoByPageAdmin/${page}`;
};

export const searchVideoForDashboardMenuApi = (searchValue, page, userId) => {
  return `${port}/api/video/searchVideoDashboard/${searchValue}/${page}/${userId}`;
};

//comment
export const postCommentApi = `${port}/api/comment/create`;
export const getCommentByVideoIdApi = (id, page) => {
  return `${port}/api/comment/get/${id}/${page}`;
};

export const deleteCommentApi = (id) => {
  return `${port}/api/comment/delete/${id}`;
};

//feedback
export const getFeedbackByIdApi = (id) => {
  return `${port}/api/feedback/getFeedbackById/${id}`;
};

//document Api
export const registerDocumentApi = `${port}/api/document/create`;
export const updateDocumentApi = `${port}/api/document/update`;
export const getAllDocumentByPage = (page) => {
  return `${port}/api/document/getDocumentByPage/${page}`;
};

export const getDocumentByUserIdAndPageApi = (userId, page) => {
  return `${port}/api/document/getDocumentByUserIdAndPage/${userId}/${page}`;
};

export const searchDocumentForDashboardApi = (searchValue, page, userId) => {
  return `${port}/api/document/searchDashboard/${searchValue}/${page}/${userId}`;
};

export const searchDocumentApiByPage = (searchValue, page) => {
  return `${port}/api/document/search/${searchValue}/${page}`;
};

export const deleteDocumentApi = (id) => {
  return `${port}/api/document/delete/${id}`;
};

export const changeStatusDocumentApi = `${port}/api/document/changeStatus`;

export const getDocumentByIdApi = (id) => {
  return `${port}/api/document/getDocumentById/${id}`;
};

export const getDocumentGeneralBypageApi = (page) => {
  return `${port}/api/document/getDocumentForGeneralByPage/${page}`;
};

//file
export const deleteFileByIdApi = (id) => {
  return `${port}/api/file/delete/${id}`;
};
export const getFileByIdApi = (id) => {
  return `${port}/api/file/getFileByDocumentId/${id}`;
};

//recentdata
export const getAllRecentDataApi = (page) => {
  return `${port}/api/allItem/getAll/${page}`;
};

//comment feedback
export const postFeedbackComment = `${port}/api/feedback/create`;
export const deleteFeedbackComment = (id) => {
  return `${port}/api/feedback/delete/${id}`;
};

//get Notif
export const getNotificationByUserId = (userId) => {
  return `${port}/api/notification/getNotification/${userId}`;
};

export const changeStatusNotification = (id) => {
  return `${port}/api/notification/change/${id}`;
};

//openai

export const openaiApi = `${port}/api/openai/post`;

//api requst
export const createRequestApi = `${port}/api/request/create`;
export const getRequestApi = (token) => {
  return `${port}/api/request/get/${token}`;
};
export const deleteRequestApi = (token) => {
  return `${port}/api/request/delete/${token}`;
};

//capability
export const createCapabilityApi = `${port}/api/capability/create`;
export const updateCapabilityApi = `${port}/api/capability/update`;
export const deleteCapabilityApi = (id) => {
  return `${port}/api/capability/delete/${id}`;
};
export const getAllCapabilityApi = (page) => {
  return `${port}/api/capability/getAllCapability/${page}`;
};

export const getCapabilityByUserIdApi = (page, userId) => {
  return `${port}/api/capability/getCapabilityByUserId/${userId}/${page}`;
};

export const getCapabilityByIdApi = (id) => {
  return `${port}/api/capability/getCapabilityById/${id}`;
};

export const searchCapabilityApi = (searchValue, page) => {
  return `${port}/api/capability/search/${searchValue}/${page}`;
};

//problem
export const createProblemApi = `${port}/api/problem/create`;
export const createFtaLv1Api = `${port}/api/ftaLv1/create`;
export const createFtaLv2Api = `${port}/api/ftaLv2/create`;
export const getAllProblemApi = (page) => {
  return `${port}/api/problem/getAllProblem/${page}`;
};

export const getProblemByIdApi = (id) => {
  return `${port}/api/problem/getProblemById/${id}`;
};

export const deleteProblemByIdApi = (id) => {
  return `${port}/api/problem/deleteProblem/${id}`;
};

export const getProblemByMachineIdApi = (machineId) => {
  return `${port}/api/problem/getProblemByMachineId/${machineId}`;
};

export const searchProblemByMachineIdApi = (machineId, page) => {
  return `${port}/api/problem/searchProblemByMachineId/${machineId}/${page}`;
};

//project
export const createProjectApi = `${port}/api/project/create`;
export const updateProjectApi = `${port}/api/project/update`;
export const getAllProjectByPageApi = (page) => {
  return `${port}/api/project/getAllProjectByPage/${page}`;
};

export const getAllProjectApi = `${port}/api/project/getAllProject`;

export const updateStatusProjectApi = `${port}/api/project/updateStatus`;
export const getProjectByIdApi = (id) => {
  return `${port}/api/project/getProjectById/${id}`;
};
export const deleteProjectByProjectId = (id) => {
  return `${port}/api/project/delete/${id}`;
};

export const getProjectByPageAndUser = (page, user) => {
  return `${port}/api/project/getProjectByPageAndUser/${page}/${user}`;
};

export const searchProjectApi = `${port}/api/project/search`;

//activity api
export const createActivityApi = `${port}/api/activity/create`;
export const updateActivityApi = `${port}/api/activity/update`;
export const getActivityByProjectIdApi = (projectId) => {
  return `${port}/api/activity/getActivityByProjectId/${projectId}`;
};

//todo

export const createAndUpdateTodoApi = `${port}/api/todo/create`;
export const getTodoByProjectIdApi = (id) => {
  return `${port}/api/todo/getTodoByProjectId/${id}`;
};
