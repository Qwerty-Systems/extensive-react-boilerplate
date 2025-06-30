"use client";

export const ALLOW_ONBOARDING =
  process.env.NEXT_PUBLIC_ALLOW_ONBOARDING === "true";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const AUTH_REFRESH_URL = API_URL + "/v1/auth/refresh";
export const AUTH_ME_URL = API_URL + "/v1/auth/me";
export const AUTH_LOGOUT_URL = API_URL + "/v1/auth/logout";
