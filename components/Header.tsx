import React from 'react';
import { ConnectionStatus } from '../types';

interface HeaderProps {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, onConnect, onDisconnect }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;

  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SpectroVis Pro</h1>
            <p className="text-xs text-gray-400">TCS3448/AS7341 Spectral Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-xs font-mono text-gray-300">{status}</span>
          </div>

          {!isConnected ? (
            <button
              onClick={onConnect}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Device
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all shadow-lg shadow-red-900/50"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
