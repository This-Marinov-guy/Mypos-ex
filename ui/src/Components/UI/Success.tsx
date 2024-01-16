import React from "react";
import {inject, observer} from 'mobx-react';

const Success = inject('rootStore')(observer(
	({rootStore}: any) => {
		const {notificationStore} = rootStore;

		const handleRemove = () => {
			notificationStore.removeSuccess()
		}

		return (
			<div
				className="mb-4 border rounded-md shadow-sm border-green-200 text-green-500 bg-green-50 p-2 m-2 flex justify-between items-center"
			>
				<h3 className='mr-3 font-bold'>{notificationStore.success.code}</h3>
				<p>{notificationStore.success.message}</p>
				<button onClick={handleRemove} className="btn-auth">X</button>
			</div>
		);
	}));

export default Success;
