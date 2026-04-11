/**
 * DSA Learning App — Design System
 * Premium dark theme inspired by Duolingo's visual language
 */

import { Platform } from 'react-native';

export const AppColors = {
  // Core brand
  primary: '#58CC02',
  primaryDark: '#46A302',
  primaryLight: '#89E219',

  // Accents
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  orange: '#FF9600',
  orangeDark: '#E08600',
  red: '#FF4B4B',
  redDark: '#EA2B2B',
  purple: '#CE82FF',
  purpleDark: '#B366E0',
  gold: '#FFC800',
  pink: '#FF86D0',

  // Backgrounds
  bg: '#0D1117',
  bgCard: '#161B22',
  bgElevated: '#1C2333',
  bgInput: '#21262D',

  // Borders
  border: '#30363D',
  borderLight: '#3D444D',

  // Text
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  textInverse: '#0D1117',

  // Semantic
  success: '#58CC02',
  warning: '#FF9600',
  error: '#FF4B4B',
  info: '#1CB0F6',

  // Overlay
  overlay: 'rgba(1, 4, 9, 0.75)',
};

// Backward compat
const tintColorLight = '#58CC02';
const tintColorDark = '#58CC02';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppColors.textPrimary,
    background: AppColors.bg,
    tint: tintColorDark,
    icon: AppColors.textMuted,
    tabIconDefault: AppColors.textMuted,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
