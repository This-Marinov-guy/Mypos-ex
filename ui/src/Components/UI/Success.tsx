import React from "react";
import {observer} from "mobx-react-lite"
import {useNotification} from "../../store/NotificationStore";

const Success = observer(() => {

    const {success} = useNotification();

    return (
        <div
            className="mb-4 border rounded-md shadow-sm border-green-200 text-green-500 bg-green-50 p-2 m-2"
        >
            <h3 className='mr-3 font-bold'>{success.code}</h3>
            <p>{success.message}</p>
        </div>
    );
});

export default Success;
