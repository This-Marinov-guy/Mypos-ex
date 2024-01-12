import React, {useEffect, useState} from "react";
import {inject, observer} from 'mobx-react';
import RoomList from "../Components/Room/RoomList";
import {useHttpClient} from "../hooks/http-hook";

const ListRooms = inject('rootStore')(observer(({rootStore}: any) => {
    const [rooms, setRooms] = useState<{ id: number, size: number }[]>([])

    const {loading, sendRequest} = useHttpClient();

    const {userStore} = rootStore
    const fetchData = async () => {
        try {
            const responseData = await sendRequest(
                `/rooms`, 'GET', null, userStore.authToken
            );
            setRooms(responseData)
        } catch (error) {
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
                {rooms ? <RoomList rooms={rooms}/> : <p className="text-center">No Rooms Found</p>
                }
            </React.Fragment>
        );
    }
}));

export default ListRooms;
