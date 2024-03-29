import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import AppointmentCardExtended from "../Components/Appointment/AppointmentCardExtended";
import AppointmentList from "../Components/Appointment/AppointmentList";
import AppointmentData from "../interface/AppointmentInterface";
import {getAppointmentByIdApi, getUserAppointmentsApi} from "../api/appointments";

const DetailsAppointment = () => {
	const [appointment, setAppointment] = useState<AppointmentData>({
		id:      0,
		date:    "",
		name:    "",
		egn:     "",
		details: "",
	});

	const [userAppointments, setUserAppointments] = useState<AppointmentData[]>([])

	const {appointmentId} = useParams();

	const [loading, setLoading] = useState(false);

	const [appointmentNotFound, setAppointmentNotFound] =
		useState<boolean>(false);

	const fetchData = async () => {
		try {
			setLoading(true);
			const responseData = await getAppointmentByIdApi(appointmentId!);
			if (!responseData) {
				setAppointmentNotFound(true);
			} else {
				setAppointment(responseData);
				const responseUserData = await getUserAppointmentsApi(responseData.userId, appointmentId!)
				setUserAppointments(
					responseUserData.data
				);
			}
		} catch (error) {
			setAppointmentNotFound(true);
		} finally {
			setLoading(false)
		}
	};

	useEffect(() => {
		fetchData();
	}, [appointmentId]);

	if (loading) {
		return <p className="text-center">Loading...</p>;
	} else if (appointmentNotFound) {
		return <p className="text-center">No appointments found</p>;
	} else {
		return (
			<React.Fragment>
				<AppointmentCardExtended
					key={appointmentId}
					id={appointment.id}
					roomId={appointment.roomId}
					date={appointment.date}
					name={appointment.name}
					egn={appointment.egn}
					details={appointment.details}
				/>
				{userAppointments.length > 0 ? (
					<AppointmentList appointments={userAppointments!} />
				) : (
					<p className="text-center mt-6">No other appointments found</p>
				)}{" "}
			</React.Fragment>
		);
	}
};

export default DetailsAppointment;
