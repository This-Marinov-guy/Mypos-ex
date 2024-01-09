import React from "react";
import {Link} from "react-router-dom";

const RoomCard = () => {

    return (
        <Link
            to={`/${1}/appointments`}
            className={`flex flex-col items-start justify-around basic-card`}
        >
            <h2 className="text-lg font-bold">
                Room 1
            </h2>
            <p>size: 1</p>

        </Link>
    );
};

export default RoomCard;
