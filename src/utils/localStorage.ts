const EXPIRE_KEY_SUFFIX = "_expiresIn";

/**
 * localStorage 操作
 */
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
    /**
     * 获取localStorage
     * @param key 需要获取的key
     * @returns 获取到的值
     */
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
    /**
     * 删除localStorage
     * @param key 需要删除的key
     */
    remove(key: string) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + EXPIRE_KEY_SUFFIX);
    },
};
