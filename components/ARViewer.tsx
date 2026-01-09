import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Box, RotateCcw } from 'lucide-react';
import { MenuItem } from '../types';

interface ARViewerProps {
  item: MenuItem;
  onClose: () => void;
}

export const ARViewer: React.FC<ARViewerProps> = ({ item, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [modelPlaced, setModelPlaced] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* AR Viewport */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        {hasPermission === false ? (
          <div className="absolute inset-0 flex items-center justify-center text-white p-6 text-center">
            <p>Camera access is required for AR mode. Please enable permissions or view the 2D image.</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}

        {/* Simulated 3D Model Overlay */}
        {modelPlaced ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow">
            <div className="relative group">
               {/* 3D Simulation using Image + CSS Transform */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-white/30 transform transition-transform duration-700 hover:rotate-12 hover:scale-110"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
                }}
              />
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg whitespace-nowrap">
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-amber-400 text-sm">${item.basePrice}</p>
              </div>
            </div>
          </div>
        ) : (
           hasPermission && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 border-dashed rounded-lg w-64 h-64 flex items-center justify-center">
                  <span className="text-white/80 font-medium bg-black/50 px-3 py-1 rounded">Tap to Place Dish</span>
              </div>
            </div>
           )
        )}
        
        {/* Interaction Layer */}
        {!modelPlaced && hasPermission && (
             <button 
                onClick={() => setModelPlaced(true)}
                className="absolute inset-0 w-full h-full cursor-pointer z-10"
                aria-label="Place item"
             />
        )}
      </div>

      {/* AR UI Controls */}
      <div className="bg-black/80 backdrop-blur-xl p-6 text-white safe-area-bottom">
        <div className="flex justify-between items-center max-w-lg mx-auto">
            <div className="flex flex-col">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">AR Visualization Mode</p>
            </div>
            
            <div className="flex gap-4">
                {modelPlaced && (
                    <button 
                        onClick={() => setModelPlaced(false)}
                        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                )}
                <button 
                    onClick={onClose}
                    className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
