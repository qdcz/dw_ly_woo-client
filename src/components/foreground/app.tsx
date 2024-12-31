import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";

import { UserStore, LayoutStore, OthereStore } from "../../store";

import UserMenu from "./dialog/userMenu.tsx";

import SettingsIcon from "./icon/Settings.tsx";
import ProjectIcon from "./icon/Project.tsx";
import DataBaseIcon from "./icon/DataBase.tsx";
import APIIcon from "./icon/API.tsx";
import FoldIcon from "./icon/Fold.tsx";
import CloseIcon from "./icon/Close.tsx";
import { LEFT_SIDEBAR_WIDTH } from "@/constants";
import { cn, throttle } from "@/utils/index";
import * as APIs from '../../api/index.ts';


export default defineComponent({
    components: {
        UserMenu,
        SettingsIcon,
        ProjectIcon,
        DataBaseIcon,
        APIIcon,
        FoldIcon,
        CloseIcon
    },
    setup() {
        const userStore = UserStore();
        const layoutStore = LayoutStore();
        const othereStore = OthereStore();

        const avatar = computed(() => {
            if (userStore.userInfo) {
                return convertMinioImage(JSON.parse(userStore.userInfo).avatar)
            }
            return null
        })
        const nickName = computed(() => {
            if (userStore.userInfo) {
                return JSON.parse(userStore.userInfo).name;
            }
            return "暂无数据";
        });

        const userName = computed(() => {
            if (userStore.userInfo) {
                return JSON.parse(userStore.userInfo).username;
            }
            return "暂无数据";
        });

        const sidebarIsOpen = ref(false);
        const userMenuIsOpen = ref(false);

        const menuList = ref([
            {
                name: "API",
                icon: <APIIcon />,
                path: "/static/admin/#/API",
            },
            {
                name: "Old_API",
                icon: <APIIcon />,
                path: "/static/admin/#/APIManager",
            },
            {
                name: "Old_FunctionManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/FunctionManager",
            },
            {
                name: "Old_ActiveKeyManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/ActiveKeyManager",
            },
            {
                name: "Old_LogManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/logManager",
            },
            {
                name: "Old_MockManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/MockManager",
            },
            {
                name: "Old_SqlDataUnit",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/SqlDataUnit",
            },
            {
                name: "Old_ProjectManager",
                icon: <ProjectIcon />,
                path: "/static/admin/#/ProjectManager",
            },
            {
                name: "Old_DataBaseManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/dataSource",
            },
            {
                name: "Old_UserManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/userManager",
            },
            {
                name: "Old_RoleManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/roleManager",
            },
            {
                name: "Old_TacticsManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/TacticsManager",
            },
            {
                name: "Old_SystemAPIManager",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/SystemAPIManager",
            },
            {
                name: "Settings",
                icon: <SettingsIcon />,
                path: "/static/admin/#/Settings",
            },
        ]);

        const toggleSidebar = () => {
            sidebarIsOpen.value = !sidebarIsOpen.value;
        };

        const toggleUserMenu = () => {
            userMenuIsOpen.value = !userMenuIsOpen.value;
        };

        const convertMinioImage = (url: string) => {
            const imageCache = othereStore.getImageCache();
            if (imageCache.get(url)) {
                return imageCache.get(url)
            } else {
                APIs.downloadImage({
                    bucketName: "visix",
                    objectName: encodeURIComponent(url),
                }).then((res) => {
                    // const minioBase = import.meta.env.VITE_MINIO_ENDPOINT + ":" + import.meta.env.VITE_MINIO_PORT;
                    // res.data = res.data.replace(/http:\/\/[^\/]+:\d+/g, `http://${minioBase}`);

                    const regex = /^http:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)\/(.*)/;
                    const match = res.data.match(regex);
                    if (match) {
                        // 后面路径部分
                        res.data = `https://${import.meta.env.VITE_MINIO_DOMAIN}/${match[3]}`
                    }

                    imageCache.set(url, res.data, 1000 * 60 * 20);
                    return imageCache.get(url)
                })
            }
        }


        // 添加窗口大小变化监听
        const handleResize = throttle(() => {
            sidebarIsOpen.value = false;
        }, 300);

        onMounted(() => {
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return () => (
            <div>
                {
                    layoutStore.GETLAYOUTTYPE() == 'foreground' ? <router-view></router-view> :
                        (<div class={cn("flex h-screen bg-zinc-100 dark:bg-gray-900")}>
                            {/* Mobile menu button */}
                            <button
                                class={cn("md:hidden fixed top-4 left-4 z-10")}
                                onClick={toggleSidebar}
                            >
                                <FoldIcon />
                            </button>

                            <UserMenu
                                isOpen={userMenuIsOpen.value}
                                onClose={() => userMenuIsOpen.value = false}
                            />
                            {/* Sidebar */}
                            <div
                                class={cn(
                                    "fixed md:static inset-y-0 left-0 transform",
                                    sidebarIsOpen.value ? "translate-x-0" : "-translate-x-full",
                                    "md:translate-x-0 transition duration-200 ease-in-out z-40"
                                )}
                            >
                                <div style={{ width: `${LEFT_SIDEBAR_WIDTH}px` }} class={cn(`h-full overflow-hide bg-zinc-100 dark:bg-gray-800 z-50`)}>
                                    {/* Logo */}
                                    <div class={cn("flex items-center p-4 border-b dark:border-gray-700")}>
                                        <div class={cn("w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black")}>
                                            W
                                        </div>
                                        <span class={cn("ml-2 text-xl font-semibold dark:text-white")}>
                                            {/* Woo */}
                                        </span>
                                        {/* 侧边栏按钮 */}
                                        <button
                                            onClick={toggleSidebar}
                                            class={cn("md:hidden ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full")}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                    {/* Navigation */}
                                    <nav class={cn("p-4 h-[calc(100vh-180px)] overflow-y-auto no-scrollbar")}>
                                        <ul class={cn("space-y-2")}>
                                            {menuList.value.map((element) => {
                                                return (
                                                    <li>
                                                        <a
                                                            href={element.path}
                                                            class={cn("flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200")}
                                                        >
                                                            {element.icon}
                                                            <span class={cn("ml-3")}>
                                                                {element.name}
                                                            </span>
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>

                                    {/* User profile */}
                                    <div
                                        class={cn("absolute bottom-0 w-full p-4 border-t dark:border-gray-700")}
                                        onClick={toggleUserMenu}
                                    >
                                        <div class={cn("flex items-center justify-between cursor-pointer transition p-1 hover:bg-zinc-950/5 dark:hover:bg-gray-700 rounded-lg")}>
                                            <div class={cn("flex")}>
                                                {
                                                    avatar.value ? <img class={cn("w-12 h-12 p-1 bg-gray-200 dark:bg-gray-600 rounded-full")} src={avatar.value}></img> :
                                                        <div class={cn("w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600")}></div>
                                                }

                                                <div class={cn("ml-3")}>
                                                    <div class={cn("font-medium dark:text-white")}>
                                                        {nickName.value}
                                                    </div>
                                                    <div class={cn("text-sm text-gray-500 dark:text-gray-400")}>
                                                        {userName.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <svg
                                                class={cn("w-4 h-4 ml-2 dark:text-gray-400")}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                data-slot="icon"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                                                    clip-rule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main content */}
                            <main class={cn("flex-1 bg-white dark:bg-gray-900 px-4 lg:pr-4 lg:m-2 lg:rounded-lg lg:shadow-sm overflow-auto no-scrollbar")}>
                                <div class={cn("mt-8")}>
                                    <router-view></router-view>
                                </div>
                            </main>
                        </div>)
                }
            </div>
        );
    },
});
