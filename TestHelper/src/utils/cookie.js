// Cookie管理工具函数

/**
 * 设置Cookie
 * @param {string} name Cookie名称
 * @param {any} value Cookie值
 * @param {number} days 过期天数
 */
export function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/";
}

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @returns {any} Cookie值
 */
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                const cookieValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
                console.log(`🔍 获取Cookie "${name}":`, cookieValue);
                
                // 检查是否是有效的JSON字符串
                if (cookieValue === "[object Object]" || cookieValue === "undefined" || cookieValue === "null") {
                    console.warn(`Cookie "${name}" 包含无效值: ${cookieValue}`);
                    return null;
                }
                
                // 尝试解析JSON
                const parsedValue = JSON.parse(cookieValue);
                
                // 额外的验证：检查解析后的对象是否包含预期的应用状态属性
                // 如果只包含浏览器事件对象的属性（如isTrusted），则认为是无效的
                if (name === 'testHelperState' && parsedValue && typeof parsedValue === 'object') {
                    const expectedKeys = ['currentBank', 'currentQuestionIndex', 'userAnswers', 'isStudyMode', 'isExamMode', 'showTranslation', 'autoNext', 'currentLanguage', 'currentExamTemplate', 'examStartTime'];
                    const hasExpectedKey = expectedKeys.some(key => key in parsedValue);
                    
                    if (!hasExpectedKey && Object.keys(parsedValue).length === 1 && 'isTrusted' in parsedValue) {
                        console.warn(`Cookie "${name}" 包含无效的事件对象属性，将清理此Cookie`);
                        // 清理损坏的Cookie
                        deleteCookie(name);
                        return null;
                    }
                }
                
                return parsedValue;
            } catch (e) {
                console.warn(`解析Cookie "${name}" 失败:`, e);
                return null;
            }
        }
    }
    return null;
}

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 */
export function deleteCookie(name) {
    setCookie(name, "", -1);
}