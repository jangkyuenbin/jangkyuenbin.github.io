// 应用状态存储管理

/**
 * 保存应用状态到Cookie
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
        if (window.userAnswers !== undefined && window.userAnswers !== null) {
            state.userAnswers = window.userAnswers;
        }
        if (window.isStudyMode !== undefined) {
            state.isStudyMode = window.isStudyMode;
        }
        if (window.isExamMode !== undefined) {
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
        if (window.currentExamTemplate !== undefined && window.currentExamTemplate !== null) {
            state.currentExamTemplate = window.currentExamTemplate;
        }
        if (window.examStartTime !== undefined && window.examStartTime !== null) {
            state.examStartTime = window.examStartTime;
        }
        
        console.log('🔍 saveStateToCookie 自动收集状态:', {
            currentBank: state.currentBank,
            currentQuestionIndex: state.currentQuestionIndex,
            userAnswers: state.userAnswers ? Object.keys(state.userAnswers).length + '个答案' : '无',
            isStudyMode: state.isStudyMode,
            isExamMode: state.isExamMode
        });
    }
    
    // 只有在有有效状态时才保存
    if (state && Object.keys(state).length > 0) {
        // 额外的安全检查：确保state不是事件对象
        const isEventObject = state && typeof state === 'object' && 
                             Object.keys(state).length === 1 && 
                             'isTrusted' in state;
        
        if (isEventObject) {
            console.warn('🔍 saveStateToCookie 检测到事件对象，跳过保存');
            return;
        }
        
        setCookie('testHelperState', state, 7);
        console.log('🔍 saveStateToCookie 状态已保存到cookie');
    } else {
        console.log('🔍 saveStateToCookie 没有有效状态可保存');
    }
}

/**
 * 从Cookie加载应用状态
 * @returns {Object} 应用状态对象
 */
export function loadStateFromCookie() {
    try {
        const state = getCookie('testHelperState');
        console.log('🔍 loadStateFromCookie 开始执行，cookie值:', state ? '有' : '无');
        
        if (state && typeof state === 'object') {
            console.log('🔍 loadStateFromCookie 解析成功:', {
                currentBank: state.currentBank,
                currentQuestionIndex: state.currentQuestionIndex,
                userAnswers: state.userAnswers ? Object.keys(state.userAnswers).length + '个答案' : '无',
                isStudyMode: state.isStudyMode,
                isExamMode: state.isExamMode
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