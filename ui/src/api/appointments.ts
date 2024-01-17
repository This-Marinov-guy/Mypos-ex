import axios from "axios";
import AppointmentData from "../interface/AppointmentInterface";

const url = process.env.REACT_APP_API_URL

export const getAppointmentsApi = async (searchParams: string, token: string) => {
	try {
		const response = await axios.get(url + `/appointments?${searchParams}`, {headers: {Authorization: 'Bearer ' + token}})
		return response.data
	} catch (error) {
	}
}

export const getAppointmentByIdApi = async (id: string) => {
	try {
		const response = await axios.get(url + `/appointment-details/${id}`)
		return response.data
	} catch (error) {
	}
}

export const getUserAppointmentsApi = async (userId: string, appointmentId: string) => {
	try {
		const response = await axios.get(url + `/user-appointments/${userId}/${appointmentId}`)
		return response.data
	} catch (error) {
	}
}

export const postAppointmentApi = async (values: AppointmentData, token: string) => {
	try {
		const responseData = await axios.post(url + `/appointments/add`, values, {headers: {Authorization: 'Bearer ' + token}})
		return responseData.data
	} catch (error) {
	}
}

export const putAppointmentApi = async (appointmentId: string, values: AppointmentData, token: string) => {
	try {
		const responseData = await axios.put(url + `/appointments/edit/${appointmentId}`, values, {headers: {Authorization: 'Bearer ' + token}})
		return responseData.data
	} catch (error) {
	}
}

export const deleteAppointmentApi = async (appointmentId: number, token: string) => {
	try {
		const responseData = await axios.delete(url + `/appointments/delete/${appointmentId}`, {headers: {Authorization: 'Bearer ' + token}})
		return responseData.data
	} catch (error) {
	}
}