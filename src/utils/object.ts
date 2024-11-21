export const deepClone = function (obj: any) {
    const result: any = obj instanceof Array ? [] : {};
    for (const i in obj) {
        result[i] = typeof obj[i] == "object" ? deepClone(obj[i]) : obj[i];
    }
    return result;
};

export const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let lastTime = 0;
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
        const now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            return func.apply(this as any, args)
        }
    }
}
