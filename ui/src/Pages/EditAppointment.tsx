import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useHttpClient} from "../hooks/http-hook";
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import {useAppointment} from "../store/AppointmentStore";
import {useNotification} from "../store/NotificationStore";
import AppointmentFormInterface from "../interface/AppointmentFormInterface";


const EditAppointment = () => {
    const [initialValues, setInitialValues] = useState<AppointmentFormInterface>({
        id: 0,
        date: "",
        details: "",
    });

    const [appointmentNotFound, setAppointmentNotFound] =
        useState<boolean>(false);

    const {editAppointment} = useAppointment()

    const {addSuccess, clearSuccess} = useNotification()

    const {appointmentId} = useParams();

    const {sendRequest} = useHttpClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/appointment/${appointmentId}`);
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
            );
            if (responseData.code == 200) {
                editAppointment(Number(appointmentId), responseData.data)
                addSuccess(responseData.message, responseData.code);
                setTimeout(clearSuccess, 5000);
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
