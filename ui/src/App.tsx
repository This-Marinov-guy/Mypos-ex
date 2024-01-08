import React, {useEffect} from "react";
import {observer} from "mobx-react-lite"
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
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

const App = observer(() => {
    const {success, error} = useNotification();

    const {login} = useUser();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            login(token)
        }
    }, []);
    return (
        <Router basename={"/"}>
            <NavBar/>
            {error.message && <Error/>}
            {success.message && <Success/>}
            <AppointmentProvider>
                <Routes>
                    <Route path={`/`} element={<ListAppointments/>}/>
                    <Route path={`/appointment/:id`} element={<DetailsAppointment/>}/>
                    <Route path={`/appointment/add`} element={<AddAppointment/>}/>
                    <Route path={`/appointment/edit/:id`}
                           element={<EditAppointment/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                    <Route path={`/profile/register`} element={<Register/>}/>
                    <Route path={`/profile/log-in`} element={<Login/>}/>
                    <Route path={`/profile/reset-password`} element={<ResetPassword/>}/>
                </Routes>
            </AppointmentProvider>
        </Router>
    );
});

export default App;
