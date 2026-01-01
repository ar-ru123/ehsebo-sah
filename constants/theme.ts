/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#1E88E5";
const tintColorDark = "#43A047";

export const Colors = {
  light: {
    text: "#212121",
    background: "#FAFAFA",
    tint: tintColorLight,
    icon: "#757575",
    tabIconDefault: "#757575",
    tabIconSelected: tintColorLight,
    card: "#FFFFFF",
    border: "#E0E0E0",
    success: "#43A047",
    warning: "#FB8C00",
    danger: "#E53935",
    textSecondary: "#757575",
  },
  dark: {
    text: "#FFFFFF",
    background: "#121212",
    tint: tintColorDark,
    icon: "#B0B0B0",
    tabIconDefault: "#B0B0B0",
    tabIconSelected: tintColorDark,
    card: "#1E1E1E",
    border: "#2C2C2C",
    success: "#66BB6A",
    warning: "#FFA726",
    danger: "#EF5350",
    textSecondary: "#B0B0B0",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
