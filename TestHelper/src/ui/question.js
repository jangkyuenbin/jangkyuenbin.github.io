// 题目显示UI组件

/**
 * 生成题目HTML内容
 * @param {Object} question 题目对象
 * @param {number} index 题目索引
 * @param {Object} userAnswer 用户答案
 * @param {boolean} isStudyMode 是否为背题模式
 * @param {boolean} isExamMode 是否为考试模式
 * @param {boolean} showTranslation 是否显示翻译
 * @param {string} currentLanguage 当前语言
 * @returns {string} 题目HTML
 */
export function generateQuestionHTML(question, index, userAnswer, isStudyMode, isExamMode, showTranslation, currentLanguage) {
    const isMultiple = question.option.filter(o => o.option_flag).length > 1;
    const typeClass = isMultiple ? 'type-multiple' : 'type-single';
    const typeText = isMultiple ? '多选题' : '单选题';

    let html = `
        <div class="question-header">
            <span class="question-type ${typeClass}">${typeText}</span>
            <span>题目 ID: ${question.id}</span>
            ${isExamMode && question.score ? `<span class="question-score">${question.score}分</span>` : ''}
        </div>
        <div class="question-text">
            <div>${window.parseMarkdown(question.question[currentLanguage])}</div>
            ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${window.parseMarkdown(question.question.enus)}</div>` : ''}
            ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${window.parseMarkdown(question.question.zhcn)}</div>` : ''}
        </div>
        <div class="options-container">
    `;

    // 生成选项
    question.option.forEach((option, optIndex) => {
        const isSelected = userAnswer && userAnswer.includes(optIndex);
        const isCorrect = option.option_flag;
        // 只有在背题模式或非考试模式下已经提交答案后才显示正确结果
        // 考试模式下不显示正确答案
        const showResult = isStudyMode || (!isExamMode && userAnswer !== undefined && typeof userAnswer.isSubmitted !== 'undefined' && userAnswer.isSubmitted);

        let optionClass = 'option-item';
        if (showResult) {
            if (isCorrect) {
                optionClass += ' correct';
            } else if (isSelected && !isCorrect) {
                optionClass += ' incorrect';
            }
        } else if (isSelected) {
            optionClass += ' selected';
        }

        html += `
            <div class="${optionClass}" onclick="window.selectOption(${optIndex})">
                <div class="option-checkbox"></div>
                <div class="option-text">
                    <div>${window.parseMarkdown(option.option_text[currentLanguage])}</div>
                    ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${window.parseMarkdown(option.option_text.enus)}</div>` : ''}
                    ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${window.parseMarkdown(option.option_text.zhcn)}</div>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';

    // 显示解析（背题模式或非考试模式下已提交答案）
    // 考试模式下不显示解析
    if (isStudyMode || (!isExamMode && userAnswer !== undefined && typeof userAnswer.isSubmitted !== 'undefined' && userAnswer.isSubmitted)) {
        html += `
            <div class="analysis-section">
                <div class="analysis-title">📝 解析</div>
                <div class="analysis-content">
                    <div>${window.parseMarkdown(question.analysis[currentLanguage])}</div>
                    ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${window.parseMarkdown(question.analysis.enus)}</div>` : ''}
                    ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${window.parseMarkdown(question.analysis.zhcn)}</div>` : ''}
                </div>
            </div>
        `;
    }

    // 添加操作按钮
    html += '<div class="action-buttons">';

    if (index > 0) {
        html += `<button class="btn btn-outline" onclick="window.displayQuestion(${index - 1})">⬅ 上一题</button>`;
    }

    if (!isStudyMode) {
        if (isExamMode) {
            // 考试模式下，提交答案按钮的文本改为"提交试卷"
            html += '<button class="btn btn-primary" onclick="window.submitAnswer()">提交试卷</button>';
        } else if (!userAnswer || typeof userAnswer.isSubmitted === 'undefined' || !userAnswer.isSubmitted) {
            // 非考试模式下的正常提交答案按钮
            html += '<button class="btn btn-primary" onclick="window.submitAnswer()">提交答案</button>';
        }
    }

    if (index < window.questions.length - 1) {
        html += `<button class="btn btn-outline" onclick="window.displayQuestion(${index + 1})">下一题 ➡</button>`;
    }
    
    // 在考试模式下显示终止考试按钮（供随时退出）
    if (isExamMode && window.questions.length > 0) {
        html += '<button class="btn btn-danger" onclick="window.confirmEndExam()" style="margin-left: 10px;">终止考试</button>';
    }

    html += '</div>';

    return html;
}

/**
 * 显示题目
 * @param {number} index 题目索引
 * @param {Object} state 应用状态
 */
export function displayQuestion(index, state) {
    if (index < 0 || index >= window.questions.length) return;

    window.currentQuestionIndex = index;
    const question = window.questions[index];

    // 更新当前题目显示
    document.getElementById('currentQuestion').textContent = index + 1;

    // 更新导航高亮
    updateNavHighlight(index, document.getElementById('questionGrid'));
    
    // 保存状态，确保在背题模式下也能保存当前题目
    window.saveStateToCookie();

    // 生成题目HTML
    const html = generateQuestionHTML(
        question, 
        index, 
        window.userAnswers[index], 
        window.isStudyMode, 
        window.isExamMode, 
        window.showTranslation, 
        window.currentLanguage
    );

    document.getElementById('questionContent').innerHTML = html;
        
    // 渲染数学公式 - 使用更可靠的方式
    setTimeout(() => {
        const questionContent = document.getElementById('questionContent');
        if (questionContent) {
            console.log('准备渲染公式，内容元素:', questionContent);
            const success = window.renderMathFormulas(questionContent);
            
            // 如果首次渲染失败，尝试再次渲染
            if (!success) {
                console.log('首次渲染失败，尝试重新渲染...');
                setTimeout(() => {
                    window.renderMathFormulas(questionContent);
                }, 100);
            }
        } else {
            console.error('无法找到问题内容元素');
        }
    }, 50); // 增加一点延迟，确保DOM完全更新

    // 直接定位到题目的标题部分，避免被顶部导航栏挡住，不使用滑动动画
    setTimeout(() => {
        const questionHeader = document.querySelector('.question-header');
        if (questionHeader) {
            // 获取顶部导航栏的高度 - 使用更准确的选择器
            const topNav = document.querySelector('.top-nav');
            let navHeight = 60; // 默认高度
            
            if (topNav) {
                // 获取实际计算的高度，包括padding和border
                const computedStyle = window.getComputedStyle(topNav);
                const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
                const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
                const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
                const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
                
                navHeight = topNav.offsetHeight + paddingTop + paddingBottom + borderTop + borderBottom;
                
                // 在手机模式下，导航栏高度可能更大，添加额外调整
                if (window.innerWidth <= 768) {
                    navHeight += 20; // 手机模式下额外增加20px间距
                }
            }
            
            // 计算需要滚动的位置
            const targetPosition = questionHeader.getBoundingClientRect().top + window.pageYOffset - navHeight - 10; // 减少间距到20px
            
            // 确保滚动位置不小于0
            const finalPosition = Math.max(0, targetPosition);
            
            // 直接设置滚动位置，不使用动画
            window.scrollTo({
                top: finalPosition,
                behavior: 'auto' // 禁用动画，直接跳转
            });
        }
    }, 10); // 短暂延迟确保DOM已更新
}

// 导入相关函数
import { updateNavHighlight } from './navigation.js';