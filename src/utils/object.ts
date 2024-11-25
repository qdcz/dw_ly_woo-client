/**
 * 深拷贝
 * @param obj 需要深拷贝的对象
 * @returns 深拷贝后的对象
 */
export const deepClone = function (obj: any) {
    const result: any = obj instanceof Array ? [] : {};
    for (const i in obj) {
        result[i] = typeof obj[i] == "object" ? deepClone(obj[i]) : obj[i];
    }
    return result;
};

/**
 * 节流
 * @param func 需要节流的函数
 * @param delay 节流时间
 * @returns 节流后的函数
 */
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
