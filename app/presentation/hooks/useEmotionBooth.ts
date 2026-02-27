"use client";

import { useEffect, useRef, useState } from "react";

import {
  initMediaPipe,
  detectFace,
  detectGesture,
} from "@/app/infrastructure/mediapipe/mediapipeService";

import { analyzeEmotion } from "@/app/core/emotion/emotionAnalyzer";

import { startCamera } from "@/app/core/camera/cameraService";

import { takeScreenshot } from "@/app/core/screenshot/screenshotService";

import { uploadImage } from "@/app/infrastructure/upload/uploadService";

import { generateQR } from "@/app/infrastructure/qr/qrService";

import { FaceData } from "@/app/shared/types";

const COUNTDOWN_SECONDS = 3;

export function useEmotionBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [faces, setFaces] = useState<FaceData[]>([]);
  const [qr, setQR] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [palmDetected, setPalmDetected] = useState(false);

  const isCapturing = useRef(false);
  const palmStartTime = useRef<number | null>(null);
  const countdownTimer = useRef<number | null>(null);

  useEffect(() => {
    async function init() {
      await initMediaPipe();
      await startCamera(videoRef.current!);
      loop();
    }

    function loop() {
      const video = videoRef.current!;

      // ── Face Detection ──
      const faceResult = detectFace(video);

      if (
        faceResult?.faceBlendshapes?.length &&
        faceResult?.faceLandmarks?.length
      ) {
        const detectedFaces: FaceData[] = [];

        for (let i = 0; i < faceResult.faceLandmarks.length; i++) {
          const landmarks = faceResult.faceLandmarks[i];
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

          const emotion = faceResult.faceBlendshapes[i]
            ? analyzeEmotion(faceResult.faceBlendshapes[i].categories)
            : { happy: 0, sad: 0, angry: 0, surprised: 0 };

          detectedFaces.push({
            box: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
            emotion,
          });
        }
        setFaces(detectedFaces);
      } else {
        setFaces([]);
      }

      // ── Hand Gesture Detection ──
      if (!isCapturing.current) {
        const gestureResult = detectGesture(video);

        const hasOpenPalm = gestureResult?.gestures?.some(
          (g) => g.length > 0 && g[0].categoryName === "Open_Palm"
        );

        if (hasOpenPalm) {
          setPalmDetected(true);

          if (palmStartTime.current === null) {
            // Palm just appeared → start countdown
            palmStartTime.current = Date.now();
            startCountdown();
          }
        } else {
          // Palm gone → reset
          if (palmStartTime.current !== null) {
            palmStartTime.current = null;
            cancelCountdown();
            setPalmDetected(false);
          }
        }
      }

      requestAnimationFrame(loop);
    }

    function startCountdown() {
      let remaining = COUNTDOWN_SECONDS;
      setCountdown(remaining);

      countdownTimer.current = window.setInterval(() => {
        remaining--;

        if (remaining > 0) {
          setCountdown(remaining);
        } else {
          // Countdown finished → capture!
          clearInterval(countdownTimer.current!);
          countdownTimer.current = null;
          setCountdown(0);
          capture();
        }
      }, 1000);
    }

    function cancelCountdown() {
      if (countdownTimer.current !== null) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
      setCountdown(null);
    }

    async function capture() {
      if (isCapturing.current) return;
      isCapturing.current = true;
      setPalmDetected(false);
      setCountdown(null);

      try {
        const img = await takeScreenshot();
        const photoUrl = await uploadImage(img);
        const qrCode = await generateQR(photoUrl);
        setQR(qrCode);
      } catch (err) {
        console.error("Capture failed:", err);
        isCapturing.current = false;
      }
    }

    init();

    return () => {
      if (countdownTimer.current !== null) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  const retake = () => {
    setQR(null);
    setCountdown(null);
    palmStartTime.current = null;
    isCapturing.current = false;
  };

  return {
    videoRef,
    faces,
    qr,
    countdown,
    palmDetected,
    retake,
  };
}
