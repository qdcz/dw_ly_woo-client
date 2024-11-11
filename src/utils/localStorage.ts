const EXPIRE_KEY_SUFFIX = "_expiresIn";

export const ly_LocalStorage = {
    set(key: string, value: string, expire?: number) {
        localStorage.setItem(key, JSON.stringify(value));
        if (expire) {
            const expireTime = new Date().getTime() + expire;
            localStorage.setItem(
                key + EXPIRE_KEY_SUFFIX,
                JSON.stringify(expireTime)
            );
        }
    },
    get(key: string) {
        const expireTime = JSON.parse(
            localStorage.getItem(key + EXPIRE_KEY_SUFFIX) as string
        );
        if (expireTime && new Date().getTime() > expireTime) {
            this.remove(key);
            return null;
        }
        return JSON.parse(localStorage.getItem(key) as string);
    },
    remove(key: string) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + EXPIRE_KEY_SUFFIX);
    },
};
