import React, {createContext, useContext, useState} from 'react';
import {action, makeAutoObservable, observable} from "mobx"

export class NotificationStore {
    success: {message: string, code: number} = {
        message: '',
        code: 200,
    };

    error: {message: string, code: number} = {
        message: '',
        code: 500,
    };
    constructor() {
        makeAutoObservable(this, {
            success: observable,
        })
    }

    addSuccess = action((message: string, code: number) => {
        this.success.message = message
        this.success.code = code
    })

    clearSuccess = action(() => {
        this.success.message = ''
        this.success.code = 0
    })

    addError = action((message: string, code: number) => {
        this.error.message = message
        this.error.code = code
    })

    clearError = action(() => {
        this.error.message = ''
        this.error.code = 0
    })
}

export const NotificationContext = createContext<NotificationStore>(null!);

export const NotificationProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new NotificationStore());
    return <NotificationContext.Provider value={store}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext);