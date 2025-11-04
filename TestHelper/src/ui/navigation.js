// 题目导航UI组件

/**
 * 生成题目导航网格
 * @param {Array} questions 题目数组
 * @param {Object} userAnswers 用户答案
 * @param {boolean} isStudyMode 是否为背题模式
 * @param {HTMLElement} container 容器元素
 */
export function generateQuestionNav(questions, userAnswers, isStudyMode, container) {
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = index + 1;
        item.onclick = () => window.displayQuestion(index);

        // 检查答题状态 - 只有已提交的答案才标记正确/错误
        const userAnswer = userAnswers[index];
        const isSubmitted = userAnswer && userAnswer.isSubmitted;
        const hasOptions = userAnswer && userAnswer.options && userAnswer.options.length > 0;
        
        if (isSubmitted) {
            if (window.isCorrectAnswer(questions[index], userAnswer.options || userAnswer)) {
                item.classList.add('correct');
            } else {
                item.classList.add('incorrect');
            }
        } else if (!isStudyMode && hasOptions) {
            // 在练习模式下，已选择但未提交答案的题目显示为橙色
            item.classList.add('pending');
        }

        container.appendChild(item);
    });
}

/**
 * 更新导航高亮
 * @param {number} currentIndex 当前题目索引
 * @param {HTMLElement} container 导航容器
 */
export function updateNavHighlight(currentIndex, container) {
    container.querySelectorAll('.question-item').forEach((item, i) => {
        item.classList.toggle('current', i === currentIndex);
    });
}

/**
 * 更新统计信息显示
 * @param {Object} userAnswers 用户答案
 * @param {Array} questions 题目数组
 */
export function updateStatsDisplay(userAnswers, questions) {
    const answered = Object.keys(userAnswers).filter(index => 
        userAnswers[index] && userAnswers[index].isSubmitted === true
    ).length;
    let correct = 0;

    Object.keys(userAnswers).forEach(index => {
        const answer = userAnswers[index];
        if (answer && answer.isSubmitted === true) {
            const userOptions = answer.options || answer;
            if (window.isCorrectAnswer(questions[parseInt(index)], userOptions)) {
                correct++;
            }
        }
    });

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    // 添加DOM元素存在性检查，防止出现Cannot set properties of null错误
    const answeredQuestionsElement = document.getElementById('answeredQuestions');
    if (answeredQuestionsElement) {
        answeredQuestionsElement.textContent = answered;
    }
    
    const correctQuestionsElement = document.getElementById('correctQuestions');
    if (correctQuestionsElement) {
        correctQuestionsElement.textContent = correct;
    }
    
    const accuracyElement = document.getElementById('accuracy');
    if (accuracyElement) {
        accuracyElement.textContent = accuracy + '%';
    }
}