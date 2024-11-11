import { defineComponent, ref, computed } from "vue";

import { UserStore, LayoutStore } from "../../store";

import UserMenu from "./dialog/userMenu.tsx";

import SettingsIcon from "./icon/Settings.tsx";
import ProjectIcon from "./icon/Project.tsx";
import DataBaseIcon from "./icon/DataBase.tsx";
import APIIcon from "./icon/API.tsx";

export default defineComponent({
    components: {
        UserMenu,
        SettingsIcon,
        ProjectIcon,
        DataBaseIcon,
        APIIcon,
    },
    setup() {
        const userStore = UserStore();
        const layoutStore = LayoutStore();
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

        const isSidebarOpen = ref(false);
        const isUserMenuOpen = ref(false);

        const menuList = ref([
            {
                name: "API",
                icon: <APIIcon />,
                path: "/static/admin/#/API",
            },
            {
                name: "API_old",
                icon: <APIIcon />,
                path: "/static/admin/#/APIManager",
            },
            {
                name: "Project_old",
                icon: <ProjectIcon />,
                path: "/static/admin/#/ProjectManager",
            },
            {
                name: "DataBase",
                icon: <DataBaseIcon />,
                path: "/static/admin/#/DataBaseManager",
            },
            {
                name: "Settings",
                icon: <SettingsIcon />,
                path: "/static/admin/#/Settings",
            },
        ]);

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
        };

        const toggleUserMenu = () => {
            isUserMenuOpen.value = !isUserMenuOpen.value;
        };

        return () => (
            <div>
                {
                    layoutStore.GETLAYOUTTYPE() == 'foreground' ? <router-view></router-view> : <div class="flex h-screen bg-zinc-100 dark:bg-gray-900">
                        {/* Mobile menu button */}
                        <button
                            class="md:hidden fixed top-4 left-4 z-50"
                            onClick={toggleSidebar}
                        >
                            <svg
                                class="w-6 h-6 dark:text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <UserMenu
                            isOpen={isUserMenuOpen.value}
                            onClose={() => (isUserMenuOpen.value = false)}
                        />

                        {/* Sidebar */}
                        <div
                            class={`fixed md:static inset-y-0 left-0 transform ${isSidebarOpen.value
                                ? "translate-x-0"
                                : "-translate-x-full"
                                } md:translate-x-0 transition duration-200 ease-in-out z-40`}
                        >
                            <div class="w-60 h-full bg-zinc-100 dark:bg-gray-800">
                                {/* Logo */}
                                <div class="flex items-center p-4 border-b dark:border-gray-700">
                                    <div class="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black">
                                        W
                                    </div>
                                    <span class="ml-2 text-xl font-semibold dark:text-white">
                                        Woo
                                    </span>
                                </div>

                                {/* Navigation */}
                                <nav class="p-4">
                                    <ul class="space-y-2">
                                        {menuList.value.map((element) => {
                                            return (
                                                <li>
                                                    <a
                                                        href={element.path}
                                                        class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"
                                                    >
                                                        {element.icon}
                                                        <span class="ml-3">
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
                                    class="absolute bottom-0 w-full p-4 border-t dark:border-gray-700"
                                    onClick={toggleUserMenu}
                                >
                                    <div class="flex items-center justify-between cursor-pointer transition p-1 hover:bg-zinc-950/5 dark:hover:bg-gray-700 rounded-lg">
                                        <div class="flex">
                                            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                            <div class="ml-3">
                                                <div class="font-medium dark:text-white">
                                                    {nickName.value}
                                                </div>
                                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                                    {userName.value}
                                                </div>
                                            </div>
                                        </div>
                                        <svg
                                            class="w-4 h-4 ml-2 dark:text-gray-400"
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
                        <main class="flex-1 bg-white dark:bg-gray-900 px-4 lg:pr-4 lg:m-2 lg:rounded-lg lg:shadow-sm overflow-auto no-scrollbar">
                            {/* Top gradient mask */}
                            {/* <div class="sticky top-0 h-8 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 pointer-events-none"></div> */}
                            <div class="md:my-8">
                                <router-view></router-view>
                            </div>
                            {/* Bottom gradient mask */}
                            {/* <div class="sticky bottom-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 pointer-events-none"></div> */}
                        </main>
                    </div>
                }
            </div>
        );
    },
});
