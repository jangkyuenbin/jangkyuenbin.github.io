// Markdown解析和数学公式渲染工具

/**
 * 解析Markdown文本
 * @param {string} text Markdown文本
 * @returns {string} 解析后的HTML
 */
export function parseMarkdown(text) {
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
            let processedText = text;
            
            // 检查是否存在需要修复的反斜杠模式
            const needsBackslashFix = processedText.includes('\(') || processedText.includes('\[');
            
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
            const containsBracket = html.includes('\(') || html.includes('\[');
            console.log('解析后的HTML是否保留公式标记: $=', containsDollar, '\()/\[]=', containsBracket);
            
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

/**
 * 渲染数学公式
 * @param {HTMLElement} element 要渲染公式的元素
 * @returns {boolean} 是否渲染成功
 */
export function renderMathFormulas(element) {
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