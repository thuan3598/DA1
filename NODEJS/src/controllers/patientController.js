import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postBookAppointmentService(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyBookAppointmentService(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...'
        })
    }
}

let getAppointmentsForPatient = async (req, res) => {
    try {
        let patientId = req.query.patientId; // Lấy patientId từ query parameter
        if (!patientId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing patientId parameter!'
            });
        }
        let info = await patientService.getAppointmentsForPatientService(patientId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server while getting patient appointments...'
        });
    }
};

let handleCancelBookingById = async (req, res) => {
    try {
        let bookingId = Object.keys(req.body)[0];; // Lấy bookingId từ request body
        if (!bookingId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing bookingId parameter!'
            });
        }
        let response = await patientService.cancelBookingByIdService(bookingId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server while canceling booking...'
        });
    }
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAppointmentsForPatient: getAppointmentsForPatient,
    handleCancelBookingById: handleCancelBookingById
}