import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "积分学习助手 - Integration Learning Assistant" },
    { name: "description", content: "交互式积分练习和可视化学习工具" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            积分学习助手
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Interactive Integration Learning Assistant
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* 交互式积分练习 */}
          <Link
            to="/practice"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 group"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                交互式积分练习
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              随机生成积分题目，实时判断答案正确性，提供详细的解题步骤和反馈。
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>• 多种函数类型练习</li>
              <li>• 智能答案判断</li>
              <li>• 详细解题提示</li>
              <li>• 难度自适应调整</li>
            </ul>
            <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              <span className="font-medium">开始练习</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* 定积分可视化计算 */}
          <Link
            to="/visualize"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 group"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                定积分可视化计算
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              输入被积函数和积分区间，动态展示定积分的几何意义和计算过程。
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>• 函数图像动态绘制</li>
              <li>• 积分区域高亮显示</li>
              <li>• 黎曼和逼近演示</li>
              <li>• 精确数值计算</li>
            </ul>
            <div className="mt-6 flex items-center text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
              <span className="font-medium">开始可视化</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* 学习资源和帮助 */}
        <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            学习建议
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                初学者推荐
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. 先学习基本积分公式</li>
                <li>2. 通过可视化理解积分概念</li>
                <li>3. 逐步练习各种题型</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                进阶学习
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. 掌握换元积分法</li>
                <li>2. 学习分部积分法</li>
                <li>3. 练习复杂函数积分</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
