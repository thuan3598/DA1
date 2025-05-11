import _ from "lodash";
import db from "../models/index";

let getAllSpecialtyService = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({})
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

let getSpecialtyByNameService = (nameInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!nameInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Specialty.findAll({
                    where: {
                        name: sequelize.where(sequelize.col('name'), 'LIKE', '%' + nameInput + '%')
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'image', 'id'],
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                    
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllSpecialtyService: getAllSpecialtyService,
    getSpecialtyByNameService: getSpecialtyByNameService
}