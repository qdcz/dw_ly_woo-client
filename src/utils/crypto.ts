import { stringToArrayBuffer } from "./string";
import * as CryptoJS from "crypto-js";

// sql语句加密，对称后端的私钥
export const publicKeyStr = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJlvQVHJKyjAWqEkckekR4EYMv
pN2OgpTq6kIjJ/ZY23aU1E5i7uPodkAWc33yFLidndJxr7nXTU5ZQ64qB0d4ZOro
6oHSyonuV/TC2LB/ZMGsGpqUnpB0F3lhjke5p3O6tzOMD9YMr+1eYAlYWMKY0PmF
TujWz6eGHi77+YEwJwIDAQAB
-----END PUBLIC KEY-----`;

export const AESKey = `CZMa6O9v0oOtUoLa+VOeaakcUQKPfgz/zK0r9W58jQI=`;

/**
 * aes加密数据
 */
export function encryptAES(data) {
    const keyBytes = CryptoJS.enc.Base64.parse(AESKey);
    const ivBytes = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 4)); // 16 字节

    const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
export function decryptAES(data) {
    const keyBytes = CryptoJS.enc.Base64.parse(AESKey);
    const ivBytes = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 4)); // 16 字节

    // 将加密的 Base64 字符串转换为 WordArray
    const encryptedWordArray = CryptoJS.enc.Base64.parse(data);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedWordArray },
        keyBytes,
        {
            iv: ivBytes,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    // WordArray 转回utf8
    return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 将 PEM 格式的公钥转换为 ArrayBuffer 格式
 * @param pemString
 */
export const pemToArrayBuffer = (pemString: string) => {
    const stringBase64 = pemString.replace(/-/g, "+").replace(/_/g, "/");
    const pemInfo = window.atob(stringBase64);
    const buffer = new Uint8Array(pemInfo.length);
    for (let i = 0; i < pemInfo.length; i++) {
        buffer[i] = pemInfo.charCodeAt(i);
    }
    return buffer.buffer;
};

/**
 * 生成 128 位的 AES 密钥
 *
 * @returns {Promise<ArrayBuffer>} 返回生成的 AES 密钥，以 ArrayBuffer 格式表示
 */
export async function generateAESKey128(len: number = 128) {
    const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: len },
        true,
        ["encrypt", "decrypt"]
    );

    return await window.crypto.subtle.exportKey("raw", key);
}

// 用随机字节填充数组
export function padArray(arr: Uint8Array, block_size: number) {
    const n = arr.length;
    const pad_value = block_size - (n % block_size);
    const padded_arr = new Uint8Array(n + pad_value);
    padded_arr.set(arr);
    for (let i = n; i < n + pad_value; i++) {
        padded_arr[i] = Math.floor(Math.random() * 256);
    }
    return padded_arr;
}

/**
 * 获取加密的key
 * @param keyData
 */
export async function importSymmetricKey(keyData: any) {
    return await window.crypto.subtle.importKey(
        "raw",
        stringToArrayBuffer(keyData),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

// 将 Base64 编码的字符串转换为 ArrayBuffer 类型数据
export function base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const buffer = new ArrayBuffer(binaryString.length);
    const uint8View = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
        uint8View[i] = binaryString.charCodeAt(i);
    }
    return buffer;
    return new Uint8Array(
        atob(base64)
            .split("")
            .map((char) => char.charCodeAt(0))
    );
}

/**
 * 解密数据
 * @param key
 * @param iv
 * @param ciphertext
 */
export async function decryptSymmetricKey(
    key: CryptoKey,
    iv: ArrayBuffer,
    ciphertext: ArrayBuffer
) {
    const plaintext = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        ciphertext
    );
    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
}

/**
 * 加密数据
 * @param key
 * @param iv
 * @param ciphertext
 */
export async function encryptSymmetricKey(str: string, keyString: string) {
    /**
     * 
     * AES-CTR（Counter Mode）：将明文分成若干块，每块使用相同长度的密钥生成不同的计数器，再将计数器与该块异或得到密文块。
        CTR 使用简单的异或运算，性能较高，且可以并行加解密，适用于流加密。

        AES-CBC（Cipher Block Chaining）：将明文分组加密，每组密文与前一组密文进行异或后再进行加密，保证了密文之间的连续性。
        CBC 加密依赖于前一块的密文块，因此不能并行加解密。相比其他模式，CBC 更为安全且可靠。

        AES-GCM（Galois/Counter Mode）：将 GCM 输出拆分成两部分：用于加密的流密码（CTR）和用于完整性保护的验证码（MAC）。
        GCM 具有高效率、抗重放攻击、实现简单等优点，是一种高效而安全的加密方式。
    */

    // 将传入的明文数据转换为 Uint8Array 格式
    const data = new TextEncoder().encode(str);
    // 将数据填充到符合 AES 块长度的长度
    // const paddedBuffer = padArray(data, 16);
    // 生成随机的 12 字节 IV 向量  -- 解密需要用到这个iv
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // 定义加密算法的参数
    const algorithm = { name: "AES-GCM", iv: iv };
    // 导入密钥
    const key = await window.crypto.subtle.importKey(
        "raw",
        stringToArrayBuffer(keyString),
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );
    const encrypted = await window.crypto.subtle.encrypt(algorithm, key, data);
    return {
        encrypted,
        iv,
    };
}
