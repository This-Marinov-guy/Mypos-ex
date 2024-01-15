import {action, computed, makeAutoObservable, observable} from "mobx"
import User from "../interface/UserInterface";

export default class UserStore {
	rootStore;
	@observable token: string = '';
	@observable id: number = 0;
	@observable roles: string[] = [];

	constructor(root: any) {
		makeAutoObservable(this)
		this.rootStore = root
	}

	@computed get isAdmin() {
		return this.roles.includes('ROLE_ADMIN')
	}

	@computed get authToken() {
		return this.token || null
	}

	@action login(user: User) {
		this.token = user.token;
		this.id = user.id;
		this.roles = user.roles;

		localStorage.setItem(
			"user", JSON.stringify(user)
		)
	}

	@action logout() {
		this.token = '';
		this.id = 0;
		this.roles = [];

		localStorage.removeItem("user");
	}
}
