import { Tailwind, TailwindProps } from "@react-email/components"

export function TailwindProvider({ children }: TailwindProps) {
    return (
        <Tailwind config={{
            darkMode: "class",
            theme: {
                extend: {
                    fontFamily: {
                        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
                    },
                    colors: {
                        brand: "#EE7623",
                        background: "#ffffff",
                        foreground: "#1c1c1c",

                        card: {
                            DEFAULT: "#ffffff",
                            foreground: "#1c1c1c",
                        },

                        popover: {
                            DEFAULT: "#ffffff",
                            foreground: "#1c1c1c",
                        },

                        primary: {
                            DEFAULT: "#EE7623",
                            foreground: "#FFF7ED",
                        },

                        secondary: {
                            DEFAULT: "#F5F5F5",
                            foreground: "#2A2A2A",
                        },

                        muted: {
                            DEFAULT: "#F5F5F5",
                            foreground: "#6B7280",
                        },

                        accent: {
                            DEFAULT: "#EE7623",
                            foreground: "#FFF7ED",
                        },

                        destructive: {
                            DEFAULT: "#DC2626",
                        },

                        border: "#E5E7EB",
                        input: "#E5E7EB",
                        ring: "#9CA3AF",

                        chart: {
                            1: "#FACC15",
                            2: "#FB923C",
                            3: "#EE7623",
                            4: "#EA580C",
                            5: "#C2410C",
                        },
                    },
                    borderRadius: {
                        sm: "4px",
                        md: "8px",
                        lg: "10px",
                        xl: "14px",
                    },

                    boxShadow: {
                        sm: "0 1px 2px rgba(0,0,0,0.05)",
                        DEFAULT: "0 2px 4px rgba(0,0,0,0.05)",
                        md: "0 4px 6px rgba(0,0,0,0.05)",
                        lg: "0 8px 10px rgba(0,0,0,0.05)",
                    },
                },
            },
        }}>
            {children}
        </Tailwind>
    )
}