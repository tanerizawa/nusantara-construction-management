import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

/**
 * Signature Pad Component
 * Allows user to draw digital signature
 */
const SignaturePad = ({ onSave, onCancel, label = "Tanda Tangan" }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const saveSignature = () => {
    if (isEmpty) {
      alert('Silakan buat tanda tangan terlebih dahulu');
      return;
    }

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2E] rounded-lg p-6 max-w-2xl w-full mx-4 border border-[#38383A]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <button
            onClick={onCancel}
            className="text-[#8E8E93] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-[#8E8E93] mb-4">
          Gunakan mouse atau touchpad untuk membuat tanda tangan Anda
        </p>

        <div className="bg-white rounded-lg p-2 mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-dashed border-gray-300 rounded cursor-crosshair w-full"
            style={{ touchAction: 'none' }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearSignature}
            className="flex-1 flex items-center justify-center gap-2 bg-[#48484A] text-white px-4 py-2 rounded-lg hover:bg-[#48484A]/80 transition-colors"
          >
            <RotateCcw size={16} />
            Hapus
          </button>
          <button
            onClick={saveSignature}
            disabled={isEmpty}
            className="flex-1 flex items-center justify-center gap-2 bg-[#30D158] text-white px-4 py-2 rounded-lg hover:bg-[#30D158]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} />
            Simpan Tanda Tangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
