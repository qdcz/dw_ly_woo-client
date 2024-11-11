import {
    defineComponent,
    reactive,
    computed,
    onMounted,
    onBeforeUnmount,
    ref,
    provide,
} from "vue";
import { deepClone, cn } from "../../utils/index";

import { ElMessage } from "element-plus";

type SidebarContext = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const isSidebarOpen = ref(false);
// / 将状态和方法通过 provide 提供给子组件
provide("SidebarContext", {
    isSidebarOpen,
    toggleSidebar: () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    },
});

export const fullEditorProps = {
    logic: {
        type: [String],
        default: "",
    },
};

const SidebarMenu = defineComponent({
    name: "SidebarMenu",
    emits: ["update:modelValue", "handleSaveCode", "codeChange"],
    components: {},
    props: fullEditorProps,
    setup(props, ctx) {
        return () => (
            <ul
                ref={ref}
                data-sidebar="menu"
                className={cn("flex flex-col gap-1")}
            />
        );
    },
});

const SidebarItem = defineComponent({
    name: "SidebarItem",
    emits: ["update:modelValue", "handleSaveCode", "codeChange"],
    components: {},
    props: fullEditorProps,
    setup(props, ctx) {
        const ref = ref(null);

        return () => (
            <li
                ref={ref}
                data-sidebar="item"
                className={cn("flex w-full min-w-0 flex-col gap-1")}
            />
        );
    },
});

export { SidebarMenu, SidebarItem };
