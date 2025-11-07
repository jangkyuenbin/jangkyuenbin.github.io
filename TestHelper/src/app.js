// 主应用入口文件

// 全局状态变量
window.currentBank = null;
window.currentQuestionIndex = 0;
window.questions = [];
window.userAnswers = {};
window.isStudyMode = false; // false: 练习模式, true: 背题模式
window.isExamMode = false; // 是否处于考试模式
window.showTranslation = true;
window.autoNext = false;
window.autoSubmitSingle = false; // 是否在单选题中自动提交答案
window.currentLanguage = 'zhcn';
window.currentExamTemplate = null; // 当前考试模板
window.examStartTime = null; // 考试开始时间
window.examTimer = null; // 考试计时器

// 导入工具函数
import { setCookie, getCookie } from './utils/cookie.js';
import { parseMarkdown, renderMathFormulas, renderCodeHighlight } from './utils/markdown.js';
import { saveStateToCookie, loadStateFromCookie, saveSettings, loadSettings } from './utils/storage.js';

// 导入服务模块
import { getBankName, isCorrectAnswer, loadBankData } from './services/bank.js';
import { loadExamTemplate, loadExamQuestions, calculateExamResult } from './services/exam.js';

// 导入UI组件
import { generateQuestionNav, updateStatsDisplay } from './ui/navigation.js';
import { displayQuestion } from './ui/question.js';

// 将函数挂载到window对象，供HTML调用
window.parseMarkdown = parseMarkdown;
window.renderMathFormulas = renderMathFormulas;
window.renderCodeHighlight = renderCodeHighlight;
window.saveStateToCookie = saveStateToCookie;
window.loadStateFromCookie = loadStateFromCookie;
window.saveSettings = saveSettings;
window.loadSettings = loadSettings;
window.getBankName = getBankName;
window.isCorrectAnswer = isCorrectAnswer;
window.loadBankData = loadBankData;
window.loadExamTemplate = loadExamTemplate;
window.loadExamQuestions = loadExamQuestions;
window.calculateExamResult = calculateExamResult;
window.generateQuestionNav = generateQuestionNav;
window.updateStatsDisplay = updateStatsDisplay;
window.displayQuestion = displayQuestion;

// 加载题库
window.loadBank = async function(bankName) {
    // 在考试模式下禁止切换题库
    if (window.isExamMode) {
        showToast('考试模式下不允许切换题库');
        return;
    }
    
    if (!bankName) {
        bankName = document.getElementById('bankSelect').value;
    }

    if (!bankName) {
        showToast('请选择题库');
        return;
    }

    try {
        console.log('🔍 loadBank 开始执行，bankName:', bankName, '当前题库:', window.currentBank);
        
        // 显示加载动画
        document.getElementById('loadingIndicator').style.display = 'flex';
        document.getElementById('questionContent').style.display = 'none';
        
        // 加载题库数据
        window.questions = await loadBankData(bankName);

        // 重置状态
        const savedIndex = window.currentBank === bankName ? window.currentQuestionIndex : 0;
        window.currentQuestionIndex = Math.min(savedIndex, window.questions.length - 1);
        
        // 只有在切换到新的题库时才清空用户答案
        // 在背题模式下，即使切换到新题库也清空用户答案
        if (window.currentBank !== bankName || window.isStudyMode) {
            window.userAnswers = {};
        }
        window.currentBank = bankName;
        
        console.log('🔍 loadBank 状态更新完成，当前题库:', window.currentBank, '题目数量:', window.questions.length);
        
        // 保存状态
        window.saveStateToCookie();

        // 更新UI
        document.getElementById('currentBank').textContent = getBankName(bankName);
        document.getElementById('totalQuestions').textContent = window.questions.length;
        document.getElementById('totalQuestionsNav').textContent = window.questions.length;
        
        // 更新题库选择下拉菜单的值
        document.getElementById('bankSelect').value = bankName;
        console.log('🔍 loadBank 下拉菜单值已更新为:', bankName, '实际值:', document.getElementById('bankSelect').value);

        // 生成题目导航
        generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));

        // 显示保存的题目索引
        displayQuestion(window.currentQuestionIndex);

        // 更新统计
        updateStatsDisplay(window.userAnswers, window.questions);

        // 隐藏加载动画
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('questionContent').style.display = 'block';

        showToast(`已加载 ${getBankName(bankName)}`);
        console.log('🔍 loadBank 执行完成');
    } catch (error) {
        console.error('加载题库失败:', error);
        showToast('加载题库失败，请重试');
    }
};

// 选择选项
window.selectOption = function(optionIndex) {
    // 在背题模式下不允许选择答案
    if (window.isStudyMode) {
        showToast('背题模式下不允许选择答案');
        return;
    }
    
    // 检查当前题目是否已经提交过答案
    const currentAnswer = window.userAnswers[window.currentQuestionIndex];
    const currentIsSubmitted = currentAnswer && typeof currentAnswer === 'object' && currentAnswer.isSubmitted;
    
    // 如果已经提交过答案，不允许再次选择
    if (currentIsSubmitted) {
        showToast('该题目已提交答案，无法修改');
        return;
    }
    
    const question = window.questions[window.currentQuestionIndex];
    const isMultiple = question.option.filter(o => o.option_flag).length > 1;
    
    // 初始化用户答案数组，确保使用对象格式
    if (!window.userAnswers[window.currentQuestionIndex]) {
        window.userAnswers[window.currentQuestionIndex] = {
            options: [],
            isSubmitted: false
        };
    } else if (typeof window.userAnswers[window.currentQuestionIndex] !== 'object' || Array.isArray(window.userAnswers[window.currentQuestionIndex])) {
        // 如果是数组格式，转换为对象格式
        window.userAnswers[window.currentQuestionIndex] = {
            options: window.userAnswers[window.currentQuestionIndex] || [],
            isSubmitted: false
        };
    }

    if (isMultiple) {
        // 多选题
        const index = window.userAnswers[window.currentQuestionIndex].options.indexOf(optionIndex);
        if (index > -1) {
            window.userAnswers[window.currentQuestionIndex].options.splice(index, 1);
        } else {
            window.userAnswers[window.currentQuestionIndex].options.push(optionIndex);
        }
    } else {
        // 单选题
        window.userAnswers[window.currentQuestionIndex].options = [optionIndex];
        
        // 如果启用了自动提交单选题答案
        if (window.autoSubmitSingle) {
            // 使用setTimeout让UI先更新，然后再提交答案
            setTimeout(() => {
                window.submitAnswer();
            }, 0);
        }
    }

    // 保存状态
    window.saveStateToCookie();
    
    // 重新生成题目导航，确保颜色状态正确更新
    generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));
    
    // 更新显示
    displayQuestion(window.currentQuestionIndex);
};

