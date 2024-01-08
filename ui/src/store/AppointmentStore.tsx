import React, {createContext, useContext, useState} from 'react';
import AppointmentData from "../interface/AppointmentInterface";
import {action, makeAutoObservable, observable} from "mobx"

export class AppointmentStore {
    appointments: AppointmentData[] = [];
    constructor() {
        makeAutoObservable(this, {
            appointments: observable,
        })
    }

    loadAllAppointments= action((appointments: AppointmentData[]) => {
        this.appointments = [...appointments]
    })

    addAppointment = action((appointment: AppointmentData) => {
        this.appointments.concat(appointment)
    })

    editAppointment = action((id: number, update: AppointmentData) => {
        let index = this.appointments.findIndex((obj => obj.id == id));
        this.appointments[index] = update;
    })

    deleteAppointment = action((id: number) => {
        this.appointments = this.appointments.filter((appointment) => appointment.id != id)
    })
}

export const AppointmentContext = createContext<AppointmentStore>(null!);

export const AppointmentProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new AppointmentStore());
    return <AppointmentContext.Provider value={store}>{children}</AppointmentContext.Provider>
}

export const useAppointment = () => useContext(AppointmentContext);