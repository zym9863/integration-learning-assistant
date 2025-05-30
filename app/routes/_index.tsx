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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 animate-slide-up">
          <div className="mb-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-glow">
              积分学习助手
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          </div>
          <p className="text-2xl text-gray-700 dark:text-gray-300 font-light">
            Interactive Integration Learning Assistant
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            通过可视化和交互式练习，让积分学习变得更加直观有趣
          </p>
        </header>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* 交互式积分练习 */}
          <Link
            to="/practice"
            className="group relative card card-hover glass animate-scale-in backdrop-blur-lg border-0 overflow-hidden"
            style={{animationDelay: '0.2s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl mr-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    交互式积分练习
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                随机生成积分题目，实时判断答案正确性，提供详细的解题步骤和反馈。
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  多种函数类型练习
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  智能答案判断
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  详细解题提示
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  难度自适应调整
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="btn-primary inline-flex items-center px-6 py-3 text-sm font-semibold">
                  开始练习
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  🎯 练习模式
                </div>
              </div>
            </div>
          </Link>

          {/* 定积分可视化计算 */}
          <Link
            to="/visualize"
            className="group relative card card-hover glass animate-scale-in backdrop-blur-lg border-0 overflow-hidden"
            style={{animationDelay: '0.4s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    定积分可视化计算
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                输入被积函数和积分区间，动态展示定积分的几何意义和计算过程。
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  函数图像动态绘制
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  积分区域高亮显示
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  黎曼和逼近演示
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  精确数值计算
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="btn-success inline-flex items-center px-6 py-3 text-sm font-semibold">
                  开始可视化
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  📊 可视化模式
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 学习资源和帮助 */}
        <div className="max-w-4xl mx-auto">
          <div className="card glass backdrop-blur-lg border-0 animate-scale-in" style={{animationDelay: '0.6s'}}>
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  学习建议
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">选择适合你的学习路径，循序渐进掌握积分知识</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">🌱</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                      初学者推荐
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">先学习基本积分公式</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">通过可视化理解积分概念</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">逐步练习各种题型</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/30 dark:border-green-700/30">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">🚀</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                      进阶学习
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">1</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">掌握换元积分法</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">2</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">学习分部积分法</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">3</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">练习复杂函数积分</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-purple-700 dark:text-purple-300 font-medium">建议先从可视化工具开始，建立直观理解后再进行练习</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
