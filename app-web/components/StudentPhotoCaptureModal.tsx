"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X } from "lucide-react";

interface StudentPhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture: (photoBlob: Blob) => void;
}

export function StudentPhotoCaptureModal({
  isOpen,
  onClose,
  onPhotoCapture,
}: StudentPhotoCaptureModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedPhoto(photoDataUrl);

    // Stop camera after capture
    stopCamera();
  }, [stream]);

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (!capturedPhoto || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onPhotoCapture(blob);
          handleClose();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhoto(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Capturar Foto do Aluno
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera/Photo Preview */}
          <div className="relative h-[400px] bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center">
            {error ? (
              <div className="text-center p-6">
                <Camera className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <p className="text-red-500">{error}</p>
                <Button
                  onClick={startCamera}
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt="Foto capturada"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!capturedPhoto ? (
              <>
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!stream || !!error}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar Foto
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={retake}
                  variant="outline"
                  className="flex-1 bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Tirar Novamente
                </Button>
                <Button
                  type="button"
                  onClick={confirmPhoto}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Foto
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
