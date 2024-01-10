import React, {useEffect, useState} from "react";
import RoomList from "../Components/Room/RoomList";
import {useHttpClient} from "../hooks/http-hook";

const ListRooms = () => {
    const [rooms, setRooms] = useState<{id:number, size:number}[]>([])

    const { loading, sendRequest } = useHttpClient();

    const fetchData = async () => {
            try {
                const responseData = await sendRequest(
                    `/rooms`
                );
              setRooms(responseData)
            } catch (error) {
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <React.Fragment>
            {rooms.length > 0 ? <RoomList rooms={rooms!}/> : <p className="text-center">No Rooms Found</p>
            }
        </React.Fragment>
    );
};

export default ListRooms;
