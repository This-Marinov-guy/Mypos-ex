import {action, computed, makeAutoObservable, observable} from "mobx"
import {logInApi} from "../api/user";
import {UserLoginValues} from "../interface/UserInterface";

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

	@action
	async login(values: UserLoginValues) {
		if (!values.token) {
			try {
				const responseData = await logInApi(values);
				if (responseData.token) {
					this.token = responseData.token;
					this.id = responseData.id;
					this.roles = responseData.roles;
				}
				localStorage.setItem(
					"user", JSON.stringify({token: responseData.token, id: responseData.id, roles: responseData.roles})
				)
				return responseData
			} catch (err) {
			}
		} else {
			this.token = values.token;
			this.id = values.id!;
			this.roles = values.roles!;

			localStorage.setItem(
				"user", JSON.stringify(values)
			)
		}
	}

	@action logout() {
		this.token = '';
		this.id = 0;
		this.roles = [];

		localStorage.removeItem("user");
	}
}
