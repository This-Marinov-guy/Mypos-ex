import React, {useState} from "react";
import { useHttpClient } from "../../hooks/http-hook";
import {Link} from "react-router-dom";

const Login = () => {
    const [loginFormValues, setLoginFormValues] = useState({
        email: "",
        password: "",
    });

    const changeFormInputHandler = (event: Record<string, any>) => {
        setLoginFormValues((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const { loading } = useHttpClient();

        return (
            <div className="dashed-border" >
                <h1 className="text-center mb-4">Log in</h1>
                <form className="flex flex-col items-center justify-between gap-6 w-full">
                        <div className="input-element w-full lg:w-1/2">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={loginFormValues.email}
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
