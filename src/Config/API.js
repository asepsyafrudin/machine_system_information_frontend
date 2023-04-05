const port = "http://172.31.73.34:8080";

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

//file
export const deleteFileByIdApi = (id) => {
  return `${port}/api/file/delete/${id}`;
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
