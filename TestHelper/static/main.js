// 全局变量
let currentBank = null;
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = {};
let isStudyMode = false; // false: 练习模式, true: 背题模式
let showTranslation = true;
let autoNext = false;
let autoSubmitSingle = false; // 是否在单选题中自动提交答案
let currentLanguage = 'zhcn';

// markdown解析函数
function parseMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    try {
        // 确保marked库已加载
        if (window.marked) {
            return marked.parse(text);
        }
    } catch (e) {
        console.error('Markdown解析失败:', e);
    }
    // 如果解析失败或marked库未加载，则返回原始文本
    return text;
}

// Cookie相关函数
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
    }
    return null;
}

function saveStateToCookie() {
    const state = {
        currentBank,
        isStudyMode,
        showTranslation,
        autoNext,
        currentLanguage
    };
    
    // 只有在练习模式下，才保存练习状态
    if (!isStudyMode) {
        state.currentQuestionIndex = currentQuestionIndex;
        // 转换userAnswers格式，确保isSubmitted属性能够被正确保存
        const formattedUserAnswers = {};
        Object.keys(userAnswers).forEach(index => {
            const answer = userAnswers[index];
            if (Array.isArray(answer)) {
                // 如果是数组（旧格式），转换为对象格式
                formattedUserAnswers[index] = {
                    options: answer,
                    isSubmitted: answer.isSubmitted || false
                };
            } else {
                // 如果已经是对象格式，直接保存
                formattedUserAnswers[index] = answer;
            }
        });
        state.userAnswers = formattedUserAnswers;
    }
    
    setCookie('testHelperState', state);
}

function loadStateFromCookie() {
    const state = getCookie('testHelperState');
    if (state) {
        currentBank = state.currentBank || currentBank;
        isStudyMode = state.isStudyMode !== undefined ? state.isStudyMode : isStudyMode;
        showTranslation = state.showTranslation !== undefined ? state.showTranslation : showTranslation;
        autoNext = state.autoNext !== undefined ? state.autoNext : autoNext;
        currentLanguage = state.currentLanguage || currentLanguage;
        
        // 只有在练习模式下，才恢复练习状态
        if (!state.isStudyMode) {
            currentQuestionIndex = state.currentQuestionIndex || currentQuestionIndex;
            
            // 处理userAnswers，确保格式一致
            if (state.userAnswers) {
                userAnswers = {};
                Object.keys(state.userAnswers).forEach(index => {
                    const savedAnswer = state.userAnswers[index];
                    if (savedAnswer && typeof savedAnswer === 'object' && 'options' in savedAnswer) {
                        // 新格式：对象包含options和isSubmitted
                        userAnswers[index] = savedAnswer.options;
                        userAnswers[index].isSubmitted = savedAnswer.isSubmitted || false;
                    } else {
                        // 旧格式：直接是数组
                        userAnswers[index] = JSON.parse(JSON.stringify(savedAnswer));
                    }
                });
            }
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    // 从cookie加载状态
    loadStateFromCookie();
    
    // 加载设置
    loadSettings();
    
    // 设置UI状态
    document.getElementById('showTranslation').checked = showTranslation;
    document.getElementById('autoNext').checked = autoNext;
    document.getElementById('langText').textContent = currentLanguage === 'zhcn' ? '中/EN' : 'EN/中';
    
    // 如果有保存的题库，更新下拉菜单选中状态
    if (currentBank && document.getElementById('bankSelect')) {
        document.getElementById('bankSelect').value = currentBank;
    }
    
    // 更新模式按钮状态
    const modeBtn = document.getElementById('modeBtn');
    if (isStudyMode) {
        modeBtn.textContent = '切换到 ✏️ 练习模式';
        modeBtn.classList.remove('btn-primary');
        modeBtn.classList.add('btn-warning');
        document.getElementById('statsPanel').style.display = 'none';
        // 更新当前模式显示
        document.getElementById('currentModeDisplay').textContent = '当前模式: 📖 背题模式';
    } else {
        modeBtn.textContent = '切换到 📖 背题模式';
        modeBtn.classList.remove('btn-warning');
        modeBtn.classList.add('btn-primary');
        document.getElementById('statsPanel').style.display = 'block';
        // 更新当前模式显示
        document.getElementById('currentModeDisplay').textContent = '当前模式: ✏️ 练习模式';
    }
    
    // 如果有保存的题库，则加载它
    if (currentBank) {
        loadBank(currentBank);
    } else {
        // 默认加载综合题库
        loadBank('general');
    }
    
    // 监听状态变化事件
    window.addEventListener('beforeunload', saveStateToCookie);
});

// 加载题库
async function loadBank(bankName) {
    if (!bankName) {
        bankName = document.getElementById('bankSelect').value;
    }

    if (!bankName) {
        showToast('请选择题库');
        return;
    }

    try {
        // 显示加载动画
        document.getElementById('loadingIndicator').style.display = 'flex';
        document.getElementById('questionContent').style.display = 'none';
        var response = null;
        if (bankName.toLowerCase().includes('aws')) {
            if (bankName.toLowerCase().includes('mls')) {
                response = await fetch(`./static/AWS/MLS/${bankName}.json`);
            } else {
                response = await fetch(`./static/AWS/${bankName}.json`);
            }
        } else {
            response = await fetch(`./static/${bankName}.json`);
        }

        console.log(response);
        const data = await response.json();
        questions = data;

        // 重置状态
        const savedIndex = currentBank === bankName ? currentQuestionIndex : 0;
        currentQuestionIndex = Math.min(savedIndex, questions.length - 1);
        // 只有在切换到新的题库时才清空用户答案
        if (currentBank !== bankName) {
            userAnswers = {};
        }
        currentBank = bankName;
        
        // 保存状态
        saveStateToCookie();

        // 更新UI
        document.getElementById('currentBank').textContent = getBankName(bankName);
        document.getElementById('totalQuestions').textContent = questions.length;
        document.getElementById('totalQuestionsNav').textContent = questions.length;

        // 生成题目导航
        generateQuestionNav();

        // 显示保存的题目索引
        displayQuestion(currentQuestionIndex);

        // 更新统计
        updateStats();

        // 隐藏加载动画
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('questionContent').style.display = 'block';

        showToast(`已加载 ${getBankName(bankName)}`);
    } catch (error) {
        console.error('加载题库失败:', error);
        showToast('加载题库失败，请重试');
    }
}

// 选择选项
function selectOption(optionIndex) {
    if (isStudyMode) return; // 背题模式不能选择

    const question = questions[currentQuestionIndex];
    const isMultiple = question.option.filter(o => o.option_flag).length > 1;

    // 创建一个数组来存储用户的选择，如果之前有isSubmitted状态则保留
    const currentIsSubmitted = userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].isSubmitted;
    if (!userAnswers[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex] = [];
    } else if (currentIsSubmitted) {
        // 如果已经提交过答案，清除提交状态
        delete userAnswers[currentQuestionIndex].isSubmitted;
    }

    if (isMultiple) {
        // 多选题
        const index = userAnswers[currentQuestionIndex].indexOf(optionIndex);
        if (index > -1) {
            userAnswers[currentQuestionIndex].splice(index, 1);
        } else {
            userAnswers[currentQuestionIndex].push(optionIndex);
        }
    } else {
        // 单选题
        userAnswers[currentQuestionIndex] = [optionIndex];
        
        // 如果启用了自动提交单选题答案
        if (autoSubmitSingle) {
            // 使用setTimeout让UI先更新，然后再提交答案
            setTimeout(() => {
                submitAnswer();
            }, 0);
        }
    }

    // 保存状态
    saveStateToCookie();
    
    // 重新生成题目导航，确保颜色状态正确更新
    generateQuestionNav();
    
    // 更新显示
    displayQuestion(currentQuestionIndex);
}

// 提交答案
function submitAnswer() {
    if (!userAnswers[currentQuestionIndex] || userAnswers[currentQuestionIndex].length === 0) {
        showToast('请先选择答案');
        return;
    }

    // 标记答案为已提交
    userAnswers[currentQuestionIndex].isSubmitted = true;

    // 更新统计
    updateStats();

    // 更新导航
    generateQuestionNav();

    // 显示结果
displayQuestion(currentQuestionIndex);

// 在练习模式下，提交答案后自动滚动到解析模块
if (!isStudyMode) {
    setTimeout(() => {
        const analysisSection = document.querySelector('.analysis-section');
        if (analysisSection) {
            analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

    // 显示提示
    const isCorrect = isCorrectAnswer(currentQuestionIndex, userAnswers[currentQuestionIndex]);
    showToast(isCorrect ? '✅ 回答正确！' : '❌ 回答错误，请查看解析');
    
    // 保存状态
    saveStateToCookie();

    // 自动下一题
    if (autoNext && currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
            displayQuestion(currentQuestionIndex + 1);
        }, 1500);
    }
}

// 切换模式
function toggleMode() {
    isStudyMode = !isStudyMode;
    const btn = document.getElementById('modeBtn');

    // 清空历史选择
    userAnswers = {};
    
    // 保存模式切换状态，但保持当前题目索引不变
    saveStateToCookie();

    if (isStudyMode) {
        btn.textContent = '切换到 ✏️ 练习模式';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-warning');
        document.getElementById('statsPanel').style.display = 'none';
        // 更新当前模式显示
        document.getElementById('currentModeDisplay').textContent = '当前模式: 📖 背题模式';
    } else {
        btn.textContent = '切换到 📖 背题模式';
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-primary');
        document.getElementById('statsPanel').style.display = 'block';
        // 更新当前模式显示
        document.getElementById('currentModeDisplay').textContent = '当前模式: ✏️ 练习模式';
    }
    
    // 更新统计信息
    updateStats();
    
    // 重新生成题目导航
    if (questions.length > 0) {
        generateQuestionNav();
    }
    
    // 保存状态
    saveStateToCookie();

    // 重新显示当前题目
    if (questions.length > 0) {
        displayQuestion(currentQuestionIndex);
    }
}

// 切换语言
function toggleLanguage() {
    currentLanguage = currentLanguage === 'zhcn' ? 'enus' : 'zhcn';
    document.getElementById('langText').textContent = currentLanguage === 'zhcn' ? '中/EN' : 'EN/中';
    
    // 保存状态
    saveStateToCookie();

    if (questions.length > 0) {
        displayQuestion(currentQuestionIndex);
    }
}

// 更新显示设置
function updateDisplay() {
    showTranslation = document.getElementById('showTranslation').checked;
    
    // 保存设置
    saveSettings();
    
    if (questions.length > 0) {
        displayQuestion(currentQuestionIndex);
    }
}

// 更新设置
function updateSettings() {
    autoNext = document.getElementById('autoNext').checked;
    saveSettings();
}

// 更新自动提交单选题设置
function updateAutoSubmitSingle() {
    autoSubmitSingle = document.getElementById('autoSubmitSingle').checked;
    saveSettings();
}

// 保存设置到Cookie
function saveSettings() {
    setCookie('showTranslation', showTranslation ? 'true' : 'false', 30);
    setCookie('autoNext', autoNext ? 'true' : 'false', 30);
    setCookie('autoSubmitSingle', autoSubmitSingle ? 'true' : 'false', 30);
}

// 加载设置
function loadSettings() {
    const savedShowTranslation = getCookie('showTranslation');
    showTranslation = savedShowTranslation === null ? true : (savedShowTranslation === 'true');
    autoNext = getCookie('autoNext') === 'true';
    autoSubmitSingle = getCookie('autoSubmitSingle') === 'true';
    
    // 更新UI
    if (document.getElementById('showTranslation')) {
        document.getElementById('showTranslation').checked = showTranslation;
    }
    if (document.getElementById('autoNext')) {
        document.getElementById('autoNext').checked = autoNext;
    }
    if (document.getElementById('autoSubmitSingle')) {
        document.getElementById('autoSubmitSingle').checked = autoSubmitSingle;
    }
}

// 获取题库名称
function getBankName(bankName) {
    const names = {
        general: '综合题库 Example',
        aws_mls_c01_example: 'AWS-MLS(C01) Example',
        aws_mls_c01_all: 'AWS-MLS(C01) ALL',
        aws_mls_c01_all_doubao: 'AWS-MLS(C01) DouBao',
        aws_mls_c01_all_deepseek: 'AWS-MLS(C01) DeepSeek'

    };
    return names[bankName] || '未知题库';
}

// 生成题目导航
function generateQuestionNav() {
    const grid = document.getElementById('questionGrid');
    grid.innerHTML = '';

    questions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = index + 1;
        item.onclick = () => displayQuestion(index);

        // 检查答题状态 - 只有已提交的答案才标记正确/错误
        if (userAnswers[index] !== undefined && typeof userAnswers[index].isSubmitted !== 'undefined' && userAnswers[index].isSubmitted) {
            if (isCorrectAnswer(index, userAnswers[index])) {
                item.classList.add('correct');
            } else {
                item.classList.add('incorrect');
            }
        } else if (!isStudyMode && userAnswers[index] !== undefined && userAnswers[index].length > 0) {
            // 在练习模式下，已选择但未提交答案的题目显示为橙色
            item.classList.add('pending');
        }

        grid.appendChild(item);
    });
}

