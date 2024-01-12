import React from "react";
import {useHttpClient} from "../hooks/http-hook";
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import {inject, observer} from 'mobx-react';

const AddAppointment = inject('rootStore')(observer(({rootStore}: any) => {
    const {sendRequest} = useHttpClient();

    const {userStore, appointmentStore, notificationStore} = rootStore


    const handleSubmit = async (values: AppointmentData) => {
        try {
            const responseData = await sendRequest(
                `/appointments/add`,
                "POST",
                values,
                userStore.authToken
            );
            if (responseData.code == 200) {
                appointmentStore.addAppointment(responseData.data);
                notificationStore.addSuccess(responseData.message, responseData.code);
            } else {
                notificationStore.addError(responseData.message, responseData.code);
            }
        } catch (err) {
        }
    };

    return (
        <AppointmentForm heading="Add an appointment" onSubmit={handleSubmit}/>
    );
}));

export default AddAppointment;
