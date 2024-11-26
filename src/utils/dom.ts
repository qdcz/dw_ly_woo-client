/**
 * 获取文字宽度
 * @param text 文字
 * @param padding 新增的文字内边距
 * @returns 宽度
 */
export const getTextWidth = (text: string, padding: number) => {
    // const span = document.createElement("span");
    // span.className = "text-white text-sm";
    // span.style.position = "absolute";
    // span.style.visibility = "hidden";
    // span.textContent = text;
    // document.body.appendChild(span);
    // // 移除dom元素
    // setTimeout(() => {
    //     document.body.removeChild(span);
    // }, 1);
    // return span.offsetWidth + padding;

    // 每次创建 DOM 元素都会占用内存，重绘和重排，触发垃圾回收，所以使用 canvas 来测量文字宽度
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0; // 如果获取上下文失败，返回 0
    context.font = "12px sans-serif"; // 设置字体样式，需与实际使用的样式一致
    const textWidth = context.measureText(text).width;
    return textWidth + padding;
};


/**
 * 文本码字机动画
 * @param text 文本内容
 * @param onUpdate 每帧回调
 * @returns 
 */
export const createTextAnimation = (text: string, onUpdate: (text: string) => void) => {
    let currentLength = 0;
    let lastTime = 0;
    let timeout: number | null = null;

    const animate = (currentTime: number) => {
        const timeDiff = currentTime - lastTime;
        const ANIMATION_INTERVAL = 40;

        if (timeDiff >= ANIMATION_INTERVAL) {
            onUpdate(text.slice(0, ++currentLength));
            lastTime = currentTime;
        }

        if (currentLength < text.length) {
            timeout = requestAnimationFrame(animate) as unknown as number;
        }
    };

    timeout = requestAnimationFrame(animate) as unknown as number;
    return timeout;
};
