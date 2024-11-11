<template>
    <div class="container">
        <div class="card">

            <!-- 账号密码验证码登录 -->
            <template v-if="data.loginType == 'account'">
                <div class="card-header" @click="handleToggle">
                    <div :class="{ active: data.tabActive == 'verifyCode' }" data-type="verifyCode">验证码登录</div>
                    <div :class="{ active: data.tabActive != 'verifyCode' }" data-type="password">密码登录</div>
                </div>
                <div class="card-body">
                    <el-form :model="form" :rules="formRules" ref="formRef">
                        <div class="card-body-row">
                            <el-form-item prop="account">
                                <el-input :prefix-icon="UserFilled" class="card-body-row-account" v-model="form.account"
                                    placeholder="请输入账号" />
                            </el-form-item>
                        </div>
                        <div class="card-body-row">
                            <el-form-item prop="verifyCode" v-if="data.tabActive == 'verifyCode'">
                                <div class="flex flex-row">
                                    <el-input :prefix-icon="Lock" v-model="form.verifyCode" placeholder="请输入验证码" />
                                    <el-button id="getVerifyCode" type="primary" @click="getVerifyCode"
                                        :disabled="data.verifyCodeDisabled">{{ data.verifyCodeBtnContext
                                        }}</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item prop="password" v-else class="relative">
                                <el-input :prefix-icon="Lock" v-model="form.password" placeholder="请输入密码"
                                    show-password />
                                <div class="forgetPassword" @click="forgetPassword">忘记密码</div>
                            </el-form-item>
                        </div>
                        <div class="card-body-row">
                            <el-button id="login-btn" type="primary" @click="handleLogin">登录</el-button>
                        </div>
                    </el-form>
                </div>
            </template>

            <!-- 微信扫码登录 -->
            <template v-else>
                <div>
                    微信扫码安全登录
                </div>
            </template>
            <div class="card-cornerMark" @click="changeLoginType">
                <div class="card-cornerMark-qrcode" data-type="qrcode" v-if="data.loginType == 'account'" />
                <div class="card-cornerMark-account" data-type="account" v-else />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { UserStore } from "../store";
import { Lock, UserFilled } from '@element-plus/icons-vue'

import type { FormInstance } from "element-plus";

export default {
    setup() {

        let timers: number | null = null;

        const form = reactive({
            account: "",
            password: "",
            verifyCode: "",
        })

        const data = reactive({
            loginType: "account",
            verifyCodeBtnContext: "获取验证码",
            verifyCodeDisabled: false,
            tabActive: "password",
        });

        const formRef = ref<FormInstance | null>(null);

        // 表单验证规则
        const formRules = ref({
            account: [
                {
                    required: true,
                    message: "请输入用户名",
                    trigger: "change",
                },
            ],
            password: [
                {
                    required: true,
                    message: "请输入密码",
                    trigger: "change",
                },
            ],
            verifyCode: [
                {
                    required: true,
                    message: "请输入验证码  ",
                    trigger: "change",
                },
            ],
        });

        /**
         * tab切换
         * @param e 
         */
        const handleToggle = (e) => {
            const type = e.target.dataset.type;
            if (type) {
                data.tabActive = type;
            }
        };

        const changeLoginType = (e) => {
            const type = e.target.dataset.type;
            if (type) {
                data.loginType = type;
            }
        }

        /**
         * 页面登录
         */
        const handleLogin = async () => {
            const isValid = await validateEditForm(); // 验证编辑表单的数据
            if (isValid) {
                const userStore = UserStore();
                const userInfo = await userStore.login(
                    form.account,
                    form.password
                );
                console.log("用户信息:", userInfo);
            }
        }

        /**
         * 验证表单
         */
        const validateEditForm = () => {
            return new Promise((resolve) => {
                if (formRef.value) {
                    formRef.value.validate((valid) => {
                        resolve(valid);
                    });
                } else {
                    resolve(false);  // 如果 formRef.value 为 null，则返回 false 或其他默认值
                }
            });
        };




        /**
         * 发送短信验证码
         */
        const getVerifyCode = async () => {

            data.verifyCodeDisabled = true;
            data.verifyCodeBtnContext = "60s 后重发";

            if (timers) {
                clearInterval(timers);
                timers = null;
            }
            let time = 60;
            timers = setInterval(() => {
                time--;
                data.verifyCodeBtnContext = `${time}s 后重发`;
                if (time <= 0) {
                    clearInterval(timers as number);
                    data.verifyCodeBtnContext = "获取验证码";
                    data.verifyCodeDisabled = false;
                }
            }, 1000);

            // const userStore = UserStore();
            // const verifyCode = await userStore.getVerifyCode(form.account);
            // console.log("验证码:", verifyCode);
        }

        const forgetPassword = () => {
            console.log("忘记密码");
        }

        /**
         * 
         * @param event 监督键盘事件
         */
        function handleEnterKey(event) {
            if (event.key === "Enter") {
                handleLogin();
            }
        }


        onMounted(() => {
            window.addEventListener("keydown", handleEnterKey);
        });

        onBeforeUnmount(() => {
            window.removeEventListener("keydown", handleEnterKey);
        });

        return {
            form,
            data,

            Lock, UserFilled,


            formRef,
            formRules,

            handleLogin,
            handleToggle,
            changeLoginType,
            getVerifyCode,
            forgetPassword
        };
    },
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background: url('../assets/gateway.png') no-repeat center;
    background-size: 100% 100%;
    height: 100vh;
    width: 100%;

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 80px 40px 40px;
        box-shadow: 0 2px 10px 0 rgba(57, 106, 255, .2);
        border-radius: 10px;
        margin-left: 10%;
        width: 350px;

        &-header {
            cursor: pointer;
            justify-content: space-between;
            display: flex;
            position: relative;
            transition: .7s;

            div {
                position: relative; // 为了定位伪元素

                // &:hover::after {
                //     width: 60%; // 鼠标悬停时宽度变为 100%
                //     left: 0; // 调整位置，使其从左侧开始
                // }

                &::after {
                    content: '';
                    position: absolute;
                    top: 120%;
                    left: 0%; // 从中间开始
                    width: 0; // 初始宽度为 0
                    height: 2px; // 下划线的高度
                    background-color: rgb(16, 184, 245); // 下划线颜色
                    transition: width 0.3s ease, left 0.3s ease;
                }

                &.active {
                    transition: transform 0.3s ease;
                    transform: scale(1.1);

                    &::after {
                        width: 100%;
                        left: 0;
                    }
                }
            }
        }

        &-body {
            padding-top: 20px;
            display: flex;
            flex-direction: column;

            &-row {
                padding: 10px 0;
                flex: 1;

                & .forgetPassword {
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    bottom: -30px;
                    transition: .3s;

                    &:hover {
                        color: rgb(16, 184, 245);
                    }
                }

                & #login-btn {
                    width: 100%;
                }

                & #getVerifyCode {
                    margin-left: 10px;
                }
            }
        }

        &-cornerMark {
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;

            &-account {
                height: 80px;
                width: 80px;
                background: url(../assets/pc.svg);

                &:hover {
                    color: #000;
                }
            }

            &-qrcode {
                height: 80px;
                width: 80px;
                background: url(../assets/qrcode.svg);
            }
        }

    }
}
</style>
