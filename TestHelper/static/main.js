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

// markdown解析函数 - 确保正确处理数学公式
function parseMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    
    console.log('开始解析Markdown内容，长度:', text.length);
    
    try {
        // 确保marked库已加载
        if (window.marked) {
            // 配置marked以更好地处理数学公式
            if (!marked.defaults || !marked.defaults.renderer) {
                console.warn('marked默认配置未正确初始化');
            }
            
            // 处理JSON中反斜杠丢失的问题
            // 1. 检查是否包含数学公式
            let processedText = text;
            
            // 尝试修复JSON解析中丢失的反斜杠
            // 将单个反斜杠后跟括号/方括号的模式转换为正确的LaTeX标记
            // 注意：在JSON中，\\ 会被解析为 \，所以我们需要检测这种情况
            
            // 检查是否存在需要修复的反斜杠模式
            const needsBackslashFix = processedText.includes('\\(') || processedText.includes('\\[');
            
            if (needsBackslashFix) {
                console.log('检测到可能需要修复反斜杠的内容');
                
                // 尝试1: 直接使用当前格式，如果解析后能正确保留则继续
                let testHtml = marked.parse(processedText);
                let hasValidMathMarkers = testHtml.includes('\\(') || testHtml.includes('\\[');
                
                // 如果尝试1失败，进行备选处理
                if (!hasValidMathMarkers) {
                    console.log('反斜杠格式无法正确保留，尝试备选方案');
                    
                    // 尝试将 \( 和 \[ 转换为 $$ 和 $ 格式
                    // 块级公式: \[ ... \] 转换为 $$ ... $$
                    processedText = processedText.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');
                    // 行内公式: \( ... \) 转换为 $ ... $
                    processedText = processedText.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
                    
                    console.log('已将LaTeX公式标记转换为$格式');
                }
            }
            
            // 解析markdown
            let html = marked.parse(processedText);
            
            // 检查解析后的HTML中的数学公式标记
            const containsDollar = html.includes('$');
            const containsBracket = html.includes('\\(') || html.includes('\\[');
            console.log('解析后的HTML是否保留公式标记: $=', containsDollar, '\\()/\\[]=', containsBracket);
            
            return html;
        } else {
            console.error('marked库未加载');
        }
    } catch (e) {
        console.error('Markdown解析失败:', e);
    }
    
    // 如果解析失败或marked库未加载，则返回原始文本
    return text;
}

// 渲染页面中的数学公式
function renderMathFormulas(element) {
    console.log('尝试渲染数学公式');
    
    // 检查是否已加载KaTeX和auto-render
    if (!window.renderMathInElement) {
        console.error('KaTeX auto-render 模块未加载');
        return false;
    }
    
    if (!element || !element.nodeType) {
        console.error('提供的元素无效或不存在');
        return false;
    }
    
    try {
        console.log('正在渲染元素:', element);
        // 使用更详细的配置并增加错误处理
        window.renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},  // 块级公式
                {left: '$', right: '$', display: false},    // 行内公式
                {left: '\\(', right: '\\)', display: false}, // LaTeX 风格的行内公式
                {left: '\\[', right: '\\]', display: true}  // LaTeX 风格的块级公式
            ],
            throwOnError: false,
            errorColor: '#ff0000', // 错误公式显示为红色
            trust: true, // 允许渲染所有公式（提高兼容性）
            strict: 'ignore' // 忽略严格模式下的错误
        });
        console.log('数学公式渲染成功');
        return true;
    } catch (e) {
        console.error('数学公式渲染失败:', e);
        return false;
    }
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
        } else if (bankName.toLowerCase().includes('acp')) {
            if (bankName.toLowerCase().includes('ai_pro')) {
                response = await fetch(`./static/ACP/AIPRO/${bankName}.json`);
            } else {
                response = await fetch(`./static/ACP/${bankName}.json`);
            }
        }
        else {
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
        aws_mls_c01_all_deepseek: 'AWS-MLS(C01) DeepSeek',
        acp_ai_pro_single: 'ACP 人工智能高级(单选题)',
        acp_ai_pro_single_example: 'ACP 人工智能高级(单选题) Example',
        acp_ai_pro_multi: 'ACP 人工智能高级(多选题)'

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
        
        // 渲染数学公式 - 使用更可靠的方式
        setTimeout(() => {
            const questionContent = document.getElementById('questionContent');
            if (questionContent) {
                console.log('准备渲染公式，内容元素:', questionContent);
                const success = renderMathFormulas(questionContent);
                
                // 如果首次渲染失败，尝试再次渲染
                if (!success) {
                    console.log('首次渲染失败，尝试重新渲染...');
                    setTimeout(() => {
                        renderMathFormulas(questionContent);
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
            // 获取顶部导航栏的高度
            const navHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 60;
            
            // 计算需要滚动的位置
            const targetPosition = questionHeader.getBoundingClientRect().top + window.pageYOffset - navHeight - 50; // 额外减去20px作为间距
            
            // 直接设置滚动位置，不使用动画
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto' // 禁用动画，直接跳转
            });
        }
    }, 10); // 短暂延迟确保DOM已更新
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