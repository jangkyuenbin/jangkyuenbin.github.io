// 应用状态存储管理

/**
 * 获取当前日期字符串（格式：YYYY-MM-DD）
 * @returns {string} 当前日期字符串
 */
function getCurrentDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * 检查浏览器是否支持localStorage
 * @returns {boolean} 是否支持localStorage
 */
function isLocalStorageSupported() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 使用localStorage存储大容量数据
 * @param {string} key 存储键名
 * @param {Object} data 存储数据
 * @returns {boolean} 是否存储成功
 */
function saveToLocalStorage(key, data) {
    if (!isLocalStorageSupported()) {
        console.warn('localStorage不支持，回退到Cookie存储');
        return false;
    }
    
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`🔍 数据已保存到localStorage: ${key}, 大小: ${JSON.stringify(data).length}字节`);
        return true;
    } catch (e) {
        console.warn('localStorage存储失败:', e);
        return false;
    }
}

/**
 * 从localStorage加载数据
 * @param {string} key 存储键名
 * @returns {Object|null} 加载的数据
 */
function loadFromLocalStorage(key) {
    if (!isLocalStorageSupported()) {
        return null;
    }
    
    try {
        const data = localStorage.getItem(key);
        if (data) {
            const parsedData = JSON.parse(data);
            console.log(`🔍 从localStorage加载数据: ${key}, 大小: ${data.length}字节`);
            return parsedData;
        }
        return null;
    } catch (e) {
        console.warn('localStorage加载失败:', e);
        return null;
    }
}

/**
 * 优化用户答案数据，减少存储体积
 * @param {Object} userAnswers 用户答案对象
 * @returns {Object} 优化后的用户答案对象
 */
function optimizeUserAnswers(userAnswers) {
    if (!userAnswers || typeof userAnswers !== 'object') {
        return userAnswers;
    }
    
    const optimized = {};
    Object.keys(userAnswers).forEach(index => {
        const answer = userAnswers[index];
        if (answer && typeof answer === 'object') {
            // 简化数据结构，只保留必要信息
            optimized[index] = {
                o: answer.options || [], // 简化为 'o'
                s: answer.isSubmitted || false, // 简化为 's'
                d: answer.submittedDate || null // 简化为 'd'
            };
        }
    });
    
    return optimized;
}

/**
 * 恢复用户答案数据结构
 * @param {Object} optimizedAnswers 优化后的用户答案对象
 * @returns {Object} 完整的用户答案对象
 */
function restoreUserAnswers(optimizedAnswers) {
    if (!optimizedAnswers || typeof optimizedAnswers !== 'object') {
        return optimizedAnswers;
    }
    
    const restored = {};
    Object.keys(optimizedAnswers).forEach(index => {
        const answer = optimizedAnswers[index];
        if (answer && typeof answer === 'object') {
            restored[index] = {
                options: answer.o || [],
                isSubmitted: answer.s || false,
                submittedDate: answer.d || null
            };
        }
    });
    
    return restored;
}

/**
 * 检查数据大小是否超过Cookie限制
 * @param {Object} data 要检查的数据
 * @returns {boolean} 是否超过限制
 */
function isDataTooLarge(data) {
    try {
        const jsonString = JSON.stringify(data);
        // Cookie限制通常为4KB (4096字节)
        return jsonString.length > 1000; // 留出一些安全空间
    } catch (e) {
        console.warn('检查数据大小失败:', e);
        return false;
    }
}

/**
 * 保存应用状态（使用localStorage实现无限制存储）
 * @param {Object} state 应用状态对象（可选，如果不提供则自动收集当前状态）
 */
