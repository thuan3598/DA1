import axios from "../axios";

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', {email, password})
}

const getAllUsers = (inputId) => {
    //template string
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data from service: ', data)
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    // return axios.delete('/api/delete-user', {id: userId})
    return axios.delete('/api/delete-user', {data: {id: userId}})
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}

const getAllCodeService = (inputType) => {
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

const getScheduleDoctorByDateService = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInfoDoctorByIdService = (inputId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${inputId}`)
}

const getProfileDoctorByIdService = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookingService = (data) => {
    return axios.post('/api/patient-book-appointment', data)
} 

const postVerifyBookingService = (data) => {
    return axios.post('/api/verify-book-appointment', data)
} 

const createNewSpecialtyService = (data) => {
    return axios.post('/api/create-new-specialty', data)
} 

const getAllSpecialtyService = () => {
    return axios.get(`/api/get-all-specialty`)
}

const getDetailSpecialtyByIdService = (data) => { 
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinicService = (data) => {
    return axios.post('/api/create-new-clinic', data)
} 

const getAllClinicService = () => {
    return axios.get(`/api/get-all-clinic`)
}

const getDetailClinicByIdService = (data) => { 
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const getListPatientForDoctorService = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`)
}

const sendRemedyService = (data) => {
    return axios.post('/api/send-remedy', data)
} 

const createNewHandBookService = (data) => {
    return axios.post('/api/create-new-handbook', data)
} 

const getAllHandbookService = () => {
    return axios.get(`/api/get-all-handbook`)
}

const getDetailHandbookByIdService = (data) => { 
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}

const getSpecialtyByNameService = (nameInput) => { 
    return axios.get(`/api/get-specialty-by-name?name=${nameInput}`) 
}

const cancelPatientService = (data) => {
    return axios.post('/api/cancel-patient', data)
} 

const getAppointmentsForPatientService = (patientId) => {
    return axios.get(`/api/get-appointments-for-patient?patientId=${patientId}`)
}

const cancelBookingByIdService = (data) => {
    console.log('cancelBookingByIdService data: ', data);
    return axios.post('/api/cancel-booking', data);
};

export {
    handleLoginApi, createNewHandBookService, getAllHandbookService, cancelPatientService,
    getAllUsers, getDetailHandbookByIdService,
    createNewUserService, getSpecialtyByNameService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorService,
    getDetailDoctorInfoService,
    saveScheduleDoctorsService,
    getScheduleDoctorByDateService,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
    postPatientBookingService,
    postVerifyBookingService,
    createNewSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyByIdService,
    createNewClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
    getListPatientForDoctorService,
    sendRemedyService,
    getAppointmentsForPatientService,
    cancelBookingByIdService
}