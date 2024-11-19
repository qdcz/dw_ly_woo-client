export function stringToArrayBuffer(str: string) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

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

export function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