export function saveStateToCookie(state) {
    console.log('🔍 saveStateToCookie 被调用，传入state:', state ? '有' : '无');
    
    // 如果没有提供state参数，则自动收集当前应用状态
    if (!state && typeof window !== 'undefined') {
        // 只保存有效的状态值，过滤掉undefined和null
        state = {};
        
        if (window.currentBank !== undefined && window.currentBank !== null) {
            state.currentBank = window.currentBank;
        }
        if (window.currentQuestionIndex !== undefined) {
            state.currentQuestionIndex = window.currentQuestionIndex;
        }
        
        // 考试模式下不保存用户答案状态
        if (window.userAnswers !== undefined && window.userAnswers !== null && !window.isExamMode) {
            // 优化用户答案数据
            state.userAnswers = optimizeUserAnswers(window.userAnswers);
            
            // 检查数据大小，如果过大则使用localStorage
            if (isDataTooLarge(state)) {
                console.log('🔍 状态数据过大，使用localStorage存储');
                
                // 分离用户答案数据
                const userAnswersData = state.userAnswers;
                delete state.userAnswers; // 从主状态中移除
                
                // 保存主状态到Cookie
                setCookie('testHelperState', state, 7);
                
                // 保存用户答案到localStorage
                const localStorageKey = `testHelperUserAnswers_${window.currentBank || 'default'}`;
                const success = saveToLocalStorage(localStorageKey, userAnswersData);
                
                if (!success) {
                    console.warn('🔍 localStorage存储失败，回退到Cookie限制存储');
                    // 如果localStorage失败，限制保存的答案数量
                    const answerKeys = Object.keys(userAnswersData).map(Number).sort((a, b) => b - a);
                    const recentAnswers = {};
                    answerKeys.slice(0, 50).forEach(key => {
                        recentAnswers[key] = userAnswersData[key];
                    });
                    state.userAnswers = recentAnswers;
                    setCookie('testHelperState', state, 7);
                    console.log(`🔍 已限制为最近${Object.keys(recentAnswers).length}个答案`);
                } else {
                    console.log(`🔍 用户答案已保存到localStorage: ${localStorageKey}, 包含${Object.keys(userAnswersData).length}个答案`);
                }
                
                return; // 提前返回，避免重复保存
            }
        }
        
        if (window.isStudyMode !== undefined) {
            state.isStudyMode = window.isStudyMode;
        }
        
        // 考试模式下不保存考试状态
        if (window.isExamMode !== undefined && !window.isExamMode) {
            state.isExamMode = window.isExamMode;
        }
        
        if (window.showTranslation !== undefined) {
            state.showTranslation = window.showTranslation;
        }
        if (window.autoNext !== undefined) {
            state.autoNext = window.autoNext;
        }
        if (window.currentLanguage !== undefined) {
            state.currentLanguage = window.currentLanguage;
        }
        
        // 考试模式下不保存考试模板和开始时间
        if (window.currentExamTemplate !== undefined && window.currentExamTemplate !== null && !window.isExamMode) {
            state.currentExamTemplate = window.currentExamTemplate;
        }
        if (window.examStartTime !== undefined && window.examStartTime !== null && !window.isExamMode) {
            state.examStartTime = window.examStartTime;
        }
        
        // 添加当前日期信息
        state.lastSaveDate = getCurrentDateString();
        
        console.log('🔍 saveStateToCookie 自动收集状态:', {
            currentBank: state.currentBank,
            currentQuestionIndex: state.currentQuestionIndex,
            userAnswers: state.userAnswers ? Object.keys(state.userAnswers).length + '个答案' : '无',
            isStudyMode: state.isStudyMode,
            isExamMode: state.isExamMode,
            lastSaveDate: state.lastSaveDate
        });
    }
    
    // 只有在有有效状态时才保存
    if (state && Object.keys(state).length > 0) {
        // 额外的安全检查：确保state不是事件对象或其他无效对象
        const isEventObject = state && typeof state === 'object' && 
                             Object.keys(state).length === 1 && 
                             'isTrusted' in state;
        
        const isInvalidObject = state && typeof state === 'object' && 
                               (Object.keys(state).length === 0 || 
                                (Object.keys(state).length === 1 && 'target' in state) ||
                                (Object.keys(state).length === 1 && 'type' in state));
        
        if (isEventObject || isInvalidObject) {
            console.warn('🔍 saveStateToCookie 检测到无效对象，跳过保存:', {
                isEventObject,
                isInvalidObject,
                keys: Object.keys(state)
            });
            return;
        }
        
        setCookie('testHelperState', state, 7);
        console.log('🔍 saveStateToCookie 状态已保存到cookie');
    } else {
        console.log('🔍 saveStateToCookie 没有有效状态可保存');
    }
}

/**
 * 从存储加载应用状态（支持localStorage无限制存储）
 * @returns {Object} 应用状态对象
 */
