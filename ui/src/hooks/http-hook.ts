import {useCallback, useState} from "react";
import axios from 'axios';

export const useHttpClient = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<{
        code: number,
        message: string
    }>({
        code: 0,
        message: ''
    })

    const sendRequest = useCallback(
        async (
            url: string,
            method: string = "GET",
            data: BodyInit | null = null,
        ) => {
            setLoading(true);

            try {
                const response = await axios.request({
                    url: process.env.REACT_APP_API_URL + url,
                    method,
                    data,
                });

                const responseData = response.data;
                return responseData;
            } catch (err: any) {
                setError({
                    code: err.code,
                    message: err.message
                })
                setTimeout(()=> setError({
                    code: 0,
                    message: ''
                }), 6000)
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {loading, sendRequest, error};
};
