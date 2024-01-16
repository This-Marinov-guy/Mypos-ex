import AppointmentData from "../interface/AppointmentInterface";
import {action, makeAutoObservable, observable} from "mobx"
import {deleteAppointmentApi, getAppointmentsApi, postAppointmentApi, putAppointmentApi} from "../api/appointments";
import {getRoomAppointmentsApi} from "../api/room";

export default class AppointmentStore {
	rootStore;
	@observable appointments: AppointmentData[] = [];

	constructor(root: any) {
		makeAutoObservable(this)
		this.rootStore = root
	}

	@action
	async loadAllAppointments(searchParams: string, token: string, roomId = '') {
		try {
			const responseData = roomId ?
				await getRoomAppointmentsApi(searchParams, token, roomId ) :
				await getAppointmentsApi(searchParams, token)
			this.appointments = responseData.data
			return responseData
		} catch (error) {
		}
	}

	@action
	async addAppointment(values: AppointmentData, token: string) {
		try {
			const responseData = await postAppointmentApi(values, token)
			this.appointments.concat(responseData.data)
			return {message: responseData.message, code: responseData.code}
		} catch (error) {
		}
	}

	@action
	async editAppointment(appointmentId: string, values: AppointmentData, token: string) {
		try {
			const responseData = await putAppointmentApi(appointmentId, values, token)
			let index = this.appointments.findIndex((obj => obj.id === Number(appointmentId)));
			this.appointments[index] = responseData.data;
			return {message: responseData.message, code: responseData.code}
		} catch (error) {
		}

	}

	@action
	async deleteAppointment(appointmentId: number, token: string) {
		try {
			const responseData = await deleteAppointmentApi(appointmentId, token);
			this.appointments = this.appointments.filter((appointment) => appointment.id !== appointmentId)
			return {message: responseData.message, code: responseData.code}
		} catch (error) {

		}
	}
}
