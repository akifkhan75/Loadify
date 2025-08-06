// First, define your font families
const fontFamilies = {
  body: 'Inter-Regular',
  heading: 'Inter-Bold',
  arabic: 'Cairo-Regular',
  arabicBold: 'Cairo-Bold',
};

// Define common styles with type safety
const common = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    full: 999,
  },
  fontFamily: fontFamilies,
  // Add font weights for better type safety
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  fonts: {
    regular: { fontFamily: fontFamilies.body || 'System', fontWeight: '400' },
    medium: { fontFamily: fontFamilies.body || 'System', fontWeight: '500' },
    light: { fontFamily: fontFamilies.body || 'System', fontWeight: '300' },
    thin: { fontFamily: fontFamilies.body || 'System', fontWeight: '100' },
  },
  
  // Add font sizes for consistency
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  }
};

// Light theme
const light = {
  ...common,
  colors: {
    primary: '#000000',
    background: '#F4F4F5', // zinc-100
    card: '#FFFFFF',
    text: '#18181B', // zinc-900
    textSecondary: '#71717A', // zinc-500
    border: '#E4E4E7', // zinc-200
    notification: '#DC2626', // red-600
    success: '#16A34A', // green-600
    brand: '#1565c0'
  },
  // Add theme-specific font variants if needed
  textVariants: {
    body: {
      fontFamily: fontFamilies.body,
      fontSize: common.fontSizes.base,
      lineHeight: 24,
    },
    heading: {
      fontFamily: fontFamilies.heading,
      fontSize: common.fontSizes['2xl'],
      lineHeight: 32,
    }
  }
};

// Dark theme (extends light with type safety)
const dark: typeof light = {
  ...common,
  colors: {
    primary: '#FFFFFF',
    background: '#18181B', // zinc-900
    card: '#27272A', // zinc-800
    text: '#F4F4F5', // zinc-100
    textSecondary: '#A1A1AA', // zinc-400
    border: '#3F3F46', // zinc-700
    notification: '#F87171', // red-400
    success: '#4ADE80', // green-400
    brand: '#1565c0'
  },
  // Mirror text variants from light theme
  textVariants: light.textVariants
};

export type Theme = typeof light;
export const themes = { light, dark };

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}