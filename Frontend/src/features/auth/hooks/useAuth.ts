import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { login, register } from "../api/authApi";
import type {
  IIdentityError,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from "../types";

export const useLogin = () =>
  useMutation<ILoginResponse, AxiosError, ILoginRequest>({
    mutationFn: login,
  });

export const useRegister = () =>
  useMutation<IRegisterResponse, AxiosError<IIdentityError[]>, IRegisterRequest>(
    {
      mutationFn: register,
    }
  );
