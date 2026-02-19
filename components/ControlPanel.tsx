import React from 'react';
import { LogEntry } from '../types';

interface ControlPanelProps {
  isLogging: boolean;
  logCount: number;
  onToggleLogging: () => void;
  onDownload: () => void;
  onClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isLogging, 
  logCount, 
  onToggleLogging, 
  onDownload,
  onClear
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Data Logger
        </h2>
        <div className="px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
          <span className="text-xs font-mono text-gray-300">{logCount} samples</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onToggleLogging}
          className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            isLogging 
              ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' 
              : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/30'
          }`}
        >
          {isLogging ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Stop Logging
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Logging
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDownload}
            disabled={logCount === 0}
            className={`py-2 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-1 ${
              logCount === 0 
                ? 'bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed' 
                : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>

          <button
            onClick={onClear}
            disabled={logCount === 0 || isLogging}
            className={`py-2 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-1 ${
              logCount === 0 || isLogging
                ? 'bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed' 
                : 'bg-gray-800 text-red-300 border-gray-600 hover:bg-red-900/20 hover:border-red-500/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Log
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-950 rounded border border-gray-800 h-[200px] overflow-y-auto text-xs font-mono text-gray-400">
           <div className="flex justify-between border-b border-gray-800 pb-1 mb-1">
             <span>Time</span>
             <span>CCT</span>
           </div>
           {logCount === 0 && <div className="text-center italic mt-10 opacity-50">No data logged</div>}
           {/* We can't show all logs here easily without prop drilling huge arrays, usually better to just show status or last few entries if we had them. 
               For now, this is a placeholder for visual completeness or we could pass last entry.
           */}
           <p className="text-center mt-2 text-gray-600">
             {isLogging ? 'Logging active...' : 'Ready to log.'}
           </p>
        </div>
      </div>
    </div>
  );
};
