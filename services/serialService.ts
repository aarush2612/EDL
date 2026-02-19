// Web Serial API types
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

interface Serial {
  requestPort(options?: { filters: Array<{ usbVendorId?: number; usbProductId?: number }> }): Promise<SerialPort>;
}

declare global {
  interface Navigator {
    serial: Serial;
  }
}

export class SerialService {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private readableStreamClosed: Promise<void> | null = null;
  private keepReading = false;

  async connect(
    onData: (data: number[]) => void, 
    onError: (msg: string) => void
  ): Promise<void> {
    if (!('serial' in navigator)) {
      onError('Web Serial API is not supported in this browser.');
      return;
    }

    try {
      this.port = await navigator.serial.requestPort();
      // Baud rate matches Python script
      await this.port.open({ baudRate: 115200 });
      
      this.keepReading = true;
      this.readLoop(onData, onError);
    } catch (err: any) {
      console.error('Connection error:', err);
      onError(err.message || 'Failed to connect to device.');
    }
  }

  async disconnect() {
    this.keepReading = false;
    
    // 1. Cancel the reader. This triggers the stream to close.
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }

    // 2. Wait for the stream pipe to finish cleanly.
    if (this.readableStreamClosed) {
      try {
        await this.readableStreamClosed;
      } catch (e) {
        // Ignore errors during stream closing
      }
      this.readableStreamClosed = null;
    }

    // 3. Now it is safe to close the port.
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {
        console.error("Error closing port:", e);
      }
      this.port = null;
    }
  }

  private async readLoop(onData: (data: number[]) => void, onError: (msg: string) => void) {
    if (!this.port || !this.port.readable) return;

    const textDecoder = new TextDecoderStream();
    
    // Track the pipe promise so we can wait for it to close in disconnect()
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    
    const reader = textDecoder.readable.getReader();
    this.reader = reader;

    let buffer = '';

    try {
      while (this.keepReading) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          // Process all complete lines
          buffer = lines.pop() || ''; // Keep the last partial line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
              this.parseLine(trimmed, onData);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Read error:', error);
      onError(error.message || 'Error reading data stream.');
    } finally {
      reader.releaseLock();
    }
  }

  private parseLine(line: string, onData: (data: number[]) => void) {
    // Python code: data = list(map(int, raw.split(",")))
    // Expecting comma separated values
    try {
      const parts = line.split(',');
      const values = parts.map(p => parseInt(p, 10));
      
      // Basic validation based on Python "if len(data) != 18"
      if (values.length === 18 && values.every(v => !isNaN(v))) {
        onData(values);
      }
    } catch (e) {
      // Ignore parse errors for noise
    }
  }
}

export const serialService = new SerialService();
