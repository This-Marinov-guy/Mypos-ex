import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useHttpClient} from "../hooks/http-hook";
import {inject, observer} from 'mobx-react';
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import AppointmentFormInterface from "../interface/AppointmentFormInterface";


const EditAppointment = inject('rootStore')(observer(({rootStore}: any) => {
    const [initialValues, setInitialValues] = useState<AppointmentFormInterface>({
        id: 0,
        date: "",
        details: "",
    });

    const [appointmentNotFound, setAppointmentNotFound] =
        useState<boolean>(false);

    const {userStore, appointmentStore, notificationStore} = rootStore


    const {appointmentId} = useParams();

    const {sendRequest} = useHttpClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/appointment-details/${appointmentId}`);
                if (!responseData) {
                    setAppointmentNotFound(true);
                }
                const {name, egn, ...rest} = responseData
                setInitialValues(rest);
            } catch (error) {
                setAppointmentNotFound(true);
            }
        };

        fetchData();
    }, [appointmentId]);

    const handleSubmit = async (values: AppointmentData) => {
        try {
            const responseData = await sendRequest(
                `/appointments/edit/${appointmentId}`,
                "PUT",
                values,
                userStore.authToken
            );
            if (responseData.code == 200) {
                appointmentStore.editAppointment(Number(appointmentId), responseData.data)
                notificationStore.addSuccess(responseData.message, responseData.code);
            } else {
                notificationStore.addError(responseData.message, responseData.code);
            }
        } catch (err) {
        }
    };

    if (appointmentNotFound) {
        return <p className="text-center">No such appointment</p>;
    } else {
        return (
            <AppointmentForm
                heading="Edit appointment"
                onSubmit={handleSubmit}
                initialValues={initialValues}
            />
        );
    }
}));

export default EditAppointment;
