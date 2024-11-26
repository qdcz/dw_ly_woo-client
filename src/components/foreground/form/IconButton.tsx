import { defineComponent, ref, onMounted } from "vue";
import { cn } from "@/utils/tailwindcss";
import { createTextAnimation, getTextWidth } from "@/utils";

export default defineComponent({
  name: "IconButton",
  props: {
    text: {
      type: [String],
      default: "create new API",
    },
  },
  setup(props, { slots }) {
    /**
     * dom
     */
    const textRef = ref(null);

    /**
     *
     */
    const isHovered = ref(false);
    const textWidth = ref(0);
    // 文字内容（逐字增加）
    const displayedText = ref("");
    let animationTimeout: number | null = null;

    const animateText = () => {
      animationTimeout = createTextAnimation(
        props.text,
        (text) => (displayedText.value = text)
      );
    };

    onMounted(() => {
      textWidth.value = getTextWidth(props.text, 60);
    });

    return () => (
      <div
        class={cn(
          "cursor-pointer transition-all duration-500 select-none",
          "flex items-center justify-center",
          "h-8 w-8 rounded-full",
          isHovered.value ? `px-3 bg-blue-500` : "bg-gray-200 dark:bg-gray-800"
        )}
        // 悬浮时，宽度为文字宽度 + 40px
        style={isHovered.value ? { width: `${textWidth.value}px` } : {}}
        onMouseenter={() => {
          isHovered.value = true;
          displayedText.value = "";
          animateText();
        }}
        onMouseleave={() => {
          isHovered.value = false;
          displayedText.value = "";
          if (animationTimeout) {
            clearTimeout(animationTimeout);
          }
        }}
      >
        {isHovered.value ? (
          <span ref={textRef} class="text-white text-sm truncate">
            {displayedText.value}
          </span>
        ) : (
          <span class="text-gray-600 dark:text-gray-400 text-lg font-bold">
            {slots.default?.() || "+"}
          </span>
        )}
      </div>
    );
  },
});
