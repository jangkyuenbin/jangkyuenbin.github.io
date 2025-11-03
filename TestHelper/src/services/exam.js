// 考试功能服务

/**
 * 加载考试模板
 * @param {string} templateName 模板文件名
 * @returns {Promise<Object>} 考试模板对象
 */
export async function loadExamTemplate(templateName) {
    try {
        // 加载模板文件（templateName已包含.json后缀）
        const response = await fetch(`./static/exam/${templateName}`);
        if (!response.ok) {
            throw new Error('无法加载考试模板');
        }
        
        return await response.json();
    } catch (error) {
        console.error('加载考试模板失败:', error);
        throw error;
    }
}

/**
 * 从题库抽取考试题目
 * @param {Object} template 考试模板
 * @returns {Promise<Array>} 考试题目数组
 */
export async function loadExamQuestions(template) {
    const examQuestions = [];
    
    // 遍历模板中的每个题库
    for (const bankConfig of template.exam_content) {
        try {
            // 加载对应题库
            const bankName = bankConfig.question_bank_id;
            const bankQuestions = await loadBankData(bankName);
            
            // 随机抽取指定数量的题目
            const selected = getRandomQuestions(bankQuestions, bankConfig.question_number);
            
            // 为题目添加分数信息
            selected.forEach(q => {
                q.score = bankConfig.question_score;
            });
            
            // 添加到考试题目列表
            examQuestions.push(...selected);
        } catch (error) {
            console.error(`处理题库 ${bankConfig.question_bank_id} 时出错:`, error);
            throw error;
        }
    }
    
    // 打乱所有题目顺序
    return examQuestions.sort(() => 0.5 - Math.random());
}

/**
 * 计算考试成绩
 * @param {Array} questions 题目数组
 * @param {Object} userAnswers 用户答案
 * @returns {Object} 考试结果
 */
export function calculateExamResult(questions, userAnswers) {
    let totalScore = 0;
    let earnedScore = 0;
    let correctCount = 0;
    let answeredCount = 0;
    let unansweredCount = 0;
    
    // 计算总分
    totalScore = questions.reduce((sum, q) => sum + (q.score || 1), 0);
    
    // 统计答题情况
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer && userAnswer.isSubmitted) {
            answeredCount++;
            if (isCorrectAnswer(question, userAnswer)) {
                correctCount++;
                earnedScore += (question.score || 1);
            }
        } else {
            unansweredCount++;
        }
    });
    
    // 计算得分百分比
    const scorePercentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    
    return {
        totalQuestions: questions.length,
        totalScore,
        earnedScore,
        scorePercentage,
        correctCount,
        answeredCount,
        unansweredCount,
        accuracy
    };
}

// 导入相关函数
import { loadBankData, getRandomQuestions, isCorrectAnswer } from './bank.js';