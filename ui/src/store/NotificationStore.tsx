import {action, computed, makeAutoObservable, observable} from "mobx"

export default class NotificationStore {
	rootStore;
	@observable success: { message: string, code: number } = {
		message: '',
		code:    200,
	};

	@observable error: { message: string, code: number } = {
		message: '',
		code:    500,
	};

	constructor(root: any) {
		makeAutoObservable(this)
		this.rootStore = root
	}

	@computed get hasSuccess() {
		return !!this.success.message;
	}

	@computed get hasError() {
		return !!this.error.message;
	}

	@action addSuccess(message: string, code: number) {
		this.success.message = message
		this.success.code = code
	}

	@action addError(message: string, code: number) {
		this.error.message = message
		this.error.code = code
	}

	@action removeSuccess() {
		this.success.message = ''
		this.success.code = 0
	}

	@action removeError() {
		this.error.message = ''
		this.error.code = 0
	}

}
