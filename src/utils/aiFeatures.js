/**
 * AI Features Utility
 * Integrates with Google Gemini API for free-tier code intelligence.
 */

// Securely routes all AI requests to the serverless backend.

const callGemini = async (systemPrompt, userPrompt) => {
  try {
    const response = await fetch('/api/gemini', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ systemPrompt, userPrompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to communicate with AI endpoint");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * AI Code Explainer
 */
export const explainCode = async (code, language) => {
  const systemPrompt = "You are an expert software engineer. Explain the following code line-by-line in plain English. Keep it concise, professional, and clear.";
  const userPrompt = `Language: ${language}\n\nCode:\n${code}`;
  return await callGemini(systemPrompt, userPrompt);
};

/**
 * AI Refactor Suggestions
 */
export const refactorCode = async (code, language) => {
  const systemPrompt = "You are a senior developer specializing in clean code and design patterns. Refactor the provided code to be more efficient, readable, and idiomatic. Return ONLY the refactored code without any explanations or markdown code blocks.";
  const userPrompt = `Language: ${language}\n\nCode:\n${code}`;
  return await callGemini(systemPrompt, userPrompt);
};

/**
 * AI Bug Fixer
 */
export const fixBug = async (code, bugMessage, language) => {
  const systemPrompt = "You are a debugging expert. Fix the specific issue identified in the code. Return ONLY the corrected code without any explanations or markdown code blocks.";
  const userPrompt = `Language: ${language}\nIssue: ${bugMessage}\n\nFull Code:\n${code}`;
  return await callGemini(systemPrompt, userPrompt);
};

/**
 * Natural Language to Code
 */
export const generateCode = async (prompt, language) => {
  const systemPrompt = `You are a coding assistant. Generate high-quality ${language} code based on the user's description. Return ONLY the raw code without any conversational text or markdown formatting tags.`;
  const userPrompt = `Task: ${prompt}`;
  return await callGemini(systemPrompt, userPrompt);
};

/**
 * AI Code Review
 */
export const reviewCode = async (code, language) => {
  const systemPrompt = `You are a senior developer conducting a pull request review. Provide comprehensive feedback on the code.
Return your response in a structured format with these sections:
### OVERALL
(A brief summary of the code quality)
### STRENGTHS
(Bullet points of what was done well)
### ISSUES
(Bullet points of bugs, anti-patterns, or performance concerns)
### RECOMMENDATIONS
(Actionable steps for improvement)`;
  const userPrompt = `Language: ${language}\n\nCode:\n${code}`;
  return await callGemini(systemPrompt, userPrompt);
};

/**
 * AI Error Explainer Dictionary
 */
export const explainError = async (errorMessage, language) => {
  const systemPrompt = `You are a developer diagnostic assistant. Analyze the provided error message or stack trace for the ${language} language.
Provide a clean, structured response in EXACT JSON format containing the following fields:
{
  "meaning": "Explain what this error means in plain English in a single simple paragraph.",
  "cause": "Explain the most likely cause of this error in a single simple paragraph.",
  "fix": "Explain how to fix it step by step.",
  "correctCode": "Provide a clean, short code example demonstrating the correct way to write this to avoid the error."
}
Return ONLY the raw JSON without any markdown formatting wrappers (like \`\`\`json) or conversational text.`;
  const userPrompt = `Language: ${language}\nError/Stack Trace:\n${errorMessage}`;
  
  const response = await callGemini(systemPrompt, userPrompt);
  try {
    // Strip codeblock wrappers if Gemini added them despite prompt instructions
    const cleanJson = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Failed to parse Gemini JSON output, returning raw text as meaning", response);
    return {
      meaning: response,
      cause: "Could not automatically parse structured causes.",
      fix: "Verify code syntax and logic.",
      correctCode: "// Refer to the explanation above"
    };
  }
};

