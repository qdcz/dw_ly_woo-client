/**
 * 获取文字宽度
 * @param text 文字
 * @param padding 新增的文字内边距
 * @returns 宽度
 */
export const getTextWidth = (text: string, padding: number) => {
    const span = document.createElement("span");
    span.className = "text-white text-sm";
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.textContent = text;
    document.body.appendChild(span);
    return span.offsetWidth + padding;
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