// 提交答案
window.submitAnswer = function() {
    if (!window.userAnswers[window.currentQuestionIndex] || window.userAnswers[window.currentQuestionIndex].length === 0) {
        showToast('请先选择答案');
        return;
    }

    // 考试模式的特殊处理
    if (window.isExamMode) {
        // 检查是否所有题目都已选择答案
        let allAnswered = true;
        let unansweredCount = 0;
        
        for (let i = 0; i < window.questions.length; i++) {
            if (!window.userAnswers[i] || window.userAnswers[i].length === 0) {
                allAnswered = false;
                unansweredCount++;
            }
        }
        
        if (!allAnswered) {
            // 有未回答的题目，弹出提醒
            if (confirm(`您还有 ${unansweredCount} 道题目未回答，未回答的题目将被判定为错误。确定要继续提交吗？`)) {
                // 用户确认继续提交，结束考试
                window.endExam();
            } else {
                // 用户取消，返回继续答题
                return;
            }
        } else {
            // 所有题目都已回答，弹出确认提交框
            if (confirm('所有题目都已回答，确定要提交试卷吗？提交后将显示成绩。')) {
                // 用户确认提交，结束考试
                window.endExam();
            } else {
                // 用户取消，返回继续答题
                return;
            }
        }
    } else {
        // 非考试模式的正常处理
        // 确保用户答案是一个对象，包含选项和提交信息
        const currentAnswer = window.userAnswers[window.currentQuestionIndex];
        
        // 如果当前答案不是对象格式，转换为对象格式
        if (!currentAnswer || typeof currentAnswer !== 'object' || Array.isArray(currentAnswer)) {
            window.userAnswers[window.currentQuestionIndex] = {
                options: currentAnswer || [],
                isSubmitted: true,
                submittedDate: new Date().toISOString()
            };
        } else {
            // 已经是对象格式，更新提交状态和日期
            window.userAnswers[window.currentQuestionIndex].isSubmitted = true;
            window.userAnswers[window.currentQuestionIndex].submittedDate = new Date().toISOString();
        }

        // 更新统计
        updateStatsDisplay(window.userAnswers, window.questions);

        // 更新导航
        generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));

        // 显示结果
        displayQuestion(window.currentQuestionIndex);

        // 在练习模式下，提交答案后自动滚动到解析模块
        if (!window.isStudyMode) {
            setTimeout(() => {
                const analysisSection = document.querySelector('.analysis-section');
                if (analysisSection) {
                    analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }

        // 显示提示
        const isCorrect = window.isCorrectAnswer(window.questions[window.currentQuestionIndex], window.userAnswers[window.currentQuestionIndex]);
        showToast(isCorrect ? '✅ 回答正确！' : '❌ 回答错误，请查看解析');
        
        // 保存状态
        window.saveStateToCookie();

        // 自动下一题
        if (window.autoNext && window.currentQuestionIndex < window.questions.length - 1) {
            setTimeout(() => {
                displayQuestion(window.currentQuestionIndex + 1);
            }, 1500);
        }
    }
};

// 提交单题答案（考试模式下使用）
window.submitSingleAnswer = function() {
    // 检查是否已选择答案
    if (!window.userAnswers[window.currentQuestionIndex] || window.userAnswers[window.currentQuestionIndex].length === 0) {
        showToast('请先选择答案');
        return;
    }

    // 确保用户答案是一个对象，包含选项和提交信息
    const currentAnswer = window.userAnswers[window.currentQuestionIndex];
    
    // 如果当前答案不是对象格式，转换为对象格式
    if (!currentAnswer || typeof currentAnswer !== 'object' || Array.isArray(currentAnswer)) {
        window.userAnswers[window.currentQuestionIndex] = {
            options: currentAnswer || [],
            isSubmitted: true,
            submittedDate: new Date().toISOString()
        };
    } else {
        // 已经是对象格式，更新提交状态和日期
        window.userAnswers[window.currentQuestionIndex].isSubmitted = true;
        window.userAnswers[window.currentQuestionIndex].submittedDate = new Date().toISOString();
    }

    // 更新导航
    generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));

    // 显示结果
    displayQuestion(window.currentQuestionIndex);

    // 显示提示
    showToast('✅ 答案已提交');
    
    // 保存状态（考试模式下不保存到cookie，但这里仍然调用以保持一致性）
    window.saveStateToCookie();
};

// 切换模式
window.changeMode = function() {
    const modeSelect = document.getElementById('modeSelect');
    const selectedMode = modeSelect.value;
    
    // 如果当前已经是考试模式，且用户选择的是考试模式，不做任何操作
    if (window.isExamMode && selectedMode === 'exam') {
        return;
    }
    
    // 如果当前是考试模式，且用户选择其他模式，需要先结束考试
    if (window.isExamMode && selectedMode !== 'exam') {
        showToast('请先结束当前考试才能切换模式');
        // 重置选择框到考试模式
        modeSelect.value = 'exam';
        return;
    }
    
    // 清空历史选择
    window.userAnswers = {};
    
    // 根据选择的模式设置状态
    if (selectedMode === 'practice') {
        window.isStudyMode = false;
        window.isExamMode = false;
        document.getElementById('statsPanel').style.display = 'block';
        
        // 启用相关按钮
        document.getElementById('bankSelect').disabled = false;
        document.getElementById('settingsBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('examBtn').disabled = false;
        
    } else if (selectedMode === 'study') {
        window.isStudyMode = true;
        window.isExamMode = false;
        document.getElementById('statsPanel').style.display = 'none';
        
        // 启用相关按钮
        document.getElementById('bankSelect').disabled = false;
        document.getElementById('settingsBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('examBtn').disabled = false;
        
    } else if (selectedMode === 'exam') {
        // 考试模式需要通过专门的考试按钮开始
        showToast('请点击"开始考试"按钮选择考试模板');
        // 重置选择框到当前模式
        if (window.isStudyMode) {
            modeSelect.value = 'study';
        } else {
            modeSelect.value = 'practice';
        }
        return;
    }
    
    // 保存模式切换状态，但保持当前题目索引不变
    window.saveStateToCookie();
    
    // 更新统计信息
    updateStatsDisplay(window.userAnswers, window.questions);
    
    // 重新生成题目导航
    if (window.questions.length > 0) {
        generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));
    }
    
    // 保存状态
    window.saveStateToCookie();

    // 重新显示当前题目
    if (window.questions.length > 0) {
        displayQuestion(window.currentQuestionIndex);
    }
};

// 切换语言
window.toggleLanguage = function() {
    window.currentLanguage = window.currentLanguage === 'zhcn' ? 'enus' : 'zhcn';
    document.getElementById('langText').textContent = window.currentLanguage === 'zhcn' ? '中/EN' : 'EN/中';
    
    // 保存状态
    window.saveStateToCookie();

    if (window.questions.length > 0) {
        displayQuestion(window.currentQuestionIndex);
    }
};

// 更新显示设置
window.updateDisplay = function() {
    window.showTranslation = document.getElementById('showTranslation').checked;
    
    // 保存设置
    window.saveSettings({
        showTranslation: window.showTranslation,
        autoNext: window.autoNext,
        autoSubmitSingle: window.autoSubmitSingle
    });
    
    if (window.questions.length > 0) {
        displayQuestion(window.currentQuestionIndex);
    }
};

// 更新设置
window.updateSettings = function() {
    window.autoNext = document.getElementById('autoNext').checked;
    window.saveSettings({
        showTranslation: window.showTranslation,
        autoNext: window.autoNext,
        autoSubmitSingle: window.autoSubmitSingle
    });
};

// 更新自动提交单选题设置
window.updateAutoSubmitSingle = function() {
    window.autoSubmitSingle = document.getElementById('autoSubmitSingle').checked;
    window.saveSettings({
        showTranslation: window.showTranslation,
        autoNext: window.autoNext,
        autoSubmitSingle: window.autoSubmitSingle
    });
};

// 开始考试
window.startExam = function(template) {
    // 保存当前考试模板
    window.currentExamTemplate = template;
    
    window.isExamMode = true;
    window.isStudyMode = false;
    window.examStartTime = new Date();
    
    // 隐藏不需要的UI元素
    document.getElementById('statsPanel').style.display = 'none';
    document.getElementById('bankSelect').disabled = true;
    document.getElementById('settingsBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    
    // 更新考试按钮为结束考试
    const examBtn = document.getElementById('examBtn');
    examBtn.textContent = '🚫 结束考试';
    examBtn.className = 'btn btn-danger';
    examBtn.onclick = window.confirmEndExam;
    examBtn.disabled = false;
    
    // 更新UI显示，在模式显示中包含考试名称
    document.getElementById('currentModeDisplay').textContent = `当前模式: 📝 考试模式 - ${window.currentExamTemplate.exam_name}`;
    
    // 加载考试题目
    loadExamQuestions(template).then((examQuestions) => {
        window.questions = examQuestions;
        showToast(`考试已开始，共有 ${window.questions.length} 道题目`);
        
        // 启动计时器
        window.startExamTimer();
        
        // 生成题目导航
        generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));
        
        // 显示第一题
        if (window.questions.length > 0) {
            displayQuestion(0);
        }
        
        // 保存状态到Cookie
        window.saveStateToCookie();
    }).catch(error => {
        console.error('加载考试题目失败:', error);
        showToast('加载考试题目失败，请重试');
        window.isExamMode = false;
    });
};

// 启动考试计时器
window.startExamTimer = function() {
    // 清除之前的计时器
    if (window.examTimer) {
        clearInterval(window.examTimer);
    }
    
    // 更新计时器显示
    function updateTimer() {
        if (!window.examStartTime) return;
        
        const now = new Date();
        const elapsedMs = now - window.examStartTime;
        const minutes = Math.floor(elapsedMs / 60000);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);
        
        const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 如果不存在计时器元素，则创建它
        let timerElement = document.getElementById('examTimer');
        if (!timerElement) {
            timerElement = document.createElement('div');
            timerElement.id = 'examTimer';
            timerElement.className = 'exam-timer';
            document.querySelector('.top-nav .nav-controls').appendChild(timerElement);
        }
        
        timerElement.textContent = `⏰ ${timerText}`;
    }
    
    // 立即更新一次
    updateTimer();
    
    // 设置定时器每秒更新
    window.examTimer = setInterval(updateTimer, 1000);
};

// 结束考试
window.endExam = function() {
    // 停止计时器
    if (window.examTimer) {
        clearInterval(window.examTimer);
        window.examTimer = null;
    }
    
    // 计算考试成绩
    const examResult = calculateExamResult(window.questions, window.userAnswers);
    
    // 显示考试结果
    window.showExamResult(examResult);
    
    // 重置考试状态
    window.isExamMode = false;
    window.currentExamTemplate = null;
    window.examStartTime = null;
    
    // 恢复UI元素
    document.getElementById('bankSelect').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    
    // 恢复考试按钮为开始考试
    const examBtn = document.getElementById('examBtn');
    examBtn.textContent = '📝 开始考试';
    examBtn.className = 'btn btn-success';
    examBtn.onclick = window.openExamTemplateDialog;
    examBtn.disabled = false;
    
    // 移除计时器显示
    const timerElement = document.getElementById('examTimer');
    if (timerElement) {
        timerElement.remove();
    }
};

// 显示考试结果
window.showExamResult = function(result) {
    // 创建结果HTML
    const html = `
        <div class="exam-result">
            <h2>📊 考试结果</h2>
            <div class="result-summary">
                <div class="result-item">
                    <span class="result-label">总分：</span>
                    <span class="result-value">${result.earnedScore} / ${result.totalScore}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">得分率：</span>
                    <span class="result-value">${result.scorePercentage}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">正确率：</span>
                    <span class="result-value">${result.accuracy}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">正确题目：</span>
                    <span class="result-value">${result.correctCount} 题</span>
                </div>
                <div class="result-item">
                    <span class="result-label">已答题目：</span>
                    <span class="result-value">${result.answeredCount} 题</span>
                </div>
                <div class="result-item">
                    <span class="result-label">未答题目：</span>
                    <span class="result-value">${result.unansweredCount} 题</span>
                </div>
            </div>
            <div class="result-actions">
                <button class="btn btn-primary" onclick="window.viewExamDetails()">查看详细结果</button>
                <button class="btn btn-outline" onclick="window.exitExam()">退出考试</button>
            </div>
        </div>
    `;
    
    // 显示结果
    document.getElementById('questionContent').innerHTML = html;
};

// 查看考试详细结果
window.viewExamDetails = function() {
    // 生成详细结果HTML
    let html = `
        <div class="exam-details">
            <h2>📋 考试详细结果</h2>
            <div class="detail-stats">
                <p>总题目数: ${window.questions.length} | 正确数: ${calculateExamResult(window.questions, window.userAnswers).correctCount} | 得分: ${calculateExamResult(window.questions, window.userAnswers).earnedScore} / ${calculateExamResult(window.questions, window.userAnswers).totalScore}</p>
            </div>
            <div class="detail-list">
    `;
    
    // 列出所有题目的答题情况
    window.questions.forEach((question, index) => {
        const userAnswer = window.userAnswers[index];
        const isAnswered = userAnswer && userAnswer.isSubmitted;
        const isCorrect = isAnswered && window.isCorrectAnswer(window.questions[index], userAnswer);
        
        html += `
            <div class="detail-item ${isCorrect ? 'correct' : isAnswered ? 'incorrect' : 'unanswered'}">
                <div class="detail-header">
                    <span class="detail-number">${index + 1}</span>
                    <span class="detail-status">${isCorrect ? '✅ 正确' : isAnswered ? '❌ 错误' : '🔄 未答'}</span>
                    <span class="detail-score">${question.score || 1}分</span>
                </div>
                <div class="detail-question" onclick="window.displayQuestion(${index})"></div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="detail-actions">
                <button class="btn btn-outline" onclick="window.exitExam()">退出考试</button>
            </div>
        </div>
    `;
    
    // 显示详细结果
    document.getElementById('questionContent').innerHTML = html;
};

// 退出考试
window.exitExam = function() {
    // 重置状态
    window.isExamMode = false;
    window.currentBank = null;
    window.questions = [];
    window.userAnswers = {};
    window.currentExamTemplate = null;
    
    // 恢复UI元素
    document.getElementById('statsPanel').style.display = window.isStudyMode ? 'none' : 'block';
    document.getElementById('bankSelect').disabled = false;
    document.getElementById('settingsBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    
    // 恢复考试按钮为开始考试
    const examBtn = document.getElementById('examBtn');
    examBtn.textContent = '📝 开始考试';
    examBtn.className = 'btn btn-success';
    examBtn.onclick = window.openExamTemplateDialog;
    examBtn.disabled = false;
    
    // 恢复模式显示
    document.getElementById('currentModeDisplay').textContent = window.isStudyMode ? '当前模式: 📖 背题模式' : '当前模式: ✏️ 练习模式';
    
    // 默认加载综合题库
    window.loadBank('general');
};

// 确认结束考试
window.confirmEndExam = function() {
    // 检查是否所有题目都已提交答案
    let allSubmitted = true;
    let unsubmittedCount = 0;
    
    for (let i = 0; i < window.questions.length; i++) {
        const userAnswer = window.userAnswers[i];
        if (!userAnswer || !userAnswer.isSubmitted) {
            allSubmitted = false;
            unsubmittedCount++;
        }
    }
    
    let message = '确定要结束考试吗？';
    if (!allSubmitted) {
        message += `\n\n您还有 ${unsubmittedCount} 道题目未提交答案，未提交的题目将被判定为错误。`;
    }
    message += '\n\n提交后将显示考试成绩。';
    
    if (confirm(message)) {
        window.endExam();
    }
};

// 打开考试模板选择对话框
window.openExamTemplateDialog = function() {
    // 创建模板列表HTML
    let html = `
        <div class="modal-backdrop" onclick="window.closeExamTemplateDialog()">
            <div class="exam-template-dialog" onclick="event.stopPropagation()">
                <h3>选择考试模板</h3>
                <div class="template-list">
                    <div class="template-item" onclick="window.selectExamTemplate('acp_exam_template.json')">
                        <span class="template-name">ACP AI Pro Exam</span>
                        <span class="template-desc">ACP人工智能高级考试</span>
                    </div>
                    <!-- 可以添加更多模板 -->
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-outline" onclick="window.closeExamTemplateDialog()">取消</button>
                </div>
            </div>
        </div>
    `;
    
    // 创建对话框
    const dialog = document.createElement('div');
    dialog.id = 'examTemplateDialog';
    dialog.className = 'modal show';
    dialog.innerHTML = html;
    
    // 添加到页面
    document.body.appendChild(dialog);
};

// 关闭考试模板对话框
window.closeExamTemplateDialog = function() {
    const dialog = document.getElementById('examTemplateDialog');
    if (dialog) {
        dialog.remove();
    }
};

// 选择考试模板
window.selectExamTemplate = function(templateName) {
    window.closeExamTemplateDialog();
    
    // 加载考试模板并开始考试
    loadExamTemplate(templateName)
        .then(template => {
            window.startExam(template);
        })
        .catch(error => {
            showToast('加载考试模板失败: ' + error.message);
        });
};

// 切换设置面板
window.toggleSettings = function() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('show');
};

// 显示提示信息
window.showToast = function(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// 重置练习状态
window.resetPractice = function() {
    // 在考试模式下禁止重置
    if (window.isExamMode) {
        showToast('考试模式下不允许重置');
        return;
    }
    
    if (window.isStudyMode) {
        showToast('请先切换到练习模式');
        return;
    }
    
    // 清空用户答案记录
    window.userAnswers = {};
    
    // 重置当前题目索引
    window.currentQuestionIndex = 0;
    
    // 保存状态
    window.saveStateToCookie();
    
    // 更新统计信息
    updateStatsDisplay(window.userAnswers, window.questions);
    
    // 重新生成题目导航
    generateQuestionNav(window.questions, window.userAnswers, window.isStudyMode, document.getElementById('questionGrid'));
    
    // 显示第一题
    if (window.questions.length > 0) {
        displayQuestion(0);
    }
    
    // 显示提示信息
    showToast('已重置练习状态');
};

// 键盘快捷键
document.addEventListener('keydown', function (e) {
    if (window.questions.length === 0) return;

    switch (e.key) {
        case 'ArrowLeft':
            if (window.currentQuestionIndex > 0) {
                displayQuestion(window.currentQuestionIndex - 1);
            }
            break;
        case 'ArrowRight':
            if (window.currentQuestionIndex < window.questions.length - 1) {
                displayQuestion(window.currentQuestionIndex + 1);
            }
            break;
        case 'Enter':
            if (!window.isStudyMode && window.userAnswers[window.currentQuestionIndex] === undefined) {
                window.submitAnswer();
            }
            break;
        case 'm':
        case 'M':
            // 切换模式快捷键 - 由于现在是下拉菜单，需要特殊处理
            if (window.isExamMode) {
                showToast('考试模式下不允许切换模式');
            } else {
                const modeSelect = document.getElementById('modeSelect');
                if (modeSelect) {
                    // 在练习模式和背题模式之间切换
                    modeSelect.value = window.isStudyMode ? 'practice' : 'study';
                    window.changeMode();
                }
            }
            break;
        case 'l':
        case 'L':
            window.toggleLanguage();
            break;
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    // 从cookie加载状态
    const savedState = window.loadStateFromCookie();
    if (savedState) {
        window.currentBank = savedState.currentBank !== undefined && savedState.currentBank !== null ? savedState.currentBank : window.currentBank;
        window.isStudyMode = savedState.isStudyMode !== undefined ? savedState.isStudyMode : window.isStudyMode;
        // 考试模式状态不进行持久化，刷新页面后强制退出考试模式
        window.isExamMode = false;
        window.showTranslation = savedState.showTranslation !== undefined ? savedState.showTranslation : window.showTranslation;
        window.autoNext = savedState.autoNext !== undefined ? savedState.autoNext : window.autoNext;
        window.currentLanguage = savedState.currentLanguage || window.currentLanguage;
        
        // 清除考试相关状态，确保刷新页面后不恢复考试模式
        window.currentExamTemplate = null;
        window.examStartTime = null;
        
        // 在背题模式下，恢复背题状态
        if (savedState.isStudyMode) {
            window.currentQuestionIndex = savedState.currentQuestionIndex || window.currentQuestionIndex;
            
            // 背题模式下清空用户答案，但保留当前题目索引
            window.userAnswers = {};
            
            console.log('🔍 背题模式状态恢复完成:', {
                currentBank: window.currentBank,
                currentQuestionIndex: window.currentQuestionIndex,
                isStudyMode: window.isStudyMode
            });
        }
        // 在练习模式下，恢复练习状态
        else {
            window.currentQuestionIndex = savedState.currentQuestionIndex || window.currentQuestionIndex;
            
            // 处理userAnswers，确保格式一致
            if (savedState.userAnswers) {
                window.userAnswers = {};
                Object.keys(savedState.userAnswers).forEach(index => {
                    const savedAnswer = savedState.userAnswers[index];
                    if (savedAnswer && typeof savedAnswer === 'object' && 'options' in savedAnswer) {
                        // 新格式：对象包含options和isSubmitted
                        window.userAnswers[index] = {
                            options: savedAnswer.options || [],
                            isSubmitted: savedAnswer.isSubmitted || false,
                            submittedDate: savedAnswer.submittedDate
                        };
                    } else {
                        // 旧格式：直接是数组，转换为新格式
                        window.userAnswers[index] = {
                            options: JSON.parse(JSON.stringify(savedAnswer)) || [],
                            isSubmitted: false
                        };
                    }
                });
            }
        }
        
        // 清空考试模式下的用户答案，确保刷新页面后不保留考试答案
        if (savedState.isExamMode) {
            window.userAnswers = {};
        }
    }
    
    // 加载设置
    const settings = window.loadSettings();
    window.showTranslation = settings.showTranslation;
    window.autoNext = settings.autoNext;
    window.autoSubmitSingle = settings.autoSubmitSingle;
    
    // 设置UI状态
    document.getElementById('showTranslation').checked = window.showTranslation;
    document.getElementById('autoNext').checked = window.autoNext;
    document.getElementById('autoSubmitSingle').checked = window.autoSubmitSingle;
    document.getElementById('langText').textContent = window.currentLanguage === 'zhcn' ? '中/EN' : 'EN/中';
    
    // 如果有保存的题库，更新下拉菜单选中状态
    if (window.currentBank && document.getElementById('bankSelect')) {
        document.getElementById('bankSelect').value = window.currentBank;
        console.log('🔍 初始化: 下拉菜单值设置为:', window.currentBank, '实际值:', document.getElementById('bankSelect').value);
    } else {
        console.log('🔍 初始化: 没有保存的题库或下拉菜单不存在');
    }
    
    // 更新模式选择器状态
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) {
        // 考试模式状态不进行持久化，刷新页面后强制设置为练习模式
        if (window.isStudyMode) {
            modeSelect.value = 'study';
            document.getElementById('statsPanel').style.display = 'none';
        } else {
            modeSelect.value = 'practice';
            document.getElementById('statsPanel').style.display = 'block';
        }
    }
    
    // 如果不是考试模式且有保存的题库，则加载它
    if (!window.isExamMode && window.currentBank) {
        window.loadBank(window.currentBank);
    } else if (!window.isExamMode) {
        // 默认加载综合题库
        window.loadBank('general');
    }
    
    // 监听状态变化事件
    window.addEventListener('beforeunload', window.saveStateToCookie);
});