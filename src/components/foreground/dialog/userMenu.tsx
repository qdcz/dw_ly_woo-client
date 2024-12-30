import { defineComponent, ref } from 'vue';
import Confirm from "./confirm";
import { UserStore } from "../../../store/index";
import { cn } from "@/utils/index";
import { toggleDarkMode } from '../../../utils'

import UserIcon from "../icon/User.tsx";
import LogoutIcon from "../icon/Logout.tsx";
import LightIcon from "../icon/Light.tsx";
import DarkIcon from "../icon/Dark.tsx";
import UserInfo from './userInfo.tsx';

export default defineComponent({
    name: "UserMenu",
    props: {
        isOpen: {
            type: [Boolean],
            required: true,
        },
        onClose: {
            type: [Function],
            required: true,
        },
    },
    components: {
        Confirm,
        UserInfo,
        LogoutIcon,
        UserIcon,
        LightIcon,
        DarkIcon
    },
    setup(props) {
        const isConfirmOpen = ref(false);
        const userInfoIsOpen = ref(false)

        const onLogoutClick = () => {
            props.onClose();
            setTimeout(() => {
                isConfirmOpen.value = true;
            }, 100);
        }

        const onUserInfoClick = () => {
            props.onClose();
            setTimeout(() => {
                userInfoIsOpen.value = true;
            }, 100);
        }

        const onConfirmLogout = () => {
            isConfirmOpen.value = false;
            const userStore = UserStore();
            userStore.logout();
        }

        const MenuItems = ref<{ icon: any, text: string, onClick: () => void }[]>([
            {
                icon: UserIcon,
                text: "User Info",
                onClick: onUserInfoClick
            },
            {
                icon: LightIcon,
                text: "Light Mode",
                onClick: () => {
                    const theme = toggleDarkMode();
                    MenuItems.value[1].icon = theme === "light" ? DarkIcon : LightIcon;
                    MenuItems.value[1].text = theme === "light" ? "Dark Mode" : "Light Mode";
                }
            },
            {
                icon: LogoutIcon,
                text: "Logout",
                onClick: onLogoutClick
            }
        ])

        return () => (
            <>
                <Confirm title="Logout" message="Are you sure you want to logout?" isOpen={isConfirmOpen.value} onCancel={() => isConfirmOpen.value = false} onConfirm={onConfirmLogout} />
                <UserInfo
                    isOpen={userInfoIsOpen.value}
                    onClose={() => (userInfoIsOpen.value = false)}>
                </UserInfo>
                {/* 用户菜单遮罩层 */}
                {props.isOpen && (
                    <div
                        class={cn(
                            "fixed inset-0 z-[98] cursor-pointer transition-opacity duration-200 ease-out",
                            "bg-black dark:bg-black",
                            props.isOpen ? "bg-opacity-30 dark:bg-opacity-50" : "bg-opacity-0"
                        )}
                        onClick={() => props.onClose()}
                    />
                )}

                {/* 用户菜单 */}
                {(<div
                    class={cn(
                        "absolute z-[99] w-60 bottom-[80px] left-4 p-4 select-none",
                        "bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg",
                        "transform transition-all duration-200 ease-out",
                        "hover:scale-[1.02] hover:shadow-xl",
                        props.isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    )}
                >
                    {MenuItems.value.map(item => (
                        <div
                            class={cn(
                                "flex items-center p-2 rounded-lg cursor-pointer",
                                "text-gray-900 dark:text-white",
                                "hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={item.onClick}
                        >
                            <item.icon width="1.3" height="2" />
                            <span class={cn("ml-3")}>{item.text}</span>
                        </div>
                    ))}
                </div>)}
            </>
        );
    },
});
