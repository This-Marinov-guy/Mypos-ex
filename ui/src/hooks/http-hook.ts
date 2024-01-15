import {useState} from "react";
import axios from 'axios';

export const useHttpClient = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const sendRequest = async (
		url: string,
		method: string = "GET",
		data: any = null,
		token: string = '',
	) => {
		setLoading(true);

		if (token) {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
		}

		try {
			const response = await axios.request({
				url: process.env.REACT_APP_API_URL + url,
				method,
				data,
			});

			return response.data;
		} catch (err: any) {
		} finally {
			setLoading(false);
		}
	}

	return {loading, sendRequest};
}
