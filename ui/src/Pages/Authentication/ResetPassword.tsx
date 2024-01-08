import React, {useState} from "react";
import {useHttpClient} from "../../hooks/http-hook";
import {Link} from "react-router-dom";

const ResetPassword = () => {

    const [resetFormValues, setResetFormValues] = useState({
        email: "",
        OldPassword: "",
        newPassword: '',
    });

    const changeFormInputHandler = (event: Record<string, any>) => {
        setResetFormValues((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const { loading } = useHttpClient();

    return (
        <div className="dashed-border" >
            <h1 className="text-center mb-4">Reset Password</h1>
            <form className="flex flex-col items-center justify-between gap-6 w-full">
                <div className="input-element w-full lg:w-1/2">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={resetFormValues.email}
                        onChange={(event) => changeFormInputHandler(event)}
                    ></input>
                </div>
                <div className="input-element w-full lg:w-1/2">
                    <label>Old Password</label>
                    <input
                        type="password"
                        name="password"
                        value={resetFormValues.OldPassword}
                        onChange={(event) => changeFormInputHandler(event)}></input>
                </div>
                <div className="input-element w-full lg:w-1/2">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={resetFormValues.newPassword}
                        onChange={(event) => changeFormInputHandler(event)}></input>
                </div>
                {!loading ? (
                    <button disabled={false} type="submit" className="btn-primary">
                        Log in
                    </button>
                ) : (
                    <p>Loading...</p>
                )}
                <Link to="/profile/reset-password" className='info'>Reset Password</Link>
            </form>
        </div>)
}

export default ResetPassword;