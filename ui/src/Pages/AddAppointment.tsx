import React from "react";
import {useHttpClient} from "../hooks/http-hook";
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import {useAppointment} from "../store/AppointmentStore";
import {useNotification} from "../store/NotificationStore";


const AddAppointment = () => {
    const {sendRequest} = useHttpClient();

    const {addAppointment} = useAppointment();

    const {addNotification, clearNotification} = useNotification();

    const handleSubmit = async (values: AppointmentData) => {
        try {
            const responseData = await sendRequest(
                "/appointment/add",
                "POST",
                JSON.stringify({
                    ...values,
                })
            );
            if (responseData.code == 200) {
                addAppointment(responseData.data);
                addNotification(responseData.message,responseData.code);
                setTimeout(clearNotification, 5000);
            }
        } catch (err) {
        }
    };

    return (
        <AppointmentForm heading="Add an appointment" onSubmit={handleSubmit}/>
    );
};

export default AddAppointment;
