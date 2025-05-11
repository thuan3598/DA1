import _ from "lodash";
import db from "../models/index";

let getAllClinicService = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({})
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllClinicService: getAllClinicService
}