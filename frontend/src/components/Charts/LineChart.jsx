import React from 'react';

const LineChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  const padding = 20;
  const chartHeight = height - padding * 2;
  const chartWidth = 100;

  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + (1 - (item.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height - padding} ${points} ${chartWidth},${height - padding}`;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${height}`} className="absolute inset-0">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <polygon
            fill="url(#areaGradient)"
            points={areaPoints}
          />
          
          {/* Line */}
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * chartWidth;
            const y = padding + (1 - (item.value - minValue) / range) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="hover:r-5 transition-all duration-200 cursor-pointer"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
          {data.map((item, index) => (
            <span key={index} className="text-center truncate" style={{ maxWidth: `${100 / data.length}%` }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;