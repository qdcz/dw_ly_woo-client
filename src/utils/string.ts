/**
 * 字符串转数组缓冲区
 * @param str 需要转换的字符串
 * @returns 转换后的数组缓冲区
 */
export function stringToArrayBuffer(str: string) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

/**
 * 提取字符串中的键值对
 * @param str 需要提取的字符串
 * @returns 提取后的键值对
 */
export function extractKeyValuePairs(str: string) {
    const regex = /(\w+)\s*=\s*:(\w+)/g;
    const keyValuePairs = [];

    let match;
    while ((match = regex.exec(str))) {
        const key = match[1];
        const value = match[2];
        // @ts-ignore
        keyValuePairs.push({ key, value });
    }

    return keyValuePairs;
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 * @returns 生成的随机字符串
 */
export function generateString(length: number) {
    let characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    let string_id = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        string_id += characters.charAt(randomIndex);
    }
    return string_id;
}

/**
 * 生成UUID
 * @returns 生成的UUID
 */
export function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 模糊查询
 * @param input 输入的字符串
 * @param data 需要查询的数据
 * @returns 查询后的数据
 */
export function fuzzyQuery(input: string, data: string[]) {
    const words = input.split(/\s+/);
    const patterns: any = [];
    for (let i = 0; i < words.length; i++) {
        let pattern = new RegExp(words[i], "i");
        patterns.push(pattern);
    }

    const results: string[] = [];
    for (let i = 0; i < data.length; i++) {
        let matched = true;
        for (let j = 0; j < patterns.length; j++) {
            if (!patterns[j].test(data[i])) {
                matched = false;
                break;
            }
        }
        if (matched) {
            results.push(data[i]);
        }
    }

    return results;
}

/**
 * 将字符串转换为布尔值或数字
 * @param value 需要转换的字符串
 * @returns 转换后的布尔值或数字
 */
export function convertBooleanNumber(value: string) {
    return value === 'true' ? true : value === 'false' ? false : isNaN(Number(value)) ? value : Number(value);
}
