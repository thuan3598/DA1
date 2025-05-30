import clinicService from "../services/clinicService"

let getAllClinic = async (req, res) => {
    try {
        let info = await clinicService.getAllClinicService()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...'
        })
    }
}

module.exports = {
    getAllClinic: getAllClinic
}