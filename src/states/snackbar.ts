"use client";

import { useMemo } from "react";

// @third-party
import useSWR, { mutate } from "swr";

// Types
interface SnackbarAlert {
  color: "primary" | "secondary" | "error" | "info" | "success" | string;
  variant: "filled" | "outlined" | "standard" | string;
}

type TransitionType = "Zoom" | "Fade" | "Grow" | "Slide" | string;

interface SnackbarState {
  action: boolean;
  open: boolean;
  message: string;
  anchorOrigin: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  variant: string;
  alert: SnackbarAlert;
  transition: TransitionType;
  close: boolean;
  actionButton: boolean;
  maxStack: number;
  dense: boolean;
  iconVariant: string;
  hideIconVariant: boolean;
}

const endpoints = {
  key: "snackbar",
};

const initialState: SnackbarState = {
  action: false,
  open: false,
  message: "Note archived",
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  variant: "default",
  alert: {
    color: "primary",
    variant: "filled",
  },
  transition: "Zoom",
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: "useemojis",
  hideIconVariant: false,
};

function useGetSnackbar(): { snackbar: SnackbarState | undefined } {
  const { data } = useSWR<SnackbarState>(endpoints.key, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(() => ({ snackbar: data }), [data]);

  return memoizedValue;
}

function openSnackbar(snackbar: Partial<SnackbarState>) {
  mutate<SnackbarState>(
    endpoints.key,
    (currentSnackbar?: SnackbarState) => {
      const safeSnackbar = currentSnackbar ?? initialState;
      return {
        ...safeSnackbar,
        action: snackbar.action ?? safeSnackbar.action,
        open: snackbar.open ?? safeSnackbar.open,
        message: snackbar.message ?? safeSnackbar.message,
        anchorOrigin: snackbar.anchorOrigin ?? safeSnackbar.anchorOrigin,
        variant: snackbar.variant ?? safeSnackbar.variant,
        alert: {
          color: snackbar.alert?.color ?? safeSnackbar.alert.color,
          variant: snackbar.alert?.variant ?? safeSnackbar.alert.variant,
        },
        transition: snackbar.transition ?? safeSnackbar.transition,
        close: snackbar.close ?? safeSnackbar.close,
        actionButton: snackbar.actionButton ?? safeSnackbar.actionButton,
        maxStack: snackbar.maxStack ?? safeSnackbar.maxStack,
        dense: snackbar.dense ?? safeSnackbar.dense,
        iconVariant: snackbar.iconVariant ?? safeSnackbar.iconVariant,
        hideIconVariant:
          snackbar.hideIconVariant ?? safeSnackbar.hideIconVariant,
      };
    },
    false
  );
}

function closeSnackbar() {
  mutate<SnackbarState>(
    endpoints.key,
    (currentSnackbar: any) => ({
      ...(currentSnackbar || initialState),
      open: false,
    }),
    false
  );
}

function handlerIncrease(maxStack: number) {
  mutate<SnackbarState>(
    endpoints.key,
    (currentSnackbar: any) => ({
      ...(currentSnackbar || initialState),
      maxStack,
    }),
    false
  );
}

function handlerDense(dense: boolean) {
  mutate<SnackbarState>(
    endpoints.key,
    (currentSnackbar: any) => ({
      ...(currentSnackbar || initialState),
      dense,
    }),
    false
  );
}

function handlerIconVariants(iconVariant: string) {
  mutate<SnackbarState>(
    endpoints.key,
    (currentSnackbar: any) => ({
      ...(currentSnackbar || initialState),
      iconVariant,
      hideIconVariant: iconVariant === "hide",
    }),
    false
  );
}

export {
  useGetSnackbar,
  openSnackbar,
  closeSnackbar,
  handlerIncrease,
  handlerDense,
  handlerIconVariants,
};
