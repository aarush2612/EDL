import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SpectralChart } from './components/SpectralChart';
import { StatsPanel } from './components/StatsPanel';
import { ControlPanel } from './components/ControlPanel';
import { serialService } from './services/serialService';
import { calculateCCT } from './utils/colorUtils';
import { ConnectionStatus, LogEntry } from './types';
import { SORTED_FILTERS, FLICKER_THRESHOLD } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [currentData, setCurrentData] = useState<number[] | null>(null);
  const [cct, setCct] = useState<number>(0);
  
  // Logging state
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [logData, setLogData] = useState<LogEntry[]>([]);
  
  // Refs to access latest state inside callbacks without dependency issues
  const isLoggingRef = useRef(isLogging);
  
  useEffect(() => {
    isLoggingRef.current = isLogging;
  }, [isLogging]);

  const handleData = useCallback((data: number[]) => {
    setCurrentData(data);

    // Calculate CCT based on the 12 known spectral channels
    const spectralPoints = SORTED_FILTERS.map(f => ({
      filter: f,
      value: data[f.index] || 0
    }));
    
    const calculatedCCT = calculateCCT(spectralPoints);
    setCct(calculatedCCT);

    // Logging logic
    if (isLoggingRef.current) {
      setLogData(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          values: data,
          cct: calculatedCCT
        }
      ]);
    }
  }, []);

  const handleConnect = async () => {
    setStatus(ConnectionStatus.CONNECTING);
    await serialService.connect(
      (data) => {
        setStatus(ConnectionStatus.CONNECTED);
        handleData(data);
      },
      (errorMsg) => {
        console.error(errorMsg);
        setStatus(ConnectionStatus.ERROR);
        alert(`Connection Failed: ${errorMsg}`);
        setStatus(ConnectionStatus.DISCONNECTED);
      }
    );
  };

  const handleDisconnect = async () => {
    await serialService.disconnect();
    setStatus(ConnectionStatus.DISCONNECTED);
    setCurrentData(null);
  };

  const handleDownload = () => {
    if (logData.length === 0) return;

    // Create CSV content
    const header = [
      'Timestamp', 
      'CCT',
      ...Array.from({ length: 18 }, (_, i) => `CH_${i}`)
    ].join(',');

    const rows = logData.map(entry => {
      return [
        entry.timestamp,
        entry.cct,
        ...entry.values
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `spectrometer_log_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLog = () => {
    if (window.confirm('Are you sure you want to clear the recorded data?')) {
      setLogData([]);
    }
  };

  // Flicker detection: true when reading at index 5 exceeds configured threshold
  const flicker = !!(currentData && (currentData[5] || 0) > FLICKER_THRESHOLD);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <Header 
        status={status} 
        onConnect={handleConnect} 
        onDisconnect={handleDisconnect} 
      />

      <main className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col">
        <div className="container mx-auto h-full flex flex-col">
          
          {/* Top Stats Area */}
          <StatsPanel cct={cct} data={currentData} />

          {/* Main Content Grid */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
            
            {/* Chart Area - Takes up 3/4 width */}
            <div className="lg:col-span-3 min-h-[400px]">
              <SpectralChart data={currentData} />
            </div>

            {/* Controls Area - Takes up 1/4 width */}
            <div className="lg:col-span-1 min-h-[400px]">
              <ControlPanel 
                isLogging={isLogging} 
                logCount={logData.length}
                onToggleLogging={() => setIsLogging(!isLogging)}
                onDownload={handleDownload}
                onClear={handleClearLog}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer / Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-800 p-2 text-center text-xs text-gray-500">
        Using 12-channel mapping for AS7341/TCS3448 | Data Rate: ~100ms | 18 Total Channels Read
        <span className={`ml-2 font-medium ${flicker ? 'text-red-400' : 'text-green-400'}`}>
          Flicker: {flicker ? 'DETECTED' : 'Not Detected'}
        </span>
      </footer>
    </div>
  );
};

export default App;
