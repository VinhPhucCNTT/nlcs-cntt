export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  email: string;
  token: string;
}

export interface IRegisterRequest {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

export interface IRegisterResponse {
  email: string;
}

export interface IIdentityError {
  code: string;
  description: string;
}