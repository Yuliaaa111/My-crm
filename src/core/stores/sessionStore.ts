import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SESSION_STORAGE_KEY } from "@/core/constants/session";
import type { SessionType, SessionUserType } from "@/core/types";
import { isTokenExpired } from "@/core/utils/jwt";

type SessionStoreType = {
  accessToken: string | null;
  user: SessionUserType | null;
  startSession: (session: SessionType) => void;
  logout: () => void;
};

export const useSessionStore = create<SessionStoreType>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      startSession: ({ accessToken, user }) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: ({ accessToken, user }) => ({ accessToken, user }),
      // A token restored from storage may have expired while the tab was
      // closed; dropping it here keeps protected pages from flashing
      // before PrivateRoute gets a chance to check it.
      onRehydrateStorage: () => (restoredState) => {
        if (
          restoredState?.accessToken &&
          isTokenExpired(restoredState.accessToken)
        ) {
          restoredState.logout();
        }
      },
    },
  ),
);
