import { ElMessage } from "element-plus";

const isArray = Array.isArray;


/**
 * 将monaco编辑器中的值转换为字符串
 * @param data 需要转换的值
 * @returns {content: string} 转换后的值
 */
export function convertMonacoValue(data: any): any {
    let content: any = null;
    // 匹配分页查询的结果
    if (isArray(data)) {
        try {
            content = `[${data.map(obj => JSON.stringify(obj, null, 2)).join(",\n")}]`;
        } catch (e) {
            console.error("解析结果错误", e);
        }
        // 其他结果
    } else if (["string", "number", "boolean"].includes(typeof data)) {
        content = data + " ";
        // 匹配是对象的情况下
    } else if (typeof data === "object" && data !== null) {
        // 如果入参开启日志输出模式 返回的数据格式会发生变化
        let __data = data.logger ? data.data : data;
        if (data.logger) { // {logger:{},data:{}}
            ElMessage.success(
                "检测出您已开启日志打印，请开启控制台或者在右侧面版查看！"
            );
            console.info(
                "preprocessingLogger(预处理日志打印),postprocessingLogger(后处理日志打印)",
                JSON.parse(data.logger)
            );
        }
        // 换个写法 避免递归调用防止栈溢出
        if (typeof __data === "object" && __data !== null) {
            content = JSON.stringify(__data, null, 2);
        } else {
            content = __data + " ";
        }
    } else {
        content = data + " ";
    }
    return {
        content,
        logger: data?.logger || '[]'
    };
}
