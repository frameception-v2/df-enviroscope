"use client";

import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
type FrameContext = any; // Using any as a temporary type for FrameContext

export function useFrameSDK() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const checkSDK = async () => {
      try {
        if (sdk) {
          const frameContext = await sdk.context;
          if (frameContext) {
            setContext(frameContext);
          }
          setIsSDKLoaded(true);
          sdk.actions.ready();
        }
      } catch (error) {
        console.error("Error initializing Frame SDK:", error);
        setIsSDKLoaded(false);
      }
    };

    checkSDK();
  }, []);

  return { isSDKLoaded, context };
}
