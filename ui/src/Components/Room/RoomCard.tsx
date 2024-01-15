import React from "react";
import {Link} from "react-router-dom";

const RoomCard = (props: { id: number, size: number }) => {

	return (
		<Link
			to={`/${props.id}/appointments`}
			className={`flex flex-col items-start justify-around basic-card`}
		>
			<h2 className="text-lg font-bold">
				Room {props.id}
			</h2>
			<p>size: {props.size}</p>

		</Link>
	);
};

export default RoomCard;
