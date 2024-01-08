import React, {createContext, useContext, useState} from 'react';
import {action, makeAutoObservable, observable} from "mobx"
import User from "../interface/UserInterface";

export class UserStore {
    user: User = {};
    token: string = ''

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            token: observable,
        })
    }

    login = action((user: User) => {
        this.user = user
    })

    logout = action(() => {
        this.user = {}
    })
}

export const UserContext = createContext<UserStore>(null!);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new UserStore());
    return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext);