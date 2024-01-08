import React from "react";
import * as yup from "yup";
import { useHttpClient } from "../../hooks/http-hook";
import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";
import AppointmentData from "../../interface/AppointmentInterface";

type Props = {
  heading: string;
  onSubmit: Function;
  initialValues?: AppointmentData;
};

const schema = yup.object().shape({
  date: yup
    .string()
    .required("Date and time are required")
    .test("not-in-past", "Date and time cannot be in the past", (value) =>
      moment(value, "YYYY-MM-DDTHH:mm").isSameOrAfter(moment(), "minute")
    ),
  name: yup.string().required("Name is required"),
  egn: yup
    .string()
    .required("EGN is required")
    .test("is-10-digits", "EGN must be exactly 10 digits", (value) =>
      /^(?:[0-9]){10}$/.test(value)
    ),
  details: yup
    .string()
    .min(10, "Please give more details")
    .required("Details are required"),
});

const AppointmentForm = (props: Props) => {
  const { loading } = useHttpClient();

  if (loading) {
    return <p className="text-center">Loading...</p>;
  } else {
    return (
      <div className="dashed-border w-10/12" style={{ margin: "auto" }}>
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
                  date: "",
                  name: "",
                  egn: "",
                  details: "",
                }
          }
        >
          {() => (
            <Form className="flex flex-col items-center justify-between gap-6 w-full">
              <div className="flex flex-col lg:flex-row gap-4 w-1/2">
                <div className="input-element w-full lg:w-1/2">
                  <label>Date</label>
                  <Field
                    type="datetime-local"
                    min={moment().format("YYYY-MM-DDTHH:mm")}
                    name="date"
                  ></Field>
                  <ErrorMessage className="error" name="date" component="div" />
                </div>
                <div className="input-element w-full lg:w-1/2">
                  <label>Name</label>
                  <Field type="text" name="name"></Field>
                  <ErrorMessage
                    className="error"
                    name="name"
                    component="div"
                  />{" "}
                </div>
              </div>
              <div className="input-element w-1/2">
                <label>EGN</label>
                <Field type="text" name="egn"></Field>
                <ErrorMessage
                  className="error"
                  name="egn"
                  component="div"
                />{" "}
              </div>
              <div className="input-element w-1/2">
                <label>Details</label>
                <Field as="textarea" name="details" className="w-full" />
                <ErrorMessage
                  className="error"
                  name="details"
                  component="div"
                />
              </div>
              {!loading ? (
                <button disabled={false} type="submit" className="btn-primary">
                  Submit
                </button>
              ) : (
                <p>Loading...</p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    );
  }
};
export default AppointmentForm;
