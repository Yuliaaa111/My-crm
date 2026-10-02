import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DARK_SCHEME_MEDIA_QUERY,
  DARK_THEME_MODE,
  LIGHT_THEME_MODE,
  THEME_STORAGE_KEY,
} from "@/core/constants/theme";
import type { ThemeModeType } from "@/core/types";

type ThemeStoreType = {
  mode: ThemeModeType;
  toggleMode: () => void;
};

const getSystemThemeMode = (): ThemeModeType => {
  const isDarkPreferred =
    typeof window.matchMedia === "function" &&
    window.matchMedia(DARK_SCHEME_MEDIA_QUERY).matches;

  return isDarkPreferred ? DARK_THEME_MODE : LIGHT_THEME_MODE;
};

export const useThemeStore = create<ThemeStoreType>()(
  persist(
    (set) => ({
      mode: getSystemThemeMode(),
      toggleMode: () =>
        set((state) => ({
          mode:
            state.mode === LIGHT_THEME_MODE
              ? DARK_THEME_MODE
              : LIGHT_THEME_MODE,
        })),
    }),
    { name: THEME_STORAGE_KEY },
  ),
);
