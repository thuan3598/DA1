import specialtyService from "../services/specialtyService";

let getAllSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.getAllSpecialtyService();
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server ...",
    });
  }
};

let getSpecialtyByName = async (req, res) => {
  try {
    let info = await specialtyService.getSpecialtyByNameService(req.query.name);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server ...",
    });
  }
};

let createSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.createSpecialtyService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server ...",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let info = await specialtyService.getDetailSpecialtyByIdService(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server ...",
    });
  }
};

module.exports = {
  getAllSpecialty: getAllSpecialty,
  getSpecialtyByName: getSpecialtyByName,
  createSpecialty: createSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
};
