"use client";

import { useRef } from "react"; 
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OCRUploaderProps {
  onTextExtracted: (text: string) => void;
  setOcrLoading: (loading: boolean) => void;
}

export default function OCRUploader({ 
  onTextExtracted, 
  setOcrLoading 
}: OCRUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    setOcrLoading(true);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      onTextExtracted(text);
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setOcrLoading(false);
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
        className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/40 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Drag and drop a file here, or</span>
          </p>
          <Button 
            variant="outline"
            className="mt-2"
            type="button" 
            onClick={handleButtonClick} 
          >
            Browse files
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
        />
      </label>
    </div>
  );
}