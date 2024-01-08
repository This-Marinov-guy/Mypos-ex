import React, {createContext, useContext, useState} from 'react';
import {action, makeAutoObservable, observable} from "mobx"
import User from "../interface/UserInterface";

export class UserStore {
    token: string = ''

    constructor() {
        makeAutoObservable(this, {
            token: observable,
        })
    }

    login = action((token:string) => {
        this.token = token
        localStorage.setItem("token", token);

    })

    logout = action(() => {
        this.token = ''
        localStorage.removeItem("token");

    })
}

export const UserContext = createContext<UserStore>(null!);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new UserStore());
    return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext);