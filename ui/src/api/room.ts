import axios from "axios";

const url = process.env.REACT_APP_API_URL

export const getRoomsApi = async (token: string) => {
	try {
		const response = await axios.get(url + '/rooms', {headers: {Authorization: 'Bearer ' + token}})
		return response.data
	} catch (error) {

	}
}

export const getRoomAppointmentsApi = async (searchParams: string, token: string, roomId: string) => {
	try {
		const response = await axios.get(url + `/rooms/${roomId}/appointments?${searchParams}`, {headers: {Authorization: 'Bearer ' + token}})
		return response.data
	} catch (error) {

	}
}