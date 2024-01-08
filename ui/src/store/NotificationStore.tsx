import React, {createContext, useContext, useState} from 'react';
import {action, makeAutoObservable, observable} from "mobx"

export class NotificationStore {
    notification: {message: string, code: number} = {
        message: '',
        code: 0,
    };
    constructor() {
        makeAutoObservable(this, {
            notification: observable,
        })
    }

    addNotification = action((message: string, code: number) => {
        this.notification.message = message
        this.notification.code = code
    })

    clearNotification = action((id: number) => {
        this.notification.message = ''
        this.notification.code = 0
    })
}

export const NotificationContext = createContext<NotificationStore>(null!);

export const NotificationProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new NotificationStore());
    return <NotificationContext.Provider value={store}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext);