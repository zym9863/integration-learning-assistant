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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            定积分可视化计算
          </h1>

          <div className="w-20"> {/* 占位符保持布局平衡 */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* 控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 函数输入 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                函数设置
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    被积函数 f(x)：
                  </label>
                  <input
                    type="text"
                    value={state.functionExpr}
                    onChange={(e) => setState(prev => ({ ...prev, functionExpr: e.target.value }))}
                    placeholder="例如: x^2, sin(x), exp(x)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    支持: x^n, sin(x), cos(x), exp(x), sqrt(x), ln(x), abs(x)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      下限 a：
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={state.lowerBound}
                      onChange={(e) => setState(prev => ({ ...prev, lowerBound: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      上限 b：
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={state.upperBound}
                      onChange={(e) => setState(prev => ({ ...prev, upperBound: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateIntegral}
                  disabled={isCalculating}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCalculating ? "计算中..." : "计算定积分"}
                </button>
              </div>
            </div>

            {/* 黎曼和设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                黎曼和演示
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.showRiemannSum}
                    onChange={(e) => setState(prev => ({ ...prev, showRiemannSum: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">显示黎曼和矩形</span>
                </label>

                {state.showRiemannSum && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      矩形数量：{state.riemannSteps}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={state.riemannSteps}
                      onChange={(e) => setState(prev => ({ ...prev, riemannSteps: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 计算结果 */}
            {(state.result !== null || state.error) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  计算结果
                </h3>
                
                {state.error ? (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
                    错误：{state.error}
                  </div>
                ) : state.result !== null ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900 dark:border-green-700">
                      <div className="text-center">
                        <div className="text-lg font-mono text-gray-800 dark:text-white mb-2">
                          ∫<sub>{state.lowerBound}</sub><sup>{state.upperBound}</sup> {state.functionExpr} dx
                        </div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                          ≈ {state.result.toFixed(6)}
                        </div>
                      </div>
                    </div>
                    
                    {state.showRiemannSum && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>黎曼和 ({state.riemannSteps} 个矩形)：</div>
                        <div className="font-mono">
                          {(() => {
                            const { sum } = calculateRiemannSum(state.functionExpr, state.lowerBound, state.upperBound, state.riemannSteps);
                            return sum.toFixed(6);
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* 示例函数 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                示例函数
              </h3>
              <div className="space-y-2">
                {exampleFunctions.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => useExample(example)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <span className="font-mono">{example.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      [{example.bounds[0]}, {example.bounds[1]}]
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 图形显示区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                函数图像与积分区域
              </h3>
              
              <div className="h-96 md:h-[500px]">
                <ClientOnlyPlot
                  data={plotData}
                  layout={{
                    title: {
                      text: `定积分可视化: ∫ ${state.functionExpr} dx`,
                      font: { size: 16 }
                    },
                    xaxis: {
                      title: 'x',
                      grid: true,
                      zeroline: true
                    },
                    yaxis: {
                      title: 'f(x)',
                      grid: true,
                      zeroline: true
                    },
                    showlegend: true,
                    legend: {
                      x: 0.02,
                      y: 0.98,
                      bgcolor: 'rgba(255,255,255,0.8)'
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

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>• 蓝色曲线：函数 f(x) = {state.functionExpr}</p>
                <p>• 蓝色阴影区域：定积分的几何意义</p>
                <p>• 红色虚线：积分上下限</p>
                {state.showRiemannSum && (
                  <p>• 橙色矩形：黎曼和近似（{state.riemannSteps} 个矩形）</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 学习说明 */}
        <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            定积分的几何意义
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">定积分定义：</h4>
              <p className="mb-2">
                定积分 ∫ᵃᵇ f(x) dx 表示函数 f(x) 在区间 [a, b] 上与 x 轴围成的有向面积。
              </p>
              <ul className="space-y-1">
                <li>• 当 f(x) ≥ 0 时，积分值为正（x轴上方的面积）</li>
                <li>• 当 f(x) ≤ 0 时，积分值为负（x轴下方的面积）</li>
                <li>• 总积分值 = 上方面积 - 下方面积</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">黎曼和近似：</h4>
              <p className="mb-2">
                通过分割区间为小矩形来近似曲线下的面积。矩形越多，近似越精确。
              </p>
              <ul className="space-y-1">
                <li>• 矩形宽度：Δx = (b-a)/n</li>
                <li>• 矩形高度：f(xᵢ)</li>
                <li>• 黎曼和：Σf(xᵢ)·Δx</li>
                <li>• 当 n→∞ 时，黎曼和趋向于定积分的精确值</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
