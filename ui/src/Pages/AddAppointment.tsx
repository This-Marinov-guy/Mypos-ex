import React, {useState} from "react";
import AppointmentForm from "../Components/Form/AppointmentForm";
import AppointmentData from "../interface/AppointmentInterface";
import {inject, observer} from 'mobx-react';

const AddAppointment = inject('rootStore')(observer(({rootStore}: any) => {
	const {userStore, appointmentStore, notificationStore} = rootStore

	const [loading, setLoading] = useState(false);
	const handleSubmit = async (values: AppointmentData) => {
		try {
			setLoading(true)
			const responseData = await appointmentStore.addAppointment(values, userStore.token)
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

	return (
		<AppointmentForm loading={loading} heading="Add an appointment" onSubmit={handleSubmit} />
	);
}));

export default AddAppointment;
