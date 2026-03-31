export type ThemeColors =  "amber" | "blue" | "cyan" | "emerald" | "fuchsia" | "green" | "indigo" | "lime" | "orange" | "pink" | "purple" | "red" | "rose" | "sky" | "teal" | "violet" | "yellow"
export interface ThemeColorStateParams{
    themeColor: ThemeColors;
    setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>> 
}