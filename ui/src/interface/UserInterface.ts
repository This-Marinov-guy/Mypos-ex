export interface User {
	token: string,
	id: number,
	roles: string[]
}

export interface UserRegisterValues {
	name: string,
	egn: string,
	email: string,
	password: string,
}

export interface UserLoginValues {
	token?: string,
	id?: number,
	roles?: string[],
	name?: string,
	egn?: string,
	email?: string,
	password?: string,
}
