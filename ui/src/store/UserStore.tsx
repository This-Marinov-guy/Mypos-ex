import React, {createContext, useContext, useState} from 'react';
import {action, makeAutoObservable, observable} from "mobx"
import User from "../interface/UserInterface";

export class UserStore {
    user: User = {
        token: '',
        id: 0,
        roles: [],
    }
    login = action((user: User) => {
        this.user = user
        localStorage.setItem(
            "user", JSON.stringify(user)
        )
    })
    logout = action(() => {
        this.user = {
            token: '',
            id: 0,
            roles: [],
        }
        localStorage.removeItem("user");
    })

    constructor() {
        makeAutoObservable(this, {
            user: observable,
        })
    }
}

export const UserContext = createContext<UserStore>(null!);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [store] = useState(new UserStore());
    return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext);