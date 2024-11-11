import { defineComponent, ref } from 'vue';
import Confirm from "./confirm";
import { UserStore } from "../../../store/index";

import { toggleDarkMode } from '../../../utils'

import UserIcon from "../icon/User.tsx";
import LogoutIcon from "../icon/Logout.tsx";

export default defineComponent({
    name: "UserMenu",
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        onClose: {
            type: Function,
            required: true,
        },
    },
    components: {
        Confirm,
        LogoutIcon,
        UserIcon
    },
    setup(props) {
        const isConfirmOpen = ref(false);

        const onLogoutClick = () => {
            isConfirmOpen.value = true;
            props.onClose();
        }

        const onConfirmLogout = () => {
            isConfirmOpen.value = false;
            const userStore = UserStore();
            userStore.logout();
        }

        const MenuItems = [
            {
                icon: UserIcon,
                text: "User Info",
                onClick: () => { }
            },
            {
                icon: UserIcon,
                text: "Theme Toggle",
                onClick: () => { toggleDarkMode() }
            },
            {
                icon: LogoutIcon,
                text: "Logout",
                onClick: onLogoutClick
            }
        ]

        return () => (
            <>
                <Confirm title="Logout" message="Are you sure you want to logout?" isOpen={isConfirmOpen.value} onCancel={() => isConfirmOpen.value = false} onConfirm={onConfirmLogout} />
                {/* 用户菜单遮罩层 */}
                {props.isOpen && (
                    <div
                        class={`fixed bg-black dark:bg-black inset-0 z-[98] cursor-pointer transition-opacity duration-200 ease-out ${props.isOpen ? "bg-opacity-30 dark:bg-opacity-50" : "bg-opacity-0"
                            }`}
                        onClick={() => props.onClose()}
                    />
                )}

                {/* 用户菜单 */}
                <div
                    class={`absolute z-[99] w-60 bottom-[80px] left-4 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg transform transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-xl ${props.isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"
                        }`}
                >
                    {MenuItems.map(item => (
                        <div
                            class="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={item.onClick}
                        >
                            <item.icon />
                            <span class="ml-3">{item.text}</span>
                        </div>
                    ))}
                </div>
            </>
        );
    },
});
