import React from 'react';
import { FLICKER_INDEX, FLICKER_THRESHOLD } from '../constants';

interface StatsPanelProps {
  cct: number;
  data: number[] | null;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ cct, data }) => {
  // Calculate a "brightness" metric as sum of all visible channels
  const totalCounts = data ? data.reduce((a, b) => a + b, 0) : 0;
  
  // Flicker detection using threshold from constants
  const isFlickerDetected = data ? data[FLICKER_INDEX] > FLICKER_THRESHOLD : false;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {/* CCT Card */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20"></div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Color Temp (CCT)</h3>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white tracking-tight">{data ? cct : '--'}</span>
          <span className="text-lg text-yellow-500 font-medium mb-1">K</span>
        </div>
        <div className="w-full h-2 bg-gradient-to-r from-orange-500 via-white to-blue-400 rounded-full mt-4 opacity-70"></div>
      </div>

      {/* Flicker Detection Card */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 transition-colors duration-300 ${isFlickerDetected ? 'bg-red-500/20' : 'bg-green-500/10'}`}></div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Flicker Status</h3>
        <div className="flex items-center gap-3 mt-1">
          <div className={`w-4 h-4 rounded-full ${isFlickerDetected ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className={`text-3xl font-bold tracking-tight ${isFlickerDetected ? 'text-red-400' : 'text-green-400'}`}>
            {data ? (isFlickerDetected ? 'DETECTED' : 'Not Detected') : '--'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-4">Sensor Channel 5 Check</p>
      </div>

      {/* Intensity Card */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
         <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Intensity</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            {totalCounts > 1000000 ? (totalCounts / 1000000).toFixed(2) + 'M' : totalCounts.toLocaleString()}
          </span>
          <span className="text-sm text-blue-400 font-medium mb-1">counts</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Sum of 18 Channels</p>
      </div>

      {/* Raw Data Preview (Smaller for layout) */}
      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-lg relative overflow-hidden flex flex-col">
        <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 flex justify-between">
          <span>Monitor</span>
          <span className="text-gray-600">18 CH</span>
        </h3>
        <div className="grid grid-cols-6 gap-1.5 overflow-y-auto custom-scrollbar">
          {data ? data.map((val, idx) => (
            <div key={idx} className={`flex flex-col items-center p-0.5 rounded border ${idx === FLICKER_INDEX ? 'bg-red-900/20 border-red-800/50' : 'bg-gray-800/50 border-gray-700/50'}`}>
               <span className="text-[8px] text-gray-500">{idx}</span>
               <span className="text-[10px] font-mono font-bold text-gray-200">{val > 9999 ? (val/1000).toFixed(0)+'k' : val}</span>
            </div>
          )) : (
             Array.from({length: 18}).map((_, idx) => (
                <div key={idx} className="h-8 bg-gray-800/30 rounded animate-pulse"></div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};
