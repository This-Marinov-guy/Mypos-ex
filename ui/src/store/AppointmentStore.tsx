import AppointmentData from "../interface/AppointmentInterface";
import {action, makeAutoObservable, observable} from "mobx"

export default class AppointmentStore {
	rootStore;
	@observable appointments: AppointmentData[] = [];

	constructor(root: any) {
		makeAutoObservable(this)
		this.rootStore = root
	}

	@action loadAllAppointments(appointments: AppointmentData[]) {
		this.appointments = [...appointments]
	}

	@action addAppointment(appointment: AppointmentData) {
		this.appointments.concat(appointment)
	}

	@action editAppointment(id: number, update: AppointmentData) {
		let index = this.appointments.findIndex((obj => obj.id === id));
		this.appointments[index] = update;
	}

	@action deleteAppointment(id: number) {
		this.appointments = this.appointments.filter((appointment) => appointment.id !== id)
	}
}
