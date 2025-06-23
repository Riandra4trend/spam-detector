"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Tesseract from "tesseract.js";

interface OCRUploaderProps {
  onTextExtracted: (text: string) => void;
}

export default function OCRUploader({ onTextExtracted }: OCRUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("Initializing OCR engine...");
    
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            const newProgress = Math.round(message.progress * 100);
            setProgress(newProgress);
            setStatusMessage(`Extracting text: ${newProgress}%`);
          } else if (message.status === "initializing tesseract") {
            setStatusMessage("Initializing OCR engine...");
          } else if (message.status === "loading language traineddata") {
            setStatusMessage("Loading language data...");
          } else if (message.status === "initializing api") {
            setStatusMessage("Setting up OCR API...");
          } else if (message.status === "loading image") {
            setStatusMessage("Processing image...");
          }
        }
      });
      
      onTextExtracted(text);
      setStatusMessage("Text extraction complete!");
      setProgress(100);
    } catch (err) {
      console.error("OCR error:", err);
      setStatusMessage("Error processing image. Please try again.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1500);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/40 transition-colors ${
          isProcessing ? "opacity-70 pointer-events-none" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className={`w-10 h-10 mb-3 ${
            isProcessing 
              ? "text-primary animate-pulse" 
              : "text-muted-foreground"
          }`} />
          
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">
              {isProcessing ? statusMessage : "Drag and drop a file here, or"}
            </span>
          </p>
          
          <Button 
            variant="outline"
            className="mt-2"
            type="button"
            onClick={handleButtonClick}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Browse files"}
          </Button>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
          disabled={isProcessing}
        />
      </label>

      {isProcessing && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{statusMessage}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}