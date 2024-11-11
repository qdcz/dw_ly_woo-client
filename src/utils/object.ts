export const deepClone = function (obj: any) {
    const result:any = obj instanceof Array ? [] : {};
    for (const i in obj) {
        result[i] = typeof obj[i] == "object" ? deepClone(obj[i]) : obj[i];
    }
    return result;
};
