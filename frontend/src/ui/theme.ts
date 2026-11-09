import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';
import { Appearance, type ColorSchemeName, type TextStyle } from 'react-native';

export const lightColors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9F9',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabActive: '#FCE5DD',
  ink: '#0F1419',
  muted: '#536471',
  faint: '#8B98A5',
  line: '#EFF3F4',
  accent: '#E4531D',
  accentSoft: '#FCE5DD',
  success: '#00BA7C',
  successSoft: '#DEF7EC',
  warn: '#F59E0B',
  warnSoft: '#FEF3C7',
  danger: '#F4212E',
  dangerSoft: '#FEE2E2',
  onInk: '#FFFFFF',
  onInkSecondary: '#D1D5DB',
};

export type ColorName = keyof typeof lightColors;
export type Palette = Record<ColorName, string>;

export const darkColors: Palette = {
  bg: '#000000',
  surface: '#16181C',
  surfaceAlt: '#1E2732',
  card: '#16181C',
  tabBar: '#000000',
  tabActive: '#2A1912',
  ink: '#FFFFFF',
  muted: '#9CA3AF',
  faint: '#71767B',
  line: '#2F3336',
  accent: '#E4531D',
  accentSoft: '#3A1D12',
  success: '#00BA7C',
  successSoft: '#06281E',
  warn: '#F59E0B',
  warnSoft: '#2E230E',
  danger: '#F4212E',
  dangerSoft: '#331614',
  onInk: '#000000',
  onInkSecondary: '#4A4543',
};

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'cashbank_theme_preference';

let currentThemeMode: ThemeMode = 'dark';
let currentSystemScheme: ColorSchemeName | null = Appearance.getColorScheme();

function computeIsDark(mode: ThemeMode, sysScheme: ColorSchemeName | null | undefined): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return sysScheme === 'dark';
}

export let isDark = computeIsDark(currentThemeMode, currentSystemScheme);

export function getActiveColors(): Palette {
  return isDark ? darkColors : lightColors;
}

export function getThemeMode(): ThemeMode {
  return currentThemeMode;
}

export const colors: Palette = new Proxy({} as Palette, {
  get(_target, prop: string) {
    const palette = getActiveColors();
    return (palette as any)[prop];
  },
});

type ThemeListener = () => void;
const themeListeners = new Set<ThemeListener>();

function notifyThemeListeners() {
  themeListeners.forEach((l) => l());
}

export async function setThemeMode(mode: ThemeMode) {
  currentThemeMode = mode;
  isDark = computeIsDark(currentThemeMode, currentSystemScheme);
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
  notifyThemeListeners();
}

export async function hydrateTheme(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      currentThemeMode = saved;
    }
  } catch {}
  currentSystemScheme = Appearance.getColorScheme();
  isDark = computeIsDark(currentThemeMode, currentSystemScheme);
  notifyThemeListeners();
}

Appearance.addChangeListener(({ colorScheme }) => {
  currentSystemScheme = colorScheme;
  isDark = computeIsDark(currentThemeMode, currentSystemScheme);
  notifyThemeListeners();
});

interface ThemeContextValue {
  isDark: boolean;
  colors: Palette;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark,
  colors: getActiveColors(),
  mode: currentThemeMode,
  setMode: setThemeMode,
  toggleTheme: async () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    hydrateTheme();
    const listener = () => setTick((t) => t + 1);
    themeListeners.add(listener);
    return () => {
      themeListeners.delete(listener);
    };
  }, []);

  const toggleTheme = async () => {
    const next = isDark ? 'light' : 'dark';
    await setThemeMode(next);
  };

  const activeColors = getActiveColors();

  const value: ThemeContextValue = {
    isDark,
    colors: activeColors,
    mode: currentThemeMode,
    setMode: setThemeMode,
    toggleTheme,
  };

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const gutter = space.lg;
export const radius = { sm: 10, md: 14, lg: 18, xl: 26, pill: 999 } as const;

export const fonts = {
  light: 'System',
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const type = {
  display: { fontSize: 30, lineHeight: 36, letterSpacing: -0.8, fontWeight: '800' },
  title: { fontSize: 24, lineHeight: 30, letterSpacing: -0.6, fontWeight: '800' },
  heading: { fontSize: 17, lineHeight: 22, letterSpacing: -0.3, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 17, fontWeight: '400' },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.9 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

export const defaultColor: Record<TypeVariant, ColorName> = {
  display: 'ink',
  title: 'ink',
  heading: 'ink',
  body: 'muted',
  label: 'ink',
  caption: 'muted',
  kicker: 'accent',
};
