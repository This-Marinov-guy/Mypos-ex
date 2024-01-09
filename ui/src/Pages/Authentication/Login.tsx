import React, {useState} from "react";
import {useHttpClient} from "../../hooks/http-hook";
import {Link, useNavigate} from "react-router-dom";
import {useNotification} from "../../store/NotificationStore";
import {useUser} from "../../store/UserStore";

const Login = () => {
    const [loginFormValues, setLoginFormValues] = useState({
        username: "",
        password: "",
    });

    const changeFormInputHandler = (event: Record<string, any>) => {
        setLoginFormValues((prevState) => {
            return {...prevState, [event.target.name]: event.target.value};
        });
    };

    const {loading, sendRequest} = useHttpClient();

    const navigate = useNavigate()

    const {addSuccess, clearSuccess} = useNotification()
    const {login} = useUser();
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            const responseData = await sendRequest(
                '/user/login',
                'POST',
                loginFormValues
            );
            if (responseData.token) {
                login({
                    token: responseData.token,
                    id: responseData.data.id,
                    roles: responseData.data.roles
                });
                addSuccess(responseData.message, responseData.code);
                setTimeout(clearSuccess, 5000);
                navigate('/')
            }
        } catch (err) {
        }
    }

    return (
        <div className="dashed-border">
            <h1 className="text-center mb-4">Log in</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-between gap-6 w-full">
                <div className="input-element w-full lg:w-1/2">
                    <label>Email</label>
                    <input
                        type="text"
                        name="username"
                        value={loginFormValues.username}
                        onChange={(event) => changeFormInputHandler(event)}
                    ></input>
                </div>
                <div className="input-element w-full lg:w-1/2">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={loginFormValues.password}
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
        </div>
    );
};
export default Login;
