import React from "react";

const Success = (props: { code: number, message: string }) => {
    return (
        <div
            className="mb-4 border rounded-md shadow-sm border-green-200 text-green-500 bg-green-50 p-2 m-2"
        >
            <h3 className='mr-3 font-bold'>{props.code}</h3>
            <p>{props.message}</p>
        </div>
    );
};

export default Success;
