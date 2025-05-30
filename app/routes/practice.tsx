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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            积分练习
          </h1>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">得分</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {score.correct}/{score.total}
              </div>
            </div>
          </div>
        </div>

        {/* 难度选择 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              选择难度级别
            </h3>
            <div className="flex space-x-4">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    difficulty === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 题目区域 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
            {currentProblem && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    计算下列不定积分：
                  </h2>
                  <div className="text-3xl text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-800 dark:text-white">
                      ∫ {currentProblem.displayFunction} dx = ?
                    </span>
                  </div>
                </div>

                {/* 答案输入 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    你的答案：
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="例如：x^3/3 + C"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <button
                      onClick={checkAnswer}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      检查答案
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    提示：使用 ^ 表示幂次，例如 x^2；不要忘记常数项 C
                  </div>
                </div>

                {/* 反馈区域 */}
                {feedback.type && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    feedback.type === 'correct' 
                      ? 'bg-green-100 border border-green-300 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : feedback.type === 'hint'
                      ? 'bg-yellow-100 border border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {feedback.message}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-between">
                  <div className="space-x-4">
                    <button
                      onClick={showHint}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      💡 提示
                    </button>
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {showSteps ? '隐藏步骤' : '显示解题步骤'}
                    </button>
                  </div>
                  <button
                    onClick={generateNewProblem}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    下一题
                  </button>
                </div>

                {/* 解题步骤 */}
                {showSteps && (
                  <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      解题步骤（{currentProblem.method}）：
                    </h3>
                    <ol className="space-y-2">
                      {currentProblem.steps.map((step, index) => (
                        <li key={index} className="flex text-gray-700 dark:text-gray-300">
                          <span className="font-medium mr-3">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded border-l-4 border-blue-400">
                      <strong className="text-blue-800 dark:text-blue-200">
                        正确答案：{currentProblem.displayAnswer}
                      </strong>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 学习提示 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              积分技巧提醒
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">基本公式：</h4>
                <ul className="space-y-1">
                  <li>• ∫x^n dx = x^(n+1)/(n+1) + C</li>
                  <li>• ∫sin(x) dx = -cos(x) + C</li>
                  <li>• ∫cos(x) dx = sin(x) + C</li>
                  <li>• ∫e^x dx = e^x + C</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">常用方法：</h4>
                <ul className="space-y-1">
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
  );
}