// 显示题目
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const question = questions[index];

    // 更新当前题目显示
    document.getElementById('currentQuestion').textContent = index + 1;

    // 更新导航高亮
    document.querySelectorAll('.question-item').forEach((item, i) => {
        item.classList.toggle('current', i === index);
    });
    
    // 保存状态，确保在背题模式下也能保存当前题目
    saveStateToCookie();

    // 生成题目HTML
    const isMultiple = question.option.filter(o => o.option_flag).length > 1;
    const typeClass = isMultiple ? 'type-multiple' : 'type-single';
    const typeText = isMultiple ? '多选题' : '单选题';

    let html = `
            <div class="question-header">
                <span class="question-type ${typeClass}">${typeText}</span>
                <span>题目 ID: ${question.id}</span>
            </div>
            <div class="question-text">
                <div>${parseMarkdown(question.question[currentLanguage])}</div>
                ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${parseMarkdown(question.question.enus)}</div>` : ''}
                ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${parseMarkdown(question.question.zhcn)}</div>` : ''}
            </div>
            <div class="options-container">
        `;

    // 生成选项
    question.option.forEach((option, optIndex) => {
        const isSelected = userAnswers[index] && userAnswers[index].includes(optIndex);
        const isCorrect = option.option_flag;
        // 只有在背题模式或已经提交答案后才显示正确结果
        const showResult = isStudyMode || (userAnswers[index] !== undefined && typeof userAnswers[index].isSubmitted !== 'undefined' && userAnswers[index].isSubmitted);

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
                <div class="${optionClass}" onclick="selectOption(${optIndex})">
                    <div class="option-checkbox"></div>
                    <div class="option-text">
                        <div>${parseMarkdown(option.option_text[currentLanguage])}</div>
                        ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${parseMarkdown(option.option_text.enus)}</div>` : ''}
                        ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${parseMarkdown(option.option_text.zhcn)}</div>` : ''}
                    </div>
                </div>
            `;
    });

    html += '</div>';

    // 显示解析（背题模式或已提交答案）
    if (isStudyMode || (userAnswers[index] !== undefined && typeof userAnswers[index].isSubmitted !== 'undefined' && userAnswers[index].isSubmitted)) {
        html += `
                <div class="analysis-section">
                    <div class="analysis-title">📝 解析</div>
                    <div class="analysis-content">
                        <div>${parseMarkdown(question.analysis[currentLanguage])}</div>
                        ${showTranslation && currentLanguage === 'zhcn' ? `<div class="translation">${parseMarkdown(question.analysis.enus)}</div>` : ''}
                        ${showTranslation && currentLanguage === 'enus' ? `<div class="translation">${parseMarkdown(question.analysis.zhcn)}</div>` : ''}
                    </div>
                </div>
            `;
    }

    // 添加操作按钮
    html += '<div class="action-buttons">';

    if (index > 0) {
        html += `<button class="btn btn-outline" onclick="displayQuestion(${index - 1})">\u2B05 上一题</button>`;
    }

    if (!isStudyMode && (!userAnswers[index] || typeof userAnswers[index].isSubmitted === 'undefined' || !userAnswers[index].isSubmitted)) {
        html += '<button class="btn btn-primary" onclick="submitAnswer()">提交答案</button>';
    }

    if (index < questions.length - 1) {
        html += `<button class="btn btn-outline" onclick="displayQuestion(${index + 1})">下一题 \u27A1</button>`;
    }

    html += '</div>';

    document.getElementById('questionContent').innerHTML = html;

    // 移除自动滚动到顶部的行为
}

// 检查答案是否正确
function isCorrectAnswer(questionIndex, userAnswer) {
    const question = questions[questionIndex];
    const correctAnswers = question.option
        .map((opt, index) => opt.option_flag ? index : -1)
        .filter(index => index !== -1);

    if (correctAnswers.length !== userAnswer.length) return false;

    return correctAnswers.every(ans => userAnswer.includes(ans));
}

// 更新统计信息
function updateStats() {
    const answered = Object.keys(userAnswers).filter(index => 
        userAnswers[index] && userAnswers[index].isSubmitted === true
    ).length;
    let correct = 0;

    Object.keys(userAnswers).forEach(index => {
        const answer = userAnswers[index];
        if (answer && answer.isSubmitted === true && isCorrectAnswer(parseInt(index), answer)) {
            correct++;
        }
    });

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    document.getElementById('answeredQuestions').textContent = answered;
    document.getElementById('correctQuestions').textContent = correct;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// 切换设置面板
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('show');
}

// 显示提示信息
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 键盘快捷键
document.addEventListener('keydown', function (e) {
    if (questions.length === 0) return;

    switch (e.key) {
        case 'ArrowLeft':
            if (currentQuestionIndex > 0) {
                displayQuestion(currentQuestionIndex - 1);
            }
            break;
        case 'ArrowRight':
            if (currentQuestionIndex < questions.length - 1) {
                displayQuestion(currentQuestionIndex + 1);
            }
            break;
        case 'Enter':
            if (!isStudyMode && userAnswers[currentQuestionIndex] === undefined) {
                submitAnswer();
            }
            break;
        case 'm':
        case 'M':
            toggleMode();
            break;
        case 'l':
        case 'L':
            toggleLanguage();
            break;
    }
});

// 重置练习状态
function resetPractice() {
    if (isStudyMode) {
        showToast('请先切换到练习模式');
        return;
    }
    
    // 清空用户答案记录
    userAnswers = {};
    
    // 重置当前题目索引
    currentQuestionIndex = 0;
    
    // 保存状态
    saveStateToCookie();
    
    // 更新统计信息
    updateStats();
    
    // 重新生成题目导航
    generateQuestionNav();
    
    // 显示第一题
    if (questions.length > 0) {
        displayQuestion(0);
    }
    
    // 显示提示信息
    showToast('已重置练习状态');
}