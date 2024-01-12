import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useHttpClient} from "../../hooks/http-hook";
import moment from "moment";
import AppointmentData from "../../interface/AppointmentInterface";
import {useAppointment} from "../../store/AppointmentStore";
import {useNotification} from "../../store/NotificationStore";

const AppointmentCardExtended = (props: AppointmentData) => {
    const formattedDate = moment(props.date).format("DD-MM-yyyy");
    const formattedTime = moment(props.date).format("HH:mm");

    const expired = new Date(props.date) < new Date();

    const {sendRequest} = useHttpClient();

    const {deleteAppointment} = useAppointment();

    const {addSuccess, clearSuccess} = useNotification();

    const navigate = useNavigate()
    const handleDelete = async () => {
        try {
            const responseData = await sendRequest(
                `/appointments/delete/${props.id}`,
                "DELETE",
            );
            if (responseData.code == 200) {
                deleteAppointment(responseData.data)
                addSuccess(responseData.message, responseData.code);
                setTimeout(clearSuccess, 5000);
                navigate('/');
            }
        } catch (err) {
        }
    };

    return (
        <div
            className={
                `extended-card flex flex-col lg:flex-row gap-4 items-center justify-between ${expired && "bg-red-200"}`
            }
            style={{margin: "auto"}}
        >
            <div className="flex flex-col gap-2 items-start justify-center text-lg">
                {expired && <p className="font-bold">Expired</p>}
                <h2 className='font-bold'>Room: {props.roomId}</h2>
                <h2 className='font-bold'>Date: {formattedDate}</h2>
                <p>Time: {formattedTime}</p>
                <p>Name: {props.name}</p>
                <p>EGN: {props.egn}</p>
                <p>Details: {props.details}</p>
            </div>
            <div className="mt-4 flex gap-3">
                <Link to={`/appointment/edit/${props.id}`} className="btn-outline">
                    Edit
                </Link>
                <button onClick={handleDelete} className="btn-delete">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default AppointmentCardExtended;
