import React from "react";
import { observer } from "mobx-react-lite"
import {useNotification} from "../../store/NotificationStore";

const Error = observer(() => {

    const {error} = useNotification()

    return (
        <div
            className="mb-4 border rounded-md shadow-sm border-red-200 text-red-500 bg-red-50 p-2 m-2"
        >
            <h3 className='mr-3 font-bold'>{error.code}</h3>
            <p>{error.message}</p>
        </div>
    );
});

export default Error;
