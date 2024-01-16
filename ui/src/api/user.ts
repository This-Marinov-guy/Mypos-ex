import axios from "axios";
import {UserLoginValues, UserRegisterValues} from "../interface/UserInterface";

const url = process.env.REACT_APP_API_URL

export const signUpApi = async (values: UserRegisterValues) => {
	try {
		const response = await axios.post(url + '/user/register', values)
		return response.data
	} catch (error) {
	}
}

export const logInApi = async (values: UserLoginValues) => {
	try {
		const response = await axios.post(url + '/user/login', values)
		return response.data
	} catch (error) {
	}
}

export const resetPasswordApi = async (values: { email: string, newPassword: string }) => {
	try {
		const response = await axios.put(url + '/user/reset-password', values)
		return response.data
	} catch (error) {
	}
}