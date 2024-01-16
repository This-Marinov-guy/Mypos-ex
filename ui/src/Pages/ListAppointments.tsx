import React, {useEffect, useState} from "react";
import {inject, observer} from 'mobx-react';
import {useParams, useSearchParams} from "react-router-dom";
import AppointmentList from "../Components/Appointment/AppointmentList";
import Filter from "../Components/UI/Filter";
import Pagination from "../Components/UI/Pagination";


const ListAppointments = inject('rootStore')(observer(({rootStore}: any) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get("page") || 1)
	);
	const [pagesCount, setPagesCount] = useState<number>(1);

	const [loading, setLoading] = useState(false)

	const {userStore, appointmentStore} = rootStore

	const {roomId} = useParams();

	const fetchData = async () => {
		try {
			setLoading(true);
			const responseData = appointmentStore.loadAllAppointments(searchParams.toString(), userStore.token, roomId);
			setPagesCount(responseData.pagesCount);
			setCurrentPage(Number(searchParams.get("page")));
		} catch (error) {
		} finally {
			setLoading(false)
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
				{appointmentStore.appointments ? (
					<AppointmentList appointments={appointmentStore.appointments} />
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
}));

export default ListAppointments;
