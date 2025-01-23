import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6154',
    accent: '#4B587C',
    background: '#f9f9f9',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
    disabled: '#787878',
    placeholder: '#787878',
    backdrop: 'rgba(0, 0, 0, 0.5)'
  },
  roundness: 8
}; 