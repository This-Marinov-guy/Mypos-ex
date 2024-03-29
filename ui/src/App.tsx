import React, {Fragment, useEffect, useState} from "react";
import {inject, observer} from 'mobx-react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


import "./App.css";

import ListAppointments from "./Pages/ListAppointments";
import DetailsAppointment from "./Pages/DetailsAppointment";
import AddAppointment from "./Pages/AddAppointment";
import EditAppointment from "./Pages/EditAppointment";
import NavBar from "./Components/Navigation/NavBar";
import Success from "./Components/UI/Success";
import Register from "./Pages/Authentication/Register";
import Login from "./Pages/Authentication/Login";
import ResetPassword from "./Pages/Authentication/ResetPassword";
import Error from "./Components/UI/Error";
import ListRooms from "./Pages/ListRooms";

const App = inject('rootStore')(observer(({rootStore}: any) => {

	const {userStore, notificationStore} = rootStore

	const [loading, setLoading] = useState(false);

	const logIn = async () => {
		try {
			setLoading(true);
			const storedUser = JSON.parse(localStorage.getItem("user")!)
			if (storedUser) {
				await userStore.login(storedUser)
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		logIn()
	}, []);

	if (loading) {
		return <h3 className='text-center'>Loading...</h3>
	} else {
		return (
			<Router basename={"/"}>
				<NavBar />
				{notificationStore.hasError &&
					<Error />}
				{notificationStore.hasSuccess &&
					<Success />}
				<Routes>
					{userStore.authToken ? <Fragment>
							{userStore.isAdmin ? <Fragment>
									<Route path={`/`} element={<ListRooms />} />
									<Route path={`/:roomId/appointments`} element={<ListAppointments />} />
								</Fragment>
								:
								<Route path={`/`} element={<ListAppointments />} />}
							<Route path={`/appointment/:appointmentId`} element={<DetailsAppointment />} />
							<Route path={`/appointment/add`} element={<AddAppointment />} />
							<Route path={`/appointment/edit/:appointmentId`}
							       element={<EditAppointment />} />
						</Fragment> :
						<Fragment>
							<Route path={`/`} element={<Register />} />
							<Route path={`/profile/register`} element={<Register />} />
							<Route path={`/profile/log-in`} element={<Login />} />
							<Route path={`/profile/reset-password`} element={<ResetPassword />} />
						</Fragment>}
				</Routes>
			</Router>
		);
	}

}));

export default App;
