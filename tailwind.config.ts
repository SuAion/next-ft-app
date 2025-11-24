import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // 添加自定义字体配置
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'Arial', 'sans-serif'],
        'noto-sans-jp': ['var(--font-noto-sans-jp)', 'Arial', 'sans-serif'],
        'sans': ['var(--font-poppins)', 'var(--font-noto-sans-jp)', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
