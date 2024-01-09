import React, { useState } from "react";
import RoomCard from "./RoomCard";

const RoomList = () => {

    return (
        <React.Fragment>
            <h2 className="heading">List of Appointments</h2>
            <div className="flex items-center justify-center mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

                            <RoomCard

                            />

                </div>
            </div>

        </React.Fragment>
    );
};

export default RoomList;
