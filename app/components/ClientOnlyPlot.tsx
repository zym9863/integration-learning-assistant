import { useState, useEffect } from "react";

interface PlotData {
  x: number[];
  y: number[];
  type?: string;
  mode?: string;
  name?: string;
  line?: any;
  fill?: string;
  fillcolor?: string;
  showlegend?: boolean;
  hovertemplate?: string;
}

interface PlotProps {
  data: PlotData[];
  layout: any;
  config?: any;
  style?: React.CSSProperties;
}

export default function ClientOnlyPlot({ data, layout, config, style }: PlotProps) {
  const [Plot, setPlot] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 只在客户端加载 Plotly
    if (typeof window !== 'undefined') {
      import('react-plotly.js').then((plotlyModule) => {
        setPlot(() => plotlyModule.default);
        setIsLoaded(true);
      }).catch((error) => {
        console.error('Failed to load Plotly:', error);
      });
    }
  }, []);

  if (!isLoaded || !Plot) {
    return (
      <div 
        style={style}
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">加载图表中...</p>
        </div>
      </div>
    );
  }

  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      style={style}
    />
  );
}
