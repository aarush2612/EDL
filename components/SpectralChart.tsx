import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Defs, LinearGradient, Stop } from 'recharts';
import { SORTED_FILTERS } from '../constants';

interface SpectralChartProps {
  data: number[] | null;
}

type ChartType = 'histogram' | 'continuous';

export const SpectralChart: React.FC<SpectralChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('continuous');

  // Map raw data array to sorted chart data
  const chartData = React.useMemo(() => {
    if (!data) {
      // Return empty placeholder data
      return SORTED_FILTERS.map(filter => ({
        name: filter.label,
        wl: filter.wavelength,
        value: 0,
        color: filter.color,
        range: filter.range
      }));
    }

    return SORTED_FILTERS.map(filter => ({
      name: filter.label,
      wl: filter.wavelength,
      value: data[filter.index] || 0,
      color: filter.color,
      range: filter.range
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-xl">
          <p className="font-bold text-gray-200">{point.name} ({point.wl}nm)</p>
          <p className="text-sm text-gray-400">Range: {point.range[0]}-{point.range[2]}nm</p>
          <p className="text-xl font-mono text-white mt-1">
            Count: <span style={{ color: point.color }}>{point.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Spectral Analysis
          </h2>
          <div className="text-xs text-gray-500 font-mono mt-1">
            X: Wavelength (nm) | Y: Intensity (counts)
          </div>
        </div>

        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setChartType('continuous')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              chartType === 'continuous'
                ? 'bg-gray-700 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Continuous
          </button>
          <button
            onClick={() => setChartType('histogram')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              chartType === 'histogram'
                ? 'bg-gray-700 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Histogram
          </button>
        </div>
      </div>

      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'histogram' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={300}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <XAxis 
                dataKey="wl" 
                xAxisId={1} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 10, dy: 5 }} 
                interval={0}
              />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                  {chartData.map((entry, index) => (
                    <stop 
                      key={index} 
                      offset={`${(index / (chartData.length - 1)) * 100}%`} 
                      stopColor={entry.color} 
                      stopOpacity={0.8}
                    />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="wl" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
                label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -15, fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#url(#colorValue)" 
                fill="url(#colorValue)" 
                strokeWidth={3}
                fillOpacity={0.4}
                animationDuration={300}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
