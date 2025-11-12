// 题库管理服务

/**
 * 获取题库名称
 * @param {string} bankName 题库标识
 * @returns {string} 题库显示名称
 */
export function getBankName(bankName) {
    const names = {
        general: '综合题库 Example',
        aws_mls_c01_example: 'AWS-MLS(C01) Example',
        aws_mls_c01_all: 'AWS-MLS(C01) ALL',
        aws_mls_c01_all_doubao: 'AWS-MLS(C01) DouBao',
        aws_mls_c01_all_deepseek: 'AWS-MLS(C01) DeepSeek',
        acp_ai_pro_single: 'ACP 人工智能高级(单选题)',
        acp_ai_pro_numbers: 'ACP 人工智能高级(数字)',
        acp_ai_pro_errors: 'ACP 人工智能高级(错题集)',
        acp_ai_pro_single_example: 'ACP 人工智能高级(单选题) Example',
        acp_ai_pro_multi: 'ACP 人工智能高级(多选题)'
    };
    return names[bankName] || '未知题库';
}

/**
 * 检查答案是否正确
 * @param {Object} question 题目对象
 * @param {Array|Object} userAnswer 用户答案（可以是数组或包含options的对象）
 * @returns {boolean} 是否正确
 */
export function isCorrectAnswer(question, userAnswer) {
    // 验证题目对象和选项数组是否存在
    if (!question || !question.option || !Array.isArray(question.option)) {
        console.error('无效的题目对象:', question);
        return false;
    }
    
    // 处理新格式的用户答案
    let userOptions;
    if (Array.isArray(userAnswer)) {
        userOptions = userAnswer;
    } else if (userAnswer && userAnswer.options && Array.isArray(userAnswer.options)) {
        userOptions = userAnswer.options;
    } else {
        console.error('无效的用户答案:', userAnswer);
        return false;
    }
    
    const correctAnswers = question.option
        .map((opt, index) => opt.option_flag ? index : -1)
        .filter(index => index !== -1);

    if (correctAnswers.length !== userOptions.length) return false;

    return correctAnswers.every(ans => userOptions.includes(ans));
}

/**
 * 检查多选题是否有漏选情况
 * @param {Object} question 题目对象
 * @param {Array|Object} userAnswer 用户答案
 * @returns {boolean} 是否有漏选
 */
export function hasMissedOptions(question, userAnswer) {
    // 验证题目对象和选项数组是否存在
    if (!question || !question.option || !Array.isArray(question.option)) {
        console.error('无效的题目对象:', question);
        return false;
    }
    
    // 处理新格式的用户答案
    let userOptions;
    if (Array.isArray(userAnswer)) {
        userOptions = userAnswer;
    } else if (userAnswer && userAnswer.options && Array.isArray(userAnswer.options)) {
        userOptions = userAnswer.options;
    } else {
        console.error('无效的用户答案:', userAnswer);
        return false;
    }
    
    const correctAnswers = question.option
        .map((opt, index) => opt.option_flag ? index : -1)
        .filter(index => index !== -1);
    
    // 如果用户没有选择任何正确答案，说明有漏选
    const hasCorrectSelected = correctAnswers.some(ans => userOptions.includes(ans));
    const hasAllCorrect = correctAnswers.every(ans => userOptions.includes(ans));
    
    // 有正确答案被选中但不是全部正确答案都被选中，说明有漏选
    return hasCorrectSelected && !hasAllCorrect;
}

/**
 * 加载题库数据
 * @param {string} bankName 题库名称
 * @returns {Promise<Array>} 题目数组
 */
export async function loadBankData(bankName) {
    try {
        let response = null;
        if (bankName.toLowerCase().includes('aws')) {
            if (bankName.toLowerCase().includes('mls')) {
                response = await fetch(`./static/AWS/MLS/${bankName}.json`);
            } else {
                response = await fetch(`./static/AWS/${bankName}.json`);
            }
        } else if (bankName.toLowerCase().includes('acp')) {
            if (bankName.toLowerCase().includes('ai_pro')) {
                response = await fetch(`./static/ACP/AIPRO/${bankName}.json`);
            } else {
                response = await fetch(`./static/ACP/${bankName}.json`);
            }
        } else {
            response = await fetch(`./static/${bankName}.json`);
        }

        if (!response.ok) {
            throw new Error(`无法加载题库: ${bankName}`);
        }

        return await response.json();
    } catch (error) {
        console.error('加载题库失败:', error);
        throw error;
    }
}

/**
 * 从题库中随机抽取题目
 * @param {Array} questions 题目数组
 * @param {number} count 抽取数量
 * @returns {Array} 抽取的题目
 */
export function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}