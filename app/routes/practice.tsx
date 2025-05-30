import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { evaluate, derivative, parse } from "mathjs";
import "katex/dist/katex.min.css";

export const meta: MetaFunction = () => {
  return [
    { title: "积分练习 - 积分学习助手" },
    { name: "description", content: "交互式积分练习，随机生成题目并提供实时反馈" },
  ];
};

// 积分题目类型定义
interface IntegrationProblem {
  function: string;
  displayFunction: string;
  correctAnswer: string;
  displayAnswer: string;
  method: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// 预定义的积分题目库
const problemLibrary: IntegrationProblem[] = [
  // 简单题目
  {
    function: "x^2",
    displayFunction: "x²",
    correctAnswer: "x^3/3 + C",
    displayAnswer: "x³/3 + C",
    method: "幂函数积分法",
    steps: [
      "使用幂函数积分公式: ∫x^n dx = x^(n+1)/(n+1) + C",
      "这里 n = 2",
      "所以 ∫x² dx = x³/3 + C"
    ],
    difficulty: 'easy'
  },
  {
    function: "2*x + 3",
    displayFunction: "2x + 3",
    correctAnswer: "x^2 + 3*x + C",
    displayAnswer: "x² + 3x + C",
    method: "线性函数积分法",
    steps: [
      "分别对每一项积分",
      "∫2x dx = x²",
      "∫3 dx = 3x",
      "所以 ∫(2x + 3) dx = x² + 3x + C"
    ],
    difficulty: 'easy'
  },
  {
    function: "sin(x)",
    displayFunction: "sin(x)",
    correctAnswer: "-cos(x) + C",
    displayAnswer: "-cos(x) + C",
    method: "三角函数积分法",
    steps: [
      "使用基本三角函数积分公式",
      "∫sin(x) dx = -cos(x) + C"
    ],
    difficulty: 'easy'
  },
  {
    function: "cos(x)",
    displayFunction: "cos(x)",
    correctAnswer: "sin(x) + C",
    displayAnswer: "sin(x) + C",
    method: "三角函数积分法",
    steps: [
      "使用基本三角函数积分公式",
      "∫cos(x) dx = sin(x) + C"
    ],
    difficulty: 'easy'
  },
  // 中等难度题目
  {
    function: "e^x",
    displayFunction: "eˣ",
    correctAnswer: "e^x + C",
    displayAnswer: "eˣ + C",
    method: "指数函数积分法",
    steps: [
      "指数函数 e^x 的积分是它本身",
      "∫eˣ dx = eˣ + C"
    ],
    difficulty: 'medium'
  },
  {
    function: "1/x",
    displayFunction: "1/x",
    correctAnswer: "ln(abs(x)) + C",
    displayAnswer: "ln|x| + C",
    method: "对数函数积分法",
    steps: [
      "这是对数函数的导数的逆运算",
      "∫(1/x) dx = ln|x| + C",
      "注意要加绝对值符号"
    ],
    difficulty: 'medium'
  },
  {
    function: "x*e^x",
    displayFunction: "x·eˣ",
    correctAnswer: "(x-1)*e^x + C",
    displayAnswer: "(x-1)eˣ + C",
    method: "分部积分法",
    steps: [
      "使用分部积分公式: ∫u dv = uv - ∫v du",
      "设 u = x, dv = eˣ dx",
      "则 du = dx, v = eˣ",
      "∫x·eˣ dx = x·eˣ - ∫eˣ dx = x·eˣ - eˣ + C = (x-1)eˣ + C"
    ],
    difficulty: 'medium'
  },
  // 困难题目
  {
    function: "x*sin(x)",
    displayFunction: "x·sin(x)",
    correctAnswer: "sin(x) - x*cos(x) + C",
    displayAnswer: "sin(x) - x·cos(x) + C",
    method: "分部积分法",
    steps: [
      "使用分部积分公式: ∫u dv = uv - ∫v du",
      "设 u = x, dv = sin(x) dx",
      "则 du = dx, v = -cos(x)",
      "∫x·sin(x) dx = x·(-cos(x)) - ∫(-cos(x)) dx",
      "= -x·cos(x) + ∫cos(x) dx",
      "= -x·cos(x) + sin(x) + C"
    ],
    difficulty: 'hard'
  }
];

export default function Practice() {
  const [currentProblem, setCurrentProblem] = useState<IntegrationProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | 'hint' | null;
    message: string;
  }>({ type: null, message: "" });
  const [showSteps, setShowSteps] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // 生成新题目
  const generateNewProblem = () => {
    const filteredProblems = problemLibrary.filter(p => p.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    setCurrentProblem(filteredProblems[randomIndex]);
    setUserAnswer("");
    setFeedback({ type: null, message: "" });
    setShowSteps(false);
  };

  // 检查答案
  const checkAnswer = () => {
    if (!currentProblem || !userAnswer.trim()) {
      setFeedback({
        type: 'incorrect',
        message: "请输入你的答案！"
      });
      return;
    }

    try {
      // 简化的答案检查逻辑
      const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
      const normalizedCorrectAnswer = currentProblem.correctAnswer.toLowerCase().replace(/\s/g, '');
      
      // 检查主要的答案结构（去除常数项C的比较）
      const userAnswerWithoutC = normalizedUserAnswer.replace(/[+\-]?c$/i, '');
      const correctAnswerWithoutC = normalizedCorrectAnswer.replace(/[+\-]?c$/i, '');

      if (userAnswerWithoutC === correctAnswerWithoutC || 
          normalizedUserAnswer === normalizedCorrectAnswer ||
          checkAlternativeAnswers(userAnswer, currentProblem.correctAnswer)) {
        setFeedback({
          type: 'correct',
          message: "答案正确！🎉"
        });
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setFeedback({
          type: 'incorrect',
          message: "答案不正确，请再试一次。"
        });
        setScore(prev => ({ total: prev.total + 1, correct: prev.correct }));
      }
    } catch (error) {
      setFeedback({
        type: 'incorrect',
        message: "答案格式有误，请检查输入。"
      });
    }
  };

  // 检查可能的正确答案格式
  const checkAlternativeAnswers = (userAnswer: string, correctAnswer: string): boolean => {
    const alternatives = [
      userAnswer.replace(/\*\*/g, '^'), // 将 ** 替换为 ^
      userAnswer.replace(/\^/g, '**'), // 将 ^ 替换为 **
      userAnswer.replace(/ln\|([^|]+)\|/g, 'log(abs($1))'), // ln|x| 格式转换
    ];
    
    return alternatives.some(alt => 
      alt.toLowerCase().replace(/\s/g, '') === correctAnswer.toLowerCase().replace(/\s/g, '')
    );
  };

  // 显示提示
  const showHint = () => {
    if (!currentProblem) return;
    
    setFeedback({
      type: 'hint',
      message: `提示：使用${currentProblem.method}来解决这个问题。`
    });
  };

  // 初始化时生成第一个题目
  useEffect(() => {
    generateNewProblem();
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <Link
            to="/"
            className="flex items-center px-4 py-2 glass rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border-0 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              积分练习
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="glass rounded-xl px-6 py-4 border-0 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">当前得分</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {score.correct}/{score.total}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${score.total > 0 ? (score.correct / score.total) * 100 : 0}%`}}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '0%'} 正确率
              </div>
            </div>
          </div>
        </div>

        {/* 难度选择 */}
        <div className="max-w-4xl mx-auto mb-8 animate-scale-in" style={{animationDelay: '0.2s'}}>
          <div className="card glass border-0 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                选择难度级别
              </h3>
              <div className="flex space-x-4">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-600/90 shadow-md backdrop-blur-sm'
                    }`}
                  >
                    {level === 'easy' ? '🌱 简单' : level === 'medium' ? '🚀 中等' : '⭐ 困难'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 题目区域 */}
        <div className="max-w-4xl mx-auto">
          <div className="card glass border-0 backdrop-blur-sm animate-scale-in mb-6" style={{animationDelay: '0.4s'}}>
            <div className="p-8">
              {currentProblem && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 text-center">
                      计算下列不定积分
                    </h2>
                    <div className="glass rounded-2xl p-8 border-0 backdrop-blur-sm">
                      <div className="text-4xl text-center font-mono">
                        <span className="text-gray-800 dark:text-white">
                          ∫ <span className="text-blue-600 dark:text-blue-400 font-bold">{currentProblem.displayFunction}</span> dx = ?
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 答案输入 */}
                  <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      你的答案：
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="例如：x^3/3 + C"
                        className="input-modern flex-1 text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      />
                      <button
                        onClick={checkAnswer}
                        className="btn-primary"
                      >
                        检查答案
                      </button>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      💡 提示：使用 ^ 表示幂次，例如 x^2；不要忘记常数项 C
                    </div>
                  </div>

                  {/* 反馈区域 */}
                  {feedback.type && (
                    <div className={`mb-8 p-4 rounded-xl font-medium animate-scale-in ${
                      feedback.type === 'correct' 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:border-green-700 dark:text-green-200'
                        : feedback.type === 'hint'
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 text-yellow-800 dark:from-yellow-900/50 dark:to-orange-900/50 dark:border-yellow-700 dark:text-yellow-200'
                        : 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 text-red-800 dark:from-red-900/50 dark:to-pink-900/50 dark:border-red-700 dark:text-red-200'
                    }`}>
                      {feedback.message}
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-4">
                      <button
                        onClick={showHint}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        💡 提示
                      </button>
                      <button
                        onClick={() => setShowSteps(!showSteps)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {showSteps ? '隐藏步骤' : '显示解题步骤'}
                      </button>
                    </div>
                    <button
                      onClick={generateNewProblem}
                      className="btn-success"
                    >
                      下一题 →
                    </button>
                  </div>

                  {/* 解题步骤 */}
                  {showSteps && (
                    <div className="glass rounded-2xl p-6 border-0 backdrop-blur-sm animate-scale-in">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        解题步骤 ({currentProblem.method})
                      </h3>
                      <ol className="space-y-3">
                        {currentProblem.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border-l-4 border-blue-500">
                        <strong className="text-blue-800 dark:text-blue-200 text-lg">
                          ✅ 正确答案：{currentProblem.displayAnswer}
                        </strong>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 学习提示 */}
          <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.6s'}}>
            <div className="p-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                积分技巧提醒
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3 text-lg">🧮 基本公式</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• ∫x^n dx = x^(n+1)/(n+1) + C</li>
                    <li>• ∫sin(x) dx = -cos(x) + C</li>
                    <li>• ∫cos(x) dx = sin(x) + C</li>
                    <li>• ∫e^x dx = e^x + C</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                  <h4 className="font-bold text-green-700 dark:text-green-300 mb-3 text-lg">⚡ 常用方法</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• 直接积分法</li>
                    <li>• 换元积分法</li>
                    <li>• 分部积分法</li>
                    <li>• 有理函数积分</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
