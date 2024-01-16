import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {inject, observer} from 'mobx-react';

const Login = inject('rootStore')(observer(({rootStore}: any) => {
	const [loginFormValues, setLoginFormValues] = useState({
		username: "",
		password: "",
	});

	const changeFormInputHandler = (event: Record<string, any>) => {
		setLoginFormValues((prevState) => {
			return {...prevState, [event.target.name]: event.target.value};
		});
	};

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate()

	const {userStore, notificationStore} = rootStore

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		try {
			setLoading(true);
			const responseData = await userStore.login(loginFormValues)
			if (responseData.token) {
				notificationStore.addSuccess(responseData.message, responseData.code);
				navigate('/')
			} else {
				notificationStore.addError(responseData.message, responseData.code);
			}
		} catch (err) {
		} finally {
			setLoading(false)
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
}));
export default Login;
