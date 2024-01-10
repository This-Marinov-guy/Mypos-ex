import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import AppointmentData from "../../interface/AppointmentInterface";

const AppointmentCard = (props: AppointmentData) => {
  const formattedDate = moment(props.date).format("DD-MM-yyyy");
  const formattedTime = moment(props.date).format("HH:mm");

  const expired = new Date(props.date) < new Date();

  return (
      <Link
          to={`/appointment/${props.id}`}
          className={`flex flex-col items-start justify-around basic-card ${
              expired && "bg-red-200"
          }`}
      >
        <h2 className="text-lg font-bold">
          Room: {props.roomId}
        </h2>
        <h2 className="text-lg font-bold">
          {formattedDate + " | " + formattedTime}
        </h2>
        {expired && <p className="font-bold">Expired</p>}
        <p className="text-sm">Name: {props.name}</p>
        <p className="text-sm">EGN: {props.egn}</p>
        <p className="text-sm">Details: {props.details}</p>
      </Link>
  );
};

export default AppointmentCard;
