import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useHttpClient} from "../hooks/http-hook";
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import {useAppointment} from "../store/AppointmentStore";
import {useNotification} from "../store/NotificationStore";


const EditAppointment = () => {
    const [initialValues, setInitialValues] = useState<AppointmentData>({
        id: 0,
        date: "",
        name: "",
        egn: "",
        details: "",
    });

    const [appointmentNotFound, setAppointmentNotFound] =
        useState<boolean>(false);

    const {editAppointment} = useAppointment()

    const {addNotification, clearNotification} = useNotification()

    const {id} = useParams();

    const {sendRequest} = useHttpClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/appointment/${id}`);
                if (!responseData) {
                    setAppointmentNotFound(true);
                }
                setInitialValues(responseData);
            } catch (error) {
                setAppointmentNotFound(true);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (values: AppointmentData) => {
        try {
            const responseData = await sendRequest(
                `/appointment/edit/${id}`,
                "PUT",
                JSON.stringify({
                    ...values,
                })
            );
            if (responseData.code == 200) {
                editAppointment(Number(id), responseData.data)
                addNotification(responseData.message, responseData.code);
                setTimeout(clearNotification, 5000);
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
};

export default EditAppointment;
