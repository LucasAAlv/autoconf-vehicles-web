import { apiClient, ensureCsrfCookie } from "../../../shared/api/client";
import type { LoginPayload, RegisterPayload, User } from "../types";

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}

export async function login(payload: LoginPayload): Promise<User> {
  await ensureCsrfCookie();
  const { data } = await apiClient.post<User>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<User> {
  await ensureCsrfCookie();
  const { data } = await apiClient.post<User>("/auth/register", payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
