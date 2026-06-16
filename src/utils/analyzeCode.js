/**
 * Static Code Analysis Utility
 * Performs client-side heuristic analysis on code snippets.
 */

export const analyzeCode = (code, language) => {
  const blocks = code.split('\n---\n').filter(b => b.trim());
  const languages = blocks.map(block => {
    if (block.includes('def ') || block.includes('import ')) return 'python';
    if (block.includes('function') || block.includes('const ') || block.includes('import ')) return 'javascript';
    return language;
  });

  const analyzeSingleBlock = (block, blockLang) => {
    const lines = block.split('\n');
    const totalLines = lines.length;
    const bytes = new Blob([block]).size;
    
    let commentLines = 0;
    let blankLines = 0;
    let codeLines = 0;
    
    const patterns = {
      javascript: {
        comment: /^\s*(\/\/|\/\*|\*)/,
        loop: /(for|while)\s*\(/g,
        condition: /(if|else if|switch|case|catch)\s*\(/g,
        functionDef: /function\s+([a-zA-Z0-9_$]+)|(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(async\s*)?\([^)]*\)\s*=>/g,
        functionCall: /([a-zA-Z0-9_$]+)\s*\(/g,
        errorHandling: /try\s*\{/,
        inputValidation: /(if\s*\(!|if\s*\(.*\s*===\s*null|if\s*\(.*\s*===\s*undefined)/,
      },
      python: {
        comment: /^\s*(#|'''|""")/,
        loop: /(for|while)\s+.*:/g,
        condition: /(if|elif|else|except)\s+.*:/g,
        functionDef: /def\s+([a-zA-Z0-9_$]+)\s*\(/g,
        functionCall: /([a-zA-Z0-9_$]+)\s*\(/g,
        errorHandling: /try:/,
        inputValidation: /(if\s+not|if\s+.*\s+is\s+None)/,
      }
    };

    const p = patterns[blockLang] || patterns.javascript;

    // Line Complexity for Heatmap
    const lineComplexity = lines.map(line => {
      const trimmed = line.trim();
      const match = line.match(/^(\s*)/);
      const depth = match ? Math.floor(match[1].length / 2) : 0;
      let complexity = 'simple';
      if (depth > 3 || trimmed.length > 80) complexity = 'critical';
      else if (depth > 1 || trimmed.length > 40) complexity = 'moderate';
      return { text: line, depth, complexity };
    });

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '') blankLines++;
      else if (p.comment.test(trimmed)) commentLines++;
      else codeLines++;
    });

    let cyclomaticScore = 1;
    const loopMatches = block.match(p.loop) || [];
    const conditionMatches = block.match(p.condition) || [];
    cyclomaticScore += loopMatches.length + conditionMatches.length;

    let maxDepth = Math.max(...lineComplexity.map(l => l.depth), 0);

    let bigOTime = "O(1)";
    if (loopMatches.length > 2 || maxDepth > 3) bigOTime = "O(n³)";
    else if (loopMatches.length > 1 || maxDepth > 2) bigOTime = "O(n²)";
    else if (loopMatches.length > 0) bigOTime = "O(n)";

    const bigOSpace = maxDepth > 2 ? "O(n)" : "O(1)";

    // Dependency Mapping
    const functions = [];
    const calls = [];
    let match;
    const defRegex = new RegExp(p.functionDef);
    while ((match = defRegex.exec(block)) !== null) {
      const name = match[1] || match[3];
      if (name) functions.push(name);
    }
    const callRegex = new RegExp(p.functionCall);
    while ((match = callRegex.exec(block)) !== null) {
      const name = match[1];
      if (name && !functions.includes(name) && !['if', 'for', 'while', 'switch', 'catch', 'console', 'Math', 'JSON'].includes(name)) {
        calls.push({ from: 'global', to: name });
      } else if (name && functions.includes(name)) {
        // This is a simple heuristic, ideally we'd track the current scope
        calls.push({ from: 'global', to: name });
      }
    }

    const bugs = [];
    
    // Heuristic Heuristic Warnings
    if (!p.inputValidation.test(block)) bugs.push({ severity: "Warning", message: "Missing input validation.", line: 1 });
    if (maxDepth > 3) bugs.push({ severity: "Critical", message: "Deeply nested logic.", line: 1 });
    if (!p.errorHandling.test(block)) bugs.push({ severity: "Warning", message: "No error handling.", line: 1 });

    // 1. Bracket Matching Check (Syntax Error)
    const checkBracketMatching = (text) => {
      const stack = [];
      const open = ['{', '(', '['];
      const close = ['}', ')', ']'];
      const pairs = { '}': '{', ')': '(', ']': '[' };
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (open.includes(char)) {
          stack.push({ char, index: i });
        } else if (close.includes(char)) {
          if (stack.length === 0) {
            return { error: true, char, msg: `Mismatched closing bracket '${char}'` };
          }
          const last = stack.pop();
          if (last.char !== pairs[char]) {
            return { error: true, char, msg: `Mismatched brackets: '${last.char}' closed by '${char}'` };
          }
        }
      }
      if (stack.length > 0) {
        const last = stack.pop();
        return { error: true, char: last.char, msg: `Unclosed open bracket '${last.char}'` };
      }
      return { error: false };
    };

    const bracketResult = checkBracketMatching(block);
    if (bracketResult.error) {
      bugs.push({ 
        severity: "Critical", 
        message: `Syntax Error: ${bracketResult.msg}.`, 
        line: 1 
      });
    }

    // 2. JavaScript Specific Syntax Checks
    if (blockLang === 'javascript') {
      const hasAwait = /\bawait\b/.test(block);
      const isAsync = /\basync\b/.test(block);
      if (hasAwait && !isAsync) {
        bugs.push({ 
          severity: "Critical", 
          message: "Syntax Error: 'await' operator is only allowed in async functions.", 
          line: 1 
        });
      }

      const uninitializedConst = /\bconst\s+(\w+)(?!\s*=)/.test(block);
      if (uninitializedConst) {
        bugs.push({ 
          severity: "Critical", 
          message: "Syntax Error: Missing initializer in const declaration.", 
          line: 1 
        });
      }
    }

    // 3. Python Specific Syntax Checks
    if (blockLang === 'python') {
      const lines = block.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (/^(if|elif|else|for|while|def|class|try|except|finally)\b/.test(trimmed) && !trimmed.endsWith(':') && !trimmed.includes('#')) {
          bugs.push({ 
            severity: "Critical", 
            message: `Syntax Error: Missing colon ':' at end of '${trimmed.split(' ')[0]}' statement.`, 
            line: index + 1 
          });
        }
      });

      let hasTabs = false;
      let hasSpaces = false;
      lines.forEach(line => {
        if (line.startsWith('\t')) hasTabs = true;
        if (line.startsWith(' ')) hasSpaces = true;
      });
      if (hasTabs && hasSpaces) {
        bugs.push({ 
          severity: "Critical", 
          message: "Indentation Error: Mixed tabs and spaces in indentation.", 
          line: 1 
        });
      }
    }

    let qualityScore = 100;
    qualityScore -= (bugs.filter(b => b.severity === "Critical").length * 35);
    qualityScore -= (bugs.filter(b => b.severity === "Warning").length * 15);
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    return {
      size: { totalLines, codeLines, commentLines, blankLines, bytes },
      complexity: { bigOTime, bigOSpace, nestingDepth: maxDepth, cyclomaticScore },
      lineComplexity,
      functions,
      calls,
      bugs,
      qualityScore,
      performance: {
        memoryUsage: loopMatches.length > 2 ? "High" : loopMatches.length > 0 ? "Medium" : "Low",
        cpuIntensity: cyclomaticScore > 10 ? "High" : cyclomaticScore > 5 ? "Medium" : "Low",
        readabilityScore: Math.max(0, 100 - (maxDepth * 10) - (cyclomaticScore * 2)),
      },
      suggestions: maxDepth > 3 ? ["Refactor nested code."] : ["Code looks good!"],
    };
  };

  const results = blocks.map((b, i) => analyzeSingleBlock(b, languages[i]));
  
  // Aggregate results for the UI without circular references
  return {
    ...results[0],
    allBlocks: results,
    languages,
    languageDistribution: languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {})
  };
};
