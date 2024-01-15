import React from "react";
import AppointmentCard from "./AppointmentCardBasic";
import AppointmentListInterface from "../../interface/AppointmentListInterface";

const AppointmentList = (props: AppointmentListInterface) => {

	return (
		<React.Fragment>
			<h2 className="heading">List of Appointments</h2>
			<div className="flex items-center justify-center mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
					{props.appointments.map((appointment, index) => {
						return (
							<AppointmentCard
								key={index}
								id={appointment.id}
								roomId={appointment.roomId}
								date={appointment.date}
								name={appointment.name}
								egn={appointment.egn}
								details={appointment.details}
							/>
						);
					})}
				</div>
			</div>

		</React.Fragment>
	);
};

export default AppointmentList;
