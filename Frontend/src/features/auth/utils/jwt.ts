import { jwtDecode } from "jwt-decode";

interface IJwtPayload {
  email: string;
  role?: string | string[];
}

export const parseJwt = (token: string) => {
  const payload = jwtDecode<IJwtPayload>(token);

  return {
    email: payload.email,
    roles: Array.isArray(payload.role)
      ? payload.role
      : payload.role
        ? [payload.role]
        : [],
  };
};
