import React from 'react';

const BarChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="flex items-end justify-between space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
              style={{
                height: `${(item.value / maxValue) * (height - 40)}px`,
                minHeight: '4px'
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;