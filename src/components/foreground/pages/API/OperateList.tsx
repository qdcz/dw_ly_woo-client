import { defineComponent } from "vue";
import { cn } from "@/utils/tailwindcss";
import IconButton from "@/components/foreground/form/IconButton";
import Add from "@/components/foreground/icon/Add";
import Mutilate from "@/components/foreground/icon/Mutilate";

export default defineComponent({
  name: "OperateList",
  emits: ["btnClick"],
  components: {
    IconButton,
    Add,
    Mutilate,
  },
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("[data-type]");
      if (!button) return;
      const type = button.getAttribute("data-type");
      emit("btnClick", type);
    };

    return () => (
      <div
        class={cn(
          "text-gray-600 dark:text-gray-400 mt-1 text-sm",
          "flex items-center space-x-2"
        )}
        onClick={handleClick}
      >
        <IconButton text={"Create New API"} data-type="add">
          <Add width={"1rem"} height={"1rem"}></Add>
        </IconButton>
        <IconButton text={"Multiple Choice API"} data-type="mutilate">
          <Mutilate width={"1rem"} height={"1rem"}></Mutilate>
        </IconButton>
      </div>
    );
  },
});
