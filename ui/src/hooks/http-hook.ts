import {useCallback, useState} from "react";
import axios from 'axios';
import {useNotification} from "../store/NotificationStore";

export const useHttpClient = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const {addError, clearError} = useNotification();

    const sendRequest = async (
            url: string,
            method: string = "GET",
            data: any = null,
        ) => {
            setLoading(true);

            try {
                const response = await axios.request({
                    url: process.env.REACT_APP_API_URL + url,
                    method,
                    data,
                });

                const responseData = response.data;

                if (responseData.error) {
                    addError(
                        responseData.error,
                        responseData.code,
                    )
                    setTimeout(()=> clearError(), 6000)
                    return
                }

                return responseData;
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        }

    return {loading, sendRequest};
};
