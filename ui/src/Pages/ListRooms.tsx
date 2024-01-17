import React, {useEffect, useState} from "react";
import {inject, observer} from 'mobx-react';
import RoomList from "../Components/Room/RoomList";
import {getRoomsApi} from "../api/room";

const ListRooms = inject('rootStore')(observer(({rootStore}: any) => {
	const [rooms, setRooms] = useState<{ id: number, size: number }[]>([])

	const [loading, setLoading] = useState(false);

	const {userStore, notificationStore} = rootStore
	const fetchData = async () => {
		try {
			setLoading(true);
			const responseData = await getRoomsApi(userStore.token)
			if (responseData.message) {
				notificationStore.addError(responseData.message, responseData.code)
			} else {
				setRooms(responseData);
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) {
		return <p className="text-center">Loading...</p>
	} else {
		return (
			<React.Fragment>
				{rooms ? <RoomList rooms={rooms} /> : <p className="text-center">No Rooms Found</p>
				}
			</React.Fragment>
		);
	}
}));

export default ListRooms;
