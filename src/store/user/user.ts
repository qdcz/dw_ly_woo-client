import { defineStore } from "pinia";
import { AES_KEY_128 } from "../../crypto/index";
import {
    base64ToArrayBuffer,
    decryptSymmetricKey,
    encryptSymmetricKey,
    importSymmetricKey,
    ly_LocalStorage,
} from "../../utils";
import { login, UserInfo } from "../../api";
import { ElMessage } from "element-plus";
import router from "../../router";

export const UserStore = defineStore({
    id: "user",
    state: () => ({
        token: "",
        userInfo: "",
    }),
    actions: {
        SETTOkEN(token: string) {
            this.token = token;
            ly_LocalStorage.set("token", token);
        },
        GETTOKEN() {
            return this.token || ly_LocalStorage.get("token");
        },
        /**
         * 存储用户信息（vueStore + localStore）
         */
        async SETUSERINFO(userInfo: string) {
            this.userInfo = userInfo;
            const { encrypted, iv } = await encryptSymmetricKey(
                userInfo,
                AES_KEY_128
            );
            // 将加密后的密文和 IV 向量转换为 Base64 编码格式
            const encryptedText = btoa(
                String.fromCharCode(...new Uint8Array(encrypted))
            );
            const ivText = btoa(String.fromCharCode(...iv));
            ly_LocalStorage.set(
                "userInfo",
                ivText + "___" + encryptedText,
                1000 * 60 * 60
            );
        },
        /**
         * 从本地存储中获取用户信息
         */
        async getUserInfoForLocationStore() {
            const storeData = ly_LocalStorage.get("userInfo");
            if (!storeData) return null;
            const iv = storeData.split("___")[0];
            const encryptedData = storeData.split("___")[1];
            const data = await decryptSymmetricKey(
                await importSymmetricKey(AES_KEY_128),
                base64ToArrayBuffer(iv),
                base64ToArrayBuffer(encryptedData)
            );
            this.userInfo = data;
            return data;
        },
        /**
         * 获取用户信息
         */
        async GETUSERINFO() {
            if (this.userInfo) {
                return this.userInfo;
            } else {
                return await this.getUserInfoForLocationStore();
            }
        },
        async login(
            username: string,
            password: string
        ): Promise<string | null> {
            const {
                code,
                data: { token, user },
            }: any = await login({ account: username, password });
            if (code == 200) {
                ElMessage.success("登录成功！");
                this.SETTOkEN(token.accessToken);
                await this.getUserInfo(user.id, username);
                router.push("/");
                return JSON.stringify(user);
            }
            return null;
        },
        async getUserInfo(
            userId: string,
            username: string
        ): Promise<string | null> {
            const { code, data }: any = await UserInfo(userId);
            if (code == 200) {
                await this.SETUSERINFO(
                    JSON.stringify({
                        name: data.name,
                        username,
                        avatar: data.avatar,
                        id: data.id,
                    })
                );
                // todo  根据角色获取路由
                console.log("todo:根据角色获取路由", data);
                return data;
            }
            return null;
        },
        logout() {
            this.token = "";
            ly_LocalStorage.remove("token");
            this.userInfo = "";
            ly_LocalStorage.remove("userInfo");
            router.push("/login");
        },
        async isLogin() {
            const val = await this.GETUSERINFO();
            return val;
        },
    },
});
