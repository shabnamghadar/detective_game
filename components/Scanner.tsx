'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function Scanner({ onScan, onClose }: ScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    const startScanner = async () => {
      try {
        // 1. Get cameras
        const devices = await Html5Qrcode.getCameras();
        if (!isMountedRef.current) return;

        if (!devices || devices.length === 0) {
          setError("No cameras found on this device.");
          return;
        }

        // 2. Initialize scanner instance if not exists
        if (!scannerRef.current) {
           const formatsToSupport = [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.UPC_A
          ];
          scannerRef.current = new Html5Qrcode("reader", { 
            formatsToSupport,
            verbose: false 
          });
        }

        // 3. Start scanning (use the first camera)
        const cameraId = devices[0].id;
        
        // Prevent double-start
        if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
        }

        await scannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isMountedRef.current) {
              onScan(decodedText);
              // Stop immediately after success to prevent multiple triggers
              if (scannerRef.current) {
                 scannerRef.current.stop().catch(console.error).finally(() => {
                    scannerRef.current?.clear();
                 });
              }
            }
          },
          (errorMessage) => {
            // Ignore frame-by-frame errors
          }
        );

        if (isMountedRef.current) {
          setIsScanning(true);
          setError(null);
        }

      } catch (err: any) {
        console.error("Scanner Error:", err);
        if (isMountedRef.current) {
          setError("Could not start camera. Please check permissions.");
        }
      }
    };

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(startScanner, 100);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(err => console.error("Stop failed", err))
          .finally(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          });
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Camera className="w-6 h-6 text-indigo-600" /> 
            Scan Clue
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        {/* Scanner Viewport */}
        <div className="relative bg-black min-h-[350px] flex items-center justify-center overflow-hidden">
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 z-10">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" /> 
              <span className="font-medium">Starting Camera...</span>
            </div>
          )}
          
          {error && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center z-10 bg-black/80">
               <AlertCircle className="w-10 h-10 mb-2" />
               <p className="font-bold">{error}</p>
               <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-black rounded-full text-sm font-bold">
                 Close
               </button>
             </div>
          )}

          <div id="reader" className="w-full h-full object-cover"></div>
          
          {/* Overlay Guide */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[250px] h-[250px] border-4 border-indigo-500/50 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
              <div className="absolute bottom-8 text-white/90 font-medium bg-black/50 px-4 py-2 rounded-full text-sm">
                Align code within the box
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
