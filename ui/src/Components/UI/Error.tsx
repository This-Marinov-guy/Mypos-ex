import React from "react";

const Error = (props: { code: number, message: string }) => {

    return (
        <div
            className="mb-4 border rounded-md shadow-sm border-red-200 text-red-500 bg-red-50 p-2 m-2"
        >
            <h3 className='mr-3 font-bold'>{props.code}</h3>
            <p>{props.message}</p>
        </div>
    );
};

export default Error;
