// SidebarProvider.tsx
import { defineComponent, provide, ref } from "vue";

// 定义 SidebarProvider 组件
export default defineComponent({
    name: "SidebarProvider",
    setup(_, { slots }) {
        // 创建共享的响应式数据
        const isSidebarOpen = ref(false);

        // 定义上下文值
        const contextValue = {
            isSidebarOpen,
            toggleSidebar: () => {
                isSidebarOpen.value = !isSidebarOpen.value;
            },
        };

        // 使用 provide 将 contextValue 提供给子组件
        provide("SidebarContext", contextValue);

        return () => (
            <div>
                {/* 渲染插槽内容 */}
                {slots.default && slots.default()}
            </div>
        );
    },
});
