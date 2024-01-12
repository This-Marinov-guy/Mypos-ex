import React, {useEffect, useState} from "react";
import RoomList from "../Components/Room/RoomList";
import {useHttpClient} from "../hooks/http-hook";
import {useUser} from "../store/UserStore";

const ListRooms = () => {
    const [rooms, setRooms] = useState<{ id: number, size: number }[]>([])

    const {loading, sendRequest} = useHttpClient();
    const fetchData = async () => {
        try {
            const responseData = await sendRequest(
                `/rooms`
            );
            console.log(responseData)
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
                {rooms ? <RoomList rooms={rooms!}/> : <p className="text-center">No Rooms Found</p>
                }
            </React.Fragment>
        );
    }
};

export default ListRooms;
