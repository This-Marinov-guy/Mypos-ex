import React from "react";
import * as yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import moment from "moment";
import AppointmentFormInterface from "../../interface/AppointmentFormInterface";

type Props = {
	loading: boolean;
	heading: string;
	onSubmit: Function;
	initialValues?: AppointmentFormInterface;
};

const schema = yup.object().shape({
	date: yup
		      .string()
	// .required("Date and time are required")
	// .test("not-in-past", "Date and time cannot be in the past", (value) =>
	//     moment(value, "YYYY-MM-DDTHH:mm").isSameOrAfter(moment(), "minute")
	// )
	,
	details: yup
		         .string()
	// .min(10, "Please give more details")
	// .required("Details are required"),
});

const AppointmentForm = (props: Props) => {

		return (
			<div className="dashed-border w-10/12" style={{margin: "auto"}}>
				<h2 className="text-center mb-4">{props.heading}</h2>
				<Formik
					enableReinitialize
					validationSchema={schema}
					onSubmit={(values) => props.onSubmit(values)}
					initialValues={
						props.initialValues
							? {
								...props.initialValues,
								date: moment(props.initialValues.date).format(
									"YYYY-MM-DDTHH:mm"
								),
							}
							: {
								date:    "",
								details: "",
							}
					}
				>
					{() => (
						<Form className="flex flex-col items-center justify-center gap-6 w-full">
							<div className="flex flex-col w-full lg:w-1/2 gap-4">
								<div className="input-element w-full ">
									<label>Date</label>
									<Field
										type="datetime-local"
										min={moment().format("YYYY-MM-DDTHH:mm")}
										name="date"
									></Field>
									<ErrorMessage className="error" name="date" component="div" />
								</div>

								<div className="input-element w-full">
									<label>Details</label>
									<Field as="textarea" name="details" className="w-full" />
									<ErrorMessage
										className="error"
										name="details"
										component="div"
									/>
								</div>
							</div>
							<button disabled={props.loading} type="submit" className="btn-primary">
								{props.loading ? 'Loading...' : 'Submit'}
							</button>

						</Form>
					)}
				</Formik>
			</div>
		);
};
export default AppointmentForm;
