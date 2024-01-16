import React from "react";
import {inject, observer} from 'mobx-react';

const Error = inject('rootStore')(observer(
	({rootStore}: any) => {

		const {notificationStore} = rootStore;

		const handleRemove = () => {
			notificationStore.removeError()
		}

		return (
			<div
				className="mb-4 border rounded-md shadow-sm border-red-200 text-red-500 bg-red-50 p-2 m-2 flex justify-between items-center"
			>
				<h3 className='mr-3 font-bold'>{notificationStore.error.code}</h3>
				<p>{notificationStore.error.message}</p>
				<button onClick={handleRemove} className="nav-link">Remove</button>
			</div>
		);
	}));

export default Error;
