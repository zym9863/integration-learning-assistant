import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { evaluate, parse } from "mathjs";
import ClientOnlyPlot from "~/components/ClientOnlyPlot";

export const meta: MetaFunction = () => {
  return [
    { title: "定积分可视化 - 积分学习助手" },
    { name: "description", content: "定积分几何意义可视化和数值计算" },
  ];
};

interface VisualizationState {
  functionExpr: string;
  lowerBound: number;
  upperBound: number;
  result: number | null;
  error: string | null;
  showRiemannSum: boolean;
  riemannSteps: number;
}

export default function Visualize() {
  const [state, setState] = useState<VisualizationState>({
    functionExpr: "x^2",
    lowerBound: 0,
    upperBound: 2,
    result: null,
    error: null,
    showRiemannSum: false,
    riemannSteps: 10
  });

  const [plotData, setPlotData] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // 预定义的示例函数
  const exampleFunctions = [
    { expr: "x^2", name: "x²", bounds: [0, 2] },
    { expr: "sin(x)", name: "sin(x)", bounds: [0, 3.14159] },
    { expr: "exp(x)", name: "eˣ", bounds: [0, 1] },
    { expr: "1/x", name: "1/x", bounds: [1, 3] },
    { expr: "sqrt(x)", name: "√x", bounds: [0, 4] },
    { expr: "x^3 - 2*x^2 + x", name: "x³-2x²+x", bounds: [-1, 3] }
  ];

  // 计算函数值
  const evaluateFunction = (expr: string, x: number): number => {
    try {
      const compiled = parse(expr).compile();
      return compiled.evaluate({ x });
    } catch (error) {
      throw new Error("函数表达式无效");
    }
  };

  // 数值积分（梯形法则）
  const numericalIntegration = (expr: string, a: number, b: number, n: number = 1000): number => {
    const h = (b - a) / n;
    let sum = 0;
    
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const weight = i === 0 || i === n ? 1 : 2;
      sum += weight * evaluateFunction(expr, x);
    }
    
    return (h / 2) * sum;
  };

  // 计算黎曼和
  const calculateRiemannSum = (expr: string, a: number, b: number, n: number): { sum: number, rectangles: any[] } => {
    const dx = (b - a) / n;
    let sum = 0;
    const rectangles = [];

    for (let i = 0; i < n; i++) {
      const x = a + i * dx;
      const height = evaluateFunction(expr, x + dx / 2); // 中点法
      sum += height * dx;
      
      rectangles.push({
        x: [x, x + dx, x + dx, x, x],
        y: [0, 0, height, height, 0],
        mode: 'lines',
        type: 'scatter',
        fill: 'tonexty',
        fillcolor: 'rgba(255, 165, 0, 0.3)',
        line: { color: 'orange', width: 1 },
        showlegend: false,
        hovertemplate: `矩形 ${i + 1}<br>底边: ${dx.toFixed(3)}<br>高度: ${height.toFixed(3)}<br>面积: ${(height * dx).toFixed(3)}<extra></extra>`
      });
    }

    return { sum, rectangles };
  };

  // 生成绘图数据
  const generatePlotData = () => {
    try {
      const { functionExpr, lowerBound, upperBound, showRiemannSum, riemannSteps } = state;
      
      // 生成函数曲线数据
      const xValues = [];
      const yValues = [];
      const step = (upperBound - lowerBound) / 200;
      
      for (let x = lowerBound - 1; x <= upperBound + 1; x += step) {
        try {
          const y = evaluateFunction(functionExpr, x);
          if (isFinite(y)) {
            xValues.push(x);
            yValues.push(y);
          }
        } catch (e) {
          // 跳过无效点
        }
      }

      const traces: any[] = [
        {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: `f(x) = ${functionExpr}`,
          line: { color: 'blue', width: 3 }
        }
      ];

      // 积分区域填充
      const integralX = [];
      const integralY = [];
      for (let x = lowerBound; x <= upperBound; x += (upperBound - lowerBound) / 100) {
        try {
          const y = evaluateFunction(functionExpr, x);
          if (isFinite(y)) {
            integralX.push(x);
            integralY.push(y);
          }
        } catch (e) {
          // 跳过无效点
        }
      }

      traces.push({
        x: integralX,
        y: integralY,
        type: 'scatter',
        mode: 'lines',
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 100, 255, 0.3)',
        line: { color: 'rgba(0, 100, 255, 0.8)', width: 2 },
        name: '积分区域',
        hovertemplate: 'x: %{x:.3f}<br>f(x): %{y:.3f}<extra></extra>'
      });

      // 积分边界线
      const leftBoundY = evaluateFunction(functionExpr, lowerBound);
      const rightBoundY = evaluateFunction(functionExpr, upperBound);
      
      traces.push({
        x: [lowerBound, lowerBound],
        y: [0, leftBoundY],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'red', width: 2, dash: 'dash' },
        name: `x = ${lowerBound}`,
        showlegend: false
      });

      traces.push({
        x: [upperBound, upperBound],
        y: [0, rightBoundY],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'red', width: 2, dash: 'dash' },
        name: `x = ${upperBound}`,
        showlegend: false
      });

      // 黎曼和矩形
      if (showRiemannSum) {
        const { rectangles } = calculateRiemannSum(functionExpr, lowerBound, upperBound, riemannSteps);
        traces.push(...rectangles);
      }

      setPlotData(traces);
      setState(prev => ({ ...prev, error: null }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "绘图时发生错误" 
      }));
    }
  };

  // 计算定积分
  const calculateIntegral = async () => {
    setIsCalculating(true);
    try {
      const { functionExpr, lowerBound, upperBound } = state;
      
      // 验证函数
      evaluateFunction(functionExpr, (lowerBound + upperBound) / 2);
      
      // 计算积分
      const result = numericalIntegration(functionExpr, lowerBound, upperBound);
      
      setState(prev => ({ 
        ...prev, 
        result, 
        error: null 
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "计算积分时发生错误",
        result: null 
      }));
    } finally {
      setIsCalculating(false);
    }
  };

  // 使用示例函数
  const useExample = (example: typeof exampleFunctions[0]) => {
    setState(prev => ({
      ...prev,
      functionExpr: example.expr,
      lowerBound: example.bounds[0],
      upperBound: example.bounds[1],
      result: null,
      error: null
    }));
  };

  // 当参数改变时重新生成图形
  useEffect(() => {
    generatePlotData();
  }, [state.functionExpr, state.lowerBound, state.upperBound, state.showRiemannSum, state.riemannSteps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <Link
            to="/"
            className="flex items-center px-4 py-2 glass rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border-0 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              定积分可视化计算
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="w-20"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* 控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 函数输入 */}
            <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                  函数设置
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      被积函数 f(x)：
                    </label>
                    <input
                      type="text"
                      value={state.functionExpr}
                      onChange={(e) => setState(prev => ({ ...prev, functionExpr: e.target.value }))}
                      placeholder="例如: x^2, sin(x), exp(x)"
                      className="input-modern"
                    />
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                      支持: x^n, sin(x), cos(x), exp(x), sqrt(x), ln(x), abs(x)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        下限 a：
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={state.lowerBound}
                        onChange={(e) => setState(prev => ({ ...prev, lowerBound: parseFloat(e.target.value) || 0 }))}
                        className="input-modern"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        上限 b：
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={state.upperBound}
                        onChange={(e) => setState(prev => ({ ...prev, upperBound: parseFloat(e.target.value) || 0 }))}
                        className="input-modern"
                      />
                    </div>
                  </div>

                  <button
                    onClick={calculateIntegral}
                    disabled={isCalculating}
                    className="btn-success w-full"
                  >
                    {isCalculating ? "计算中..." : "计算定积分"}
                  </button>
                </div>
              </div>
            </div>

            {/* 黎曼和设置 */}
            <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  黎曼和演示
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.showRiemannSum}
                      onChange={(e) => setState(prev => ({ ...prev, showRiemannSum: e.target.checked }))}
                      className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">显示黎曼和矩形</span>
                  </label>

                  {state.showRiemannSum && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                      <label className="block text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3">
                        矩形数量：{state.riemannSteps}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={state.riemannSteps}
                        onChange={(e) => setState(prev => ({ ...prev, riemannSteps: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer dark:bg-orange-700"
                      />
                      <div className="flex justify-between text-xs text-orange-600 dark:text-orange-400 mt-2">
                        <span>5 (粗糙)</span>
                        <span>50 (精细)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 计算结果 */}
            {(state.result !== null || state.error) && (
              <div className="card glass border-0 backdrop-blur-sm animate-scale-in">
                <div className="p-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    计算结果
                  </h3>
                  
                  {state.error ? (
                    <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 text-red-800 rounded-xl dark:from-red-900/50 dark:to-pink-900/50 dark:border-red-700 dark:text-red-200">
                      ❌ 错误：{state.error}
                    </div>
                  ) : state.result !== null ? (
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl dark:from-green-900/30 dark:to-emerald-900/30 dark:border-green-700">
                        <div className="text-center">
                          <div className="text-lg font-mono text-gray-800 dark:text-white mb-3">
                            ∫<sub className="text-sm">{state.lowerBound}</sub><sup className="text-sm">{state.upperBound}</sup> <span className="text-blue-600 dark:text-blue-400 font-bold">{state.functionExpr}</span> dx
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ≈ {state.result.toFixed(6)}
                          </div>
                        </div>
                      </div>
                      
                      {state.showRiemannSum && (
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                          <div className="text-sm text-orange-700 dark:text-orange-300 font-semibold mb-1">
                            📊 黎曼和 ({state.riemannSteps} 个矩形)：
                          </div>
                          <div className="text-xl font-mono font-bold text-orange-800 dark:text-orange-200">
                            {(() => {
                              const { sum } = calculateRiemannSum(state.functionExpr, state.lowerBound, state.upperBound, state.riemannSteps);
                              return sum.toFixed(6);
                            })()}
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            误差：{state.result !== null ? Math.abs(state.result - (() => {
                              const { sum } = calculateRiemannSum(state.functionExpr, state.lowerBound, state.upperBound, state.riemannSteps);
                              return sum;
                            })()).toFixed(6) : 0}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* 示例函数 */}
            <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  示例函数
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {exampleFunctions.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExample(example)}
                      className="flex items-center justify-between p-3 text-sm bg-white/70 dark:bg-gray-700/70 hover:bg-white/90 dark:hover:bg-gray-600/90 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-md"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg flex items-center justify-center mr-3 font-bold text-xs">
                          f
                        </div>
                        <span className="font-mono font-semibold text-gray-800 dark:text-white">{example.name}</span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        [{example.bounds[0]}, {example.bounds[1]}]
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 图形显示区域 */}
          <div className="lg:col-span-2">
            <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  函数图像与积分区域
                </h3>
                
                <div className="h-96 md:h-[500px] bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
                  <ClientOnlyPlot
                    data={plotData}
                    layout={{
                      title: {
                        text: `定积分可视化: ∫ ${state.functionExpr} dx`,
                        font: { size: 18, color: '#4f46e5' }
                      },
                      xaxis: {
                        title: { text: 'x', font: { size: 14 } },
                        grid: true,
                        zeroline: true,
                        gridcolor: 'rgba(75, 85, 99, 0.2)'
                      },
                      yaxis: {
                        title: { text: 'f(x)', font: { size: 14 } },
                        grid: true,
                        zeroline: true,
                        gridcolor: 'rgba(75, 85, 99, 0.2)'
                      },
                      showlegend: true,
                      legend: {
                        x: 0.02,
                        y: 0.98,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        bordercolor: 'rgba(75, 85, 99, 0.2)',
                        borderwidth: 1
                      },
                      margin: { l: 60, r: 40, t: 60, b: 60 },
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)'
                    }}
                    config={{
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📈 图例说明</h4>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• <span className="text-blue-600">蓝色曲线</span>：函数 f(x) = {state.functionExpr}</li>
                      <li>• <span className="text-blue-500">蓝色阴影</span>：定积分的几何意义</li>
                      <li>• <span className="text-red-500">红色虚线</span>：积分上下限</li>
                      {state.showRiemannSum && (
                        <li>• <span className="text-orange-500">橙色矩形</span>：黎曼和近似（{state.riemannSteps} 个矩形）</li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">💡 操作提示</h4>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• 可以拖拽缩放图像</li>
                      <li>• 双击重置视图</li>
                      <li>• 悬停查看数值</li>
                      <li>• 调整矩形数量观察收敛</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 学习说明 */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="card glass border-0 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.5s'}}>
            <div className="p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 text-center">
                定积分的几何意义
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-lg flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold text-sm">∫</span>
                    定积分定义
                  </h4>
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    定积分 ∫ᵃᵇ f(x) dx 表示函数 f(x) 在区间 [a, b] 上与 x 轴围成的有向面积。
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      当 f(x) ≥ 0 时，积分值为正（x轴上方的面积）
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✓</span>
                      当 f(x) ≤ 0 时，积分值为负（x轴下方的面积）
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      总积分值 = 上方面积 - 下方面积
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
                  <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-4 text-lg flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold text-sm">Σ</span>
                    黎曼和近似
                  </h4>
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    通过分割区间为小矩形来近似曲线下的面积。矩形越多，近似越精确。
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      矩形宽度：Δx = (b-a)/n
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      矩形高度：f(xᵢ)
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      黎曼和：Σf(xᵢ)·Δx
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      当 n→∞ 时，黎曼和趋向于定积分的精确值
                    </li>
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
