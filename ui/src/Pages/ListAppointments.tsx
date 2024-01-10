import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite"
import {useParams, useSearchParams} from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import AppointmentList from "../Components/Appointment/AppointmentList";
import Filter from "../Components/UI/Filter";
import Pagination from "../Components/UI/Pagination";
import {useAppointment} from "../store/AppointmentStore";
import {useUser} from "../store/UserStore";

const ListAppointments = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page") ||  1)
  );
  const [pagesCount, setPagesCount] = useState<number>(1);

  const { loading, sendRequest } = useHttpClient();

  const {appointments, loadAllAppointments} = useAppointment();

  const {roomId} = useParams();

  const {user} = useUser();

  const fetchData = async () => {
    if (roomId && user.roles.includes("ROLE_ADMIN")) {
      try {
        const responseData = await sendRequest(
            `/room/${roomId}/appointments?${searchParams.toString()}`
        );
        loadAllAppointments(responseData);
        setPagesCount(responseData);
        setCurrentPage(Number(searchParams.get("page")));
      } catch (error) {
      }
    } else {
      try {
        const responseData = await sendRequest(
            `/appointments?${searchParams.toString()}`
        );
        loadAllAppointments(responseData.data);
        setPagesCount(responseData.pagesCount);
        setCurrentPage(Number(searchParams.get("page")));
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const changePage = (page: number) => {
    //change the page without harming the other parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${page}`);
    setSearchParams(newSearchParams);
    setCurrentPage(page);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  } else {
    return (
      <React.Fragment>
        <Filter />
        {appointments.length > 0 ? (
          <AppointmentList appointments={appointments} />
        ) : (
          <p className="text-center">No Appointments Found</p>
        )}
        ;
        {pagesCount > 1 && (
          <Pagination
            currentPage={currentPage}
            pagesCount={pagesCount}
            setCurrentPage={changePage}
          />
        )}
      </React.Fragment>
    );
  }
});

export default ListAppointments;
