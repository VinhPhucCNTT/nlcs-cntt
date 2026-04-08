export interface ILoginRequest {
  Email: string;
  Password: string;
}

export interface ILoginResponse {
  Email: string;
  Token: string;
}

export interface IRegisterRequest {
  Email: string;
  FullName: string;
  Username: string;
  Password: string;
}

export interface IRegisterResponse {
  Email: string;
}

export interface IIdentityError {
  Code: string;
  Description: string;
}