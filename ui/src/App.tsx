import React, {Fragment, useEffect} from "react";
import {observer} from "mobx-react-lite"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {useNotification} from "./store/NotificationStore";
import {AppointmentProvider} from "./store/AppointmentStore";

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
import {useUser} from "./store/UserStore";
import ListRooms from "./Pages/ListRooms";

const App = observer(() => {
    const {success, error} = useNotification();

    const {user, login} = useUser();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user")!)
        if (storedUser) {
            login(storedUser)
        }
    }, []);

    return (
        <Router basename={"/"}>
            <NavBar/>
            {error.message && <Error/>}
            {success.message && <Success/>}
            <AppointmentProvider>
                <Routes>
                    {user.token ? <Fragment>
                            {user.roles.includes("ROLE_ADMIN") ? <Fragment>
                                    <Route path={`/`} element={<ListRooms/>}/>
                                    <Route path={`/:roomId/appointments`} element={<ListAppointments/>}/>
                                </Fragment>
                                :
                                <Route path={`/`} element={<ListAppointments/>}/>}
                            <Route path={`/appointment/:appointmentId`} element={<DetailsAppointment/>}/>
                            <Route path={`/appointment/add`} element={<AddAppointment/>}/>
                            <Route path={`/appointment/edit/:appointmentId`}
                                   element={<EditAppointment/>}/>
                        </Fragment> :
                        <Fragment>
                            <Route path={`/`} element={<Register/>}/>
                            <Route path={`/profile/register`} element={<Register/>}/>
                            <Route path={`/profile/log-in`} element={<Login/>}/>
                            <Route path={`/profile/reset-password`} element={<ResetPassword/>}/>
                        </Fragment>}
                </Routes>
            </AppointmentProvider>
        </Router>
    );
});

export default App;