export function loadStateFromCookie() {
    try {
        const state = getCookie('testHelperState');
        console.log('🔍 loadStateFromCookie 开始执行，cookie值:', state ? '有' : '无');
        
        if (state && typeof state === 'object') {
            // 检查是否需要从localStorage加载用户答案
            if (!state.userAnswers && state.currentBank) {
                console.log('🔍 检测到用户答案可能存储在localStorage中');
                const localStorageKey = `testHelperUserAnswers_${state.currentBank}`;
                const userAnswersData = loadFromLocalStorage(localStorageKey);
                
                if (userAnswersData) {
                    state.userAnswers = restoreUserAnswers(userAnswersData);
                    console.log(`🔍 从localStorage加载用户答案: ${Object.keys(state.userAnswers).length}个答案`);
                } else {
                    console.log('🔍 未找到localStorage中的用户答案数据');
                    state.userAnswers = {};
                }
            } else if (state.userAnswers && typeof state.userAnswers === 'object') {
                // 恢复用户答案数据结构（如果使用了优化格式）
                state.userAnswers = restoreUserAnswers(state.userAnswers);
            }
            
            // 检查保存日期，如果是今天之前的状态，则不清除提交状态
            const currentDate = getCurrentDateString();
            const savedDate = state.lastSaveDate;
            
            console.log('🔍 loadStateFromCookie 日期检查:', {
                currentDate: currentDate,
                savedDate: savedDate,
                isSameDay: savedDate === currentDate
            });
            
            // 如果不是同一天，需要清理已提交的状态
            if (savedDate && savedDate !== currentDate) {
                console.log('🔍 loadStateFromCookie 检测到不同日期的状态，清理提交状态');
                
                // 清理用户答案中的提交状态，但保留选择题答案
                if (state.userAnswers && typeof state.userAnswers === 'object') {
                    Object.keys(state.userAnswers).forEach(index => {
                        const answer = state.userAnswers[index];
                        if (answer && typeof answer === 'object' && 'isSubmitted' in answer) {
                            // 保留选择题答案，但清除提交状态和日期
                            state.userAnswers[index] = {
                                options: answer.options || [],
                                isSubmitted: false,
                                submittedDate: null
                            };
                        } else if (answer && typeof answer === 'object' && 'options' in answer) {
                            // 已经是新格式但可能包含提交状态，确保清除
                            state.userAnswers[index] = {
                                options: answer.options || [],
                                isSubmitted: false,
                                submittedDate: null
                            };
                        }
                        // 如果是旧格式（直接是数组），保持不变
                    });
                }
                
                // 更新保存日期为今天
                state.lastSaveDate = currentDate;
            }
            
            console.log('🔍 loadStateFromCookie 解析成功:', {
                currentBank: state.currentBank,
                currentQuestionIndex: state.currentQuestionIndex,
                userAnswers: state.userAnswers ? Object.keys(state.userAnswers).length + '个答案' : '无',
                isStudyMode: state.isStudyMode,
                isExamMode: state.isExamMode,
                lastSaveDate: state.lastSaveDate
            });
            return state;
        }
        
        console.log('🔍 loadStateFromCookie 没有找到保存的状态或状态无效');
        return null;
    } catch (e) {
        console.error('加载保存的状态失败:', e);
        // 如果加载失败，清理损坏的cookie
        try {
            deleteCookie('testHelperState');
            console.log('🔍 loadStateFromCookie 已清理损坏的cookie');
        } catch (cleanupError) {
            console.error('清理损坏的cookie失败:', cleanupError);
        }
        return null;
    }
}

/**
 * 保存设置到Cookie
 * @param {Object} settings 设置对象
 */
export function saveSettings(settings) {
    setCookie('showTranslation', settings.showTranslation ? 'true' : 'false', 30);
    setCookie('autoNext', settings.autoNext ? 'true' : 'false', 30);
    setCookie('autoSubmitSingle', settings.autoSubmitSingle ? 'true' : 'false', 30);
}

/**
 * 从Cookie加载设置
 * @returns {Object} 设置对象
 */
export function loadSettings() {
    const savedShowTranslation = getCookie('showTranslation');
    const showTranslation = savedShowTranslation === null ? true : (savedShowTranslation === 'true');
    const autoNext = getCookie('autoNext') === 'true';
    const autoSubmitSingle = getCookie('autoSubmitSingle') === 'true';
    
    return {
        showTranslation,
        autoNext,
        autoSubmitSingle
    };
}

// 导入Cookie函数
import { setCookie, getCookie } from './cookie.js';