export type ThemeColors = {
    primary: string;
    accent: string;
    destructive: string;
  };
  
  export const colorblindPalettes: { [key: string]: ThemeColors } = {
    protanopia: { primary: '#56B4E9', accent: '#0072B2', destructive: '#D55E00' },
    deuteranopia: { primary: '#F0E442', accent: '#009E73', destructive: '#CC79A7' },
    tritanopia: { primary: '#FFB000', accent: '#000000', destructive: '#E69F00' },
  };