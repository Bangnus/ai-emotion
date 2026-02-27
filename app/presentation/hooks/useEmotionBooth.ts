"use client";

import { useEffect, useRef, useState } from "react";

import {
  initMediaPipe,
  detectFace,
} from "@/app/infrastructure/mediapipe/mediapipeService";

import { analyzeEmotion } from "@/app/core/emotion/emotionAnalyzer";

import { startCamera } from "@/app/core/camera/cameraService";

import { takeScreenshot } from "@/app/core/screenshot/screenshotService";

import { uploadImage } from "@/app/infrastructure/upload/uploadService";

import { generateQR } from "@/app/infrastructure/qr/qrService";

import { FaceData } from "@/app/shared/types";

export function useEmotionBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [faces, setFaces] = useState<FaceData[]>([]);

  const [qr, setQR] = useState<string | null>(null);

  const isCapturing = useRef(false);

  useEffect(() => {
    async function init() {
      await initMediaPipe();

      await startCamera(videoRef.current!);

      loop();
    }

    function loop() {
      const result = detectFace(videoRef.current!);

      if (result?.faceBlendshapes?.length && result?.faceLandmarks?.length) {
        const detectedFaces: FaceData[] = [];

        for (let i = 0; i < result.faceLandmarks.length; i++) {
          const landmarks = result.faceLandmarks[i];

          let minX = 1,
            minY = 1,
            maxX = 0,
            maxY = 0;

          for (const pt of landmarks) {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
          }

          const emotion = result.faceBlendshapes[i]
            ? analyzeEmotion(result.faceBlendshapes[i].categories)
            : { happy: 0, sad: 0, angry: 0, surprised: 0 };

          detectedFaces.push({
            box: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY,
            },
            emotion,
          });
        }

        setFaces(detectedFaces);

        // Capture if any face is happy > 80
        if (!isCapturing.current) {
          const anyHappy = detectedFaces.some((f) => f.emotion.happy > 80);
          if (anyHappy) {
            capture();
          }
        }
      } else {
        setFaces([]);
      }

      requestAnimationFrame(loop);
    }

    async function capture() {
      if (isCapturing.current) return;
      isCapturing.current = true;

      try {
        // 1. Capture screenshot
        const img = await takeScreenshot();

        // 2. Upload to server → get short URL
        const photoUrl = await uploadImage(img);

        // 3. Generate QR code from the short URL
        const qrCode = await generateQR(photoUrl);

        setQR(qrCode);
      } catch (err) {
        console.error("Capture failed:", err);
        isCapturing.current = false;
      }
    }

    init();
  }, []);

  const retake = () => {
    setQR(null);
    isCapturing.current = false;
  };

  return {
    videoRef,
    faces,
    qr,
    retake,
  };
}
