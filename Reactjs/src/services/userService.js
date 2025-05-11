import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  console.log("data from service: ", data);
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", { data: { id: userId } });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllCodeService=(inputType)=>{
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctorsService = () => {
  return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorService = (data) => {
  return axios.post('/api/save-info-doctors', data)
}

const getDetailDoctorInfoService = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveScheduleDoctorsService = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
} 

const getSpecialtyByNameService = (nameInput) => { 
  return axios.get(`/api/get-specialty-by-name?name=${nameInput}`) 
}

const getAllSpecialtyService = () => {
  return axios.get(`/api/get-all-specialty`)
}

const getAllClinicService = () => {
  return axios.get(`/api/get-all-clinic`)
}

const getListPatientForDoctorService = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`)
}

const sendRemedyService = (data) => {
    return axios.post('/api/send-remedy', data)
} 

const cancelPatientService = (data) => {
    return axios.post('/api/cancel-patient', data)
} 


export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailDoctorService,
  getDetailDoctorInfoService,
  getSpecialtyByNameService,
  getAllSpecialtyService,
  getAllClinicService,
  saveScheduleDoctorsService,
  cancelPatientService,
  getListPatientForDoctorService,
  sendRemedyService,
};
