import React, {useState} from "react";
import {useHttpClient} from "../../hooks/http-hook";
import {Link, useNavigate} from "react-router-dom";
import {useNotification} from "../../store/NotificationStore";

const ResetPassword = () => {

    const [resetFormValues, setResetFormValues] = useState({
        email: "",
        newPassword: '',
    });

    const changeFormInputHandler = (event: Record<string, any>) => {
        setResetFormValues((prevState) => {
            return {...prevState, [event.target.name]: event.target.value};
        });
    };

    const navigate = useNavigate()

    const {loading, sendRequest} = useHttpClient();

    const {addSuccess, clearSuccess} = useNotification()

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            const responseData = await sendRequest(
                '/user/reset-password',
                'POST',
                resetFormValues
            );
            if (responseData.code == 200) {
                addSuccess(responseData.message, responseData.code);
                setTimeout(clearSuccess, 5000);
                navigate('/profile/log-in')
            }
        } catch (err) {
        }
    }

    return (
        <div className="dashed-border">
            <h1 className="text-center mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-between gap-6 w-full">
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
                    <label>New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={resetFormValues.newPassword}
                        onChange={(event) => changeFormInputHandler(event)}></input>
                </div>
                {!loading ? (
                    <button disabled={false} type="submit" className="btn-primary">
                        Reset
                    </button>
                ) : (
                    <p>Loading...</p>
                )}
                <Link to="/profile/reset-password" className='info'>Reset Password</Link>
            </form>
        </div>)
}

export default ResetPassword;