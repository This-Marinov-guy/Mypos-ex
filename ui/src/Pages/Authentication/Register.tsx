import React from "react";
import * as yup from "yup";
import YupPassword from 'yup-password'
import {useHttpClient} from "../../hooks/http-hook";
import moment from "moment/moment";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useNotification} from "../../store/NotificationStore";
import {useNavigate} from "react-router-dom";

YupPassword(yup)

const schema = yup.object().shape({

    name: yup.string().required("Name is required"),
    egn: yup
        .string()
        .required("EGN is required")
        .test("is-10-digits", "EGN must be exactly 10 digits", (value) =>
            /^(?:[0-9]){10}$/.test(value)
        ),
    email: yup.string().email(),
    password: yup.string()
        // .password().required()
});

const Register = () => {
    const {loading, sendRequest} = useHttpClient();

    const navigate = useNavigate()

    const {addNotification, clearNotification} = useNotification()

    return (
        <div className="dashed-border">
            <h1 className="text-center mb-4">Create Profile</h1>
            <Formik
                enableReinitialize
                validationSchema={schema}
                onSubmit={async (values) => {
                    try {
                    const responseData = await sendRequest(
                        '/user/register',
                        "POST",
                        JSON.stringify({
                            ...values,
                        })
                    );
                    if (responseData.code == 200) {
                        addNotification(responseData.message, responseData.code);
                        setTimeout(clearNotification, 5000);
                        navigate('/user/login')
                    }
                } catch (err) {
                }
                }}
                initialValues={
                    {
                        name: "",
                        email: '',
                        password: '',
                        egn: "",
                    }
                }
            >
                {() => (
                    <Form className="flex flex-col items-center justify-between gap-6 w-full">
                        <div className="flex flex-col lg:flex-row gap-4 w-1/2">

                            <div className="input-element w-full ">
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
                        <div className="input-element w-1/2 ">
                            <label>Email</label>
                            <Field type="text" name="email"></Field>
                            <ErrorMessage
                                className="error"
                                name="email"
                                component="div"
                            />{" "}
                        </div>
                        <div className="input-element w-1/2 ">
                            <label>Password</label>
                            <Field type="password" name="password"></Field>
                            <ErrorMessage
                                className="error"
                                name="password"
                                component="div"
                            />{" "}
                            <p className='info text-sm w-full break-words'>Password must be at least 8 symbols and contain uppercase letter, number and a symbol</p>
                        </div>
                        {!loading ? (
                            <button disabled={false} type="submit" className="btn-primary mt-4">
                                Register
                            </button>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default Register;