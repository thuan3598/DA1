import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUsers, editUserService, deleteUserService } from "../../services/userService";

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })
import { Toast, toast } from 'react-toastify';

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: actionTypes.FETCH_GENDER_START})
            let res = await getAllCodeService('GENDER')
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            }
            else {
                dispatch(fetchGenderFail())
            }
        } catch (e) {
            dispatch(fetchGenderFail())
            console.log("Error: ", e)
        }
    }
}

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION')
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            }
            else {
                dispatch(fetchPositionFail())
            }
        } catch (e) {
            dispatch(fetchPositionFail())
            console.log("Error: ", e)
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE')
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            }
            else {
                dispatch(fetchRoleFail())
            }
        } catch (e) {
            dispatch(fetchRoleFail())
            console.log("Error: ", e)
        }
    }
}

// start -> doing -> end
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
})

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
})

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
})

export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

//CREATE USER
export const fetchCreateNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new user succeed!")
                dispatch(saveUserSuccess())
                dispatch(fetchAllUserStart())
            }
            else {
                toast.error("Create a new user error!")
                dispatch(saveUserFail())
            }
        } catch (e) {
            toast.error("Create a new user error!")
            dispatch(saveUserFail())
            console.log("Error: ", e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFail = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

//GET ALL USER
export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL")
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()))
            }
            else {
                toast.error("Get all users error!")
                dispatch(fetchAllUserFail())
            }
        } catch (e) {
            toast.error("Get all users error!")
            dispatch(fetchAllUserFail())
            console.log("Error: ", e)
        }
    }
}

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
})

export const fetchAllUserFail = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})


//DELETE USER
export const fetchDeleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the user succeed!")
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUserStart())
            }
            else {
                toast.error("Delete the user error!")
                dispatch(deleteUserFail())
            }
        } catch (e) {
            toast.error("Delete the user error!")
            dispatch(deleteUserFail())
            console.log("Error: ", e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFail = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

// EDIT USER
export const fetchEditUser = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log("check data edit user: ", data);
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the user succeed!")
                dispatch(editUserSuccess())
                dispatch(fetchAllUserStart())
            }
            else {
                toast.error("Update the user error!")
                dispatch(editUserFail())
            }
        } catch (e) {
            toast.error("Update the user error!")
            dispatch(editUserFail())
            console.log("Error: ", e)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAILED
})