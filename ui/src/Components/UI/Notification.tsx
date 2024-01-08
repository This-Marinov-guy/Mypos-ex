import React from "react";
import { observer } from "mobx-react-lite"
import {useNotification} from "../../store/NotificationStore";

const Notification = observer(() => {

    const {notification} = useNotification();

    return (
        <div
            className="mb-4 border rounded-md shadow-sm border-green-200 text-green-500 bg-green-50 p-2 m-2"
        >
            <h3 className='mr-3 font-bold'>{notification.code}</h3>
            <p>{notification.message}</p>
        </div>
    );
});

export default Notification;
