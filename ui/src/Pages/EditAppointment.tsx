import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {inject, observer} from 'mobx-react';
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import AppointmentFormInterface from "../interface/AppointmentFormInterface";
import {getAppointmentByIdApi} from "../api/appointments";


const EditAppointment = inject('rootStore')(observer(({rootStore}: any) => {
	const [initialValues, setInitialValues] = useState<AppointmentFormInterface>({
		id:      0,
		date:    "",
		details: "",
	});

	const [appointmentNotFound, setAppointmentNotFound] =
		useState<boolean>(false);

	const {userStore, appointmentStore, notificationStore} = rootStore

	const {appointmentId} = useParams();

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true);

		const fetchData = async () => {
			try {
				const responseData = await getAppointmentByIdApi(appointmentId!)
				if (!responseData) {
					setAppointmentNotFound(true);
				}
				const {name, egn, ...rest} = responseData
				setInitialValues(rest);
			} catch (error) {
				setAppointmentNotFound(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [appointmentId]);

	const handleSubmit = async (values: AppointmentData) => {
		try {
			setLoading(true);
			const responseData = await appointmentStore.editAppointment(appointmentId, values, userStore.token)
			if (responseData.code == 200) {
				notificationStore.addSuccess(responseData.message, responseData.code);
			} else {
				notificationStore.addError(responseData.message, responseData.code);
			}
		} catch (err) {
		} finally {
			setLoading(false)
		}
	};

	if (appointmentNotFound) {
		return <p className="text-center">No such appointment</p>;
	} else {
		return (
			<AppointmentForm
				loading={loading}
				heading="Edit appointment"
				onSubmit={handleSubmit}
				initialValues={initialValues}
			/>
		);
	}
}));

export default EditAppointment;
