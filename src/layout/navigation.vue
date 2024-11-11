<template>
    <div class="nav" v-show="da_isShow">
        <div class="left">
            <el-icon class="collapseBtn" @click="handleCollapse">
                <Fold />
            </el-icon>
        </div>
        <div class="right">
            <ul>
                <!-- <li>
                    <router-link to="/dvtmp">dvtmp</router-link>
                </li> -->
                <div class="userInfo">
                    <img class="logo" src="https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100" />
                    <div class="name">{{ userName }}</div>
                </div>
                <li>
                    <div class="loginOut" @click="loginOut">退出登录</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { UserStore } from "../store";
import router from "../router";
import { computed, defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
    name: "Nav",
    props: ["onCollapse"],
    setup(prop, ctx) {
        const userStore = UserStore();
        let da_isShow = ref<boolean>(false);
        let da_collapse = ref(false);
        const loginOut = () => {
            userStore.logout();
            da_isShow.value = false;
            // ctx.emit("onCollapse", da_collapse.value);
            setTimeout(() => {
                router.push("login");
            }, 100);
        };

        const handleCollapse = () => {
            da_collapse.value = !da_collapse.value;
            ctx.emit("onCollapse", da_collapse.value);
        };

        const userName = computed(()=>{
            if(userStore.userInfo){
                return JSON.parse(userStore.userInfo).name
            }
            return "暂无数据"
        })
       
        watch(
            () => {
                userStore.$state.token;
            },
            async () => {
                da_isShow.value = Boolean(userStore.$state.token);
            },
            { deep: true, immediate: true }
        );
        onMounted(async () => {
            const isLogin = await userStore.isLogin();
            da_isShow.value = isLogin ? true : false;
        });
        return {
            da_collapse,
            da_isShow,
            userName,

            loginOut,
            handleCollapse,
            onMounted,
        };
    },
});
</script>

<style scoped lang="scss">
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

li {
    margin-right: 20px;
}

a {
    text-decoration: none;
    color: #333;
}

a:hover {
    color: blue;
}

.loginOut {
    cursor: pointer;
    user-select: none;
}

.loginOut:hover {
    transition: 0.7s;
    color: skyblue;
}

.right {
    padding: 2px 0;
    .userInfo{
        display: flex;
        flex-direction: row;
        padding: 0 8px;
        .logo{
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
}

.left {
    padding: 8px 0;

    .collapseBtn {
        cursor: pointer;
        padding: 10px;
        margin-top: -10px;

        &:hover {
            background-color: rgb(220, 223, 223);
        }
    }
}
</style>
