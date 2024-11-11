import { defineStore } from "pinia";

// 这个是布局信息 类型有【】
type LayoutType = "device" | "foreground" | "backstage";

export const LayoutStore = defineStore({
    id: "layout",
    state: () => ({
        type: "foreground" as LayoutType,
    }),
    actions: {
        GETLAYOUTTYPE() {
            return this.type;
        },
        changeLayout(type: LayoutType) {
            this.type = type;
        },
    },
});
