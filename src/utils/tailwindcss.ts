import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 切换主题
 * @param theme 需要切换的主题
 */
export const toggleDarkMode = (theme: string = 'light') => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const currentTheme = isDark ? 'dark' : 'light';
    const targetTheme = currentTheme === theme ?
        (theme === 'light' ? 'dark' : 'light') :
        theme;

    html.classList.toggle('dark', targetTheme === 'dark');
    localStorage.setItem('darkMode', targetTheme);
    return targetTheme;
}

/**
 * 初始化主题（可以放在应用启动时调用）
 */
export const initTheme = () => {
    const darkMode = localStorage.getItem('darkMode');
    if (!darkMode) {
        toggleDarkMode();
    }
    if (darkMode === 'dark') {
        document.documentElement.classList.add('dark');
    }
}