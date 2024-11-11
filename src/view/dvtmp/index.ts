function generateDateTimeString() {
    var currentDateTime = new Date();

    var year = currentDateTime.getFullYear();
    var month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDateTime.getDate().toString().padStart(2, '0');
    var hours = currentDateTime.getHours().toString().padStart(2, '0');
    var minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    var seconds = currentDateTime.getSeconds().toString().padStart(2, '0');

    var dateTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return dateTimeString;
}



/**
 * 创建头文件描述信息
 * @param {*} obj 
 * @returns 
 */
const fileTitleDes = (obj?:any) => {
    const _obj = {
        name: "cxy",
        createdAt: generateDateTimeString(),
        updatedAt: generateDateTimeString(),
        screenCode: 100,
        screenName: "xxxx大屏",
        originUrl: "xxx"
    }
    Object.assign(_obj, obj)
    return `/**
* @param {Stage} stage
*
* devAuth ${_obj.name}
* createdAt ${_obj.createdAt}
* updatedAt ${_obj.updatedAt}
* screenCode ${_obj.screenCode}
* screenName ${_obj.screenName}
* originUrl ${_obj.originUrl}
* @Description:
*
* Copyright (c) 2023 by snxun.com, All Rights Reserved.
*/`
}


/**
 * 生成单一组件字符串
 * @param obj 
 * @returns 
 */
const gen_component_single = (obj) => {
    const _obj = {
        key: "xxxxxxxxxx指标",
        value: "xxxxxxxxxxxxxxid"
    }
    Object.assign(_obj, obj);
    return `"${_obj.key}":"${_obj.value}"`
}
const gen_component = (list?:any) => {
    let _list = [
        {
            key: "xxxxxxxxxx指标",
            value: "xxxxxxxxxxxxxxid"
        },
        {
            key: "xxxxxxxxxx指标",
            value: "xxxxxxxxxxxxxxid"
        }
    ]
    list ? _list = list : ""
    return `this.components = {
    ${_list.map(i => gen_component_single(i))}
}`
}


/**
 * datav 整体框架
 * @param obj 
 * @returns 
 */
const hookFramework = (obj?:any) => {
    const _obj = {
        toolId: "@Snxun_datav_sn-cp-tools_jSRNj",
        startingPoint: `` || gen_component() // 内容
    }
    
    Object.assign(_obj, obj)
    return `module.exports = (stage) => {
    const { Comm } = stage
    .get('${_obj.toolId}')
    .hook(stage);
    ${_obj.startingPoint}
}`
}


/**
 * datav hook 页面总搭建
 * 
 */



export const initDatavHook = () => {
    let fileTitleDesStr = fileTitleDes();
    let hookFrameworkStr = hookFramework();
    return `${fileTitleDesStr}
    ${hookFrameworkStr}`
}