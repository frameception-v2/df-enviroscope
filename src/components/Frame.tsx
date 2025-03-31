"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import sdk from "@farcaster/frame-sdk";
type FrameContext = any; // Using any as a temporary type for FrameContext

function ContextDisplay({ context }: { context?: FrameContext }) {
  if (!context) return <div>No context available</div>;

  const formatValue = (value: any): string => {
    if (value === undefined || value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderContextItem = (key: string, value: any) => {
    return (
      <div key={key} className="mb-2">
        <Label className="font-bold">{key}:</Label>
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1 break-all">
          {formatValue(value)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(context).map(([key, value]) => renderContextItem(key, value))}
    </div>
  );
}

export default function Frame() {
  const { isSDKLoaded, context } = useFrameSDK();
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    // This effect is just for refreshing
    if (isSDKLoaded && refreshCount > 0) {
      const refreshContext = async () => {
        try {
          sdk.actions.ready();
        } catch (error) {
          console.error("Error refreshing context:", error);
        }
      };
      refreshContext();
    }
  }, [isSDKLoaded, refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  if (!isSDKLoaded) {
    return <div>Loading Frame SDK...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      <Card>
        <CardHeader>
          <CardTitle>Farcaster Environment Explorer</CardTitle>
          <CardDescription>
            Explore all the context variables available in your Farcaster Frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContextDisplay context={context} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefresh} className="w-full">
            Refresh Context
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
