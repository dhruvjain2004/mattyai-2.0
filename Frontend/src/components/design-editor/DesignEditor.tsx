import { useState, useEffect } from "react";
import { DesignCanvas } from "./DesignCanvas";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { useRef } from "react";
import { API_BASE_URL } from "@/lib/utils";

export const DesignEditor = ({ initialJson, designId }: { initialJson?: any; designId?: string }) => {
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow" | "eraser">("select");
  const [brushSize, setBrushSize] = useState(2);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const canvasRef = useRef<any>(null);

  // Load initial design JSON if provided
  useEffect(() => {
    if (initialJson && canvasRef.current?.fabricCanvas) {
      console.log("Loading initial design JSON:", initialJson);
      canvasRef.current.fabricCanvas.loadFromJSON(initialJson, () => {
        canvasRef.current.fabricCanvas.renderAll();
        console.log("Design loaded successfully on canvas");
      });
    }
  }, [initialJson, canvasRef.current?.fabricCanvas]);

  // Save handler
  const handleSave = async () => {
    const jsonData = canvasRef.current?.getCanvasJSON?.();
    if (!jsonData) return alert("No canvas data to save");
    const title = prompt("Enter a title for your design:") || "Untitled";
    
    // Generate thumbnail from canvas
    let thumbnailData = "";
    if (canvasRef.current?.fabricCanvas) {
      const canvas = canvasRef.current.fabricCanvas;
      try {
        thumbnailData = canvas.toDataURL({
          format: 'png',
          quality: 0.8,
          multiplier: 0.5, // Smaller thumbnail
        });
        console.log("Generated thumbnail:", thumbnailData.substring(0, 100) + "...");
        console.log("Thumbnail length:", thumbnailData.length);
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    } else {
      console.log("No fabric canvas available for thumbnail");
      console.log("Canvas ref:", canvasRef.current);
    }
    
    try {
      const token = localStorage.getItem("token");
      const url = designId ? `${API_BASE_URL}/designs/${designId}` : `${API_BASE_URL}/designs`;
      const method = designId ? "PUT" : "POST";
      
      const requestBody = { 
        title, 
        jsonData,
        thumbnail: thumbnailData 
      };
      
      console.log("Sending request to:", url);
      console.log("Request body keys:", Object.keys(requestBody));
      console.log("Thumbnail in request:", !!requestBody.thumbnail);
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save design");
      }
      
      const savedDesign = await res.json();
      console.log("Design saved successfully:", savedDesign);
      console.log("Saved design has thumbnail:", !!savedDesign.thumbnailUrl);
      alert("Design saved!");
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Error saving design: " + err.message);
    }
  };

  const handleToolClick = (tool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow" | "eraser") => {
    setActiveTool(tool);
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleExport = () => {
    if (canvasRef.current?.exportToPNG) {
      canvasRef.current.exportToPNG();
    }
  };

  const handleClear = () => {
    if (canvasRef.current?.clearCanvas) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current?.undoCanvas) {
      canvasRef.current.undoCanvas();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current?.redoCanvas) {
      canvasRef.current.redoCanvas();
    }
  };

  const handleDelete = () => {
    if (canvasRef.current?.deleteSelected) {
      canvasRef.current.deleteSelected();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Canvas Size Controls - Mobile Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 lg:p-4 bg-white border-b border-gray-200 shadow-sm gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
            <label className="flex items-center gap-2">
              <span className="text-gray-700 font-medium text-sm lg:text-base">Width:</span>
              <input
                type="number"
                min={100}
                max={1920}
                value={canvasWidth}
                onChange={e => setCanvasWidth(Number(e.target.value))}
                className="w-16 lg:w-20 px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-gray-700 font-medium text-sm lg:text-base">Height:</span>
              <input
                type="number"
                min={100}
                max={1080}
                value={canvasHeight}
                onChange={e => setCanvasHeight(Number(e.target.value))}
                className="w-16 lg:w-20 px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </label>
          </div>
          <span className="text-gray-500 text-xs lg:text-sm bg-gray-100 px-2 lg:px-3 py-1 lg:py-2 rounded-md">
            💡 Set canvas size before drawing
          </span>
        </div>
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs lg:text-sm text-gray-600">Canvas Ready</span>
        </div>
      </div>
      
      {/* Toolbar - Mobile Responsive */}
      <div className="lg:hidden">
        <Toolbar 
          activeTool={activeTool}
          onToolClick={handleToolClick}
          onExport={handleExport}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </div>
      
      {/* Desktop Toolbar */}
      <div className="hidden lg:block bg-white border-b border-gray-200 p-3">
        <Toolbar 
          activeTool={activeTool}
          onToolClick={handleToolClick}
          onExport={handleExport}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </div>
      
      {/* Main Content Area - Mobile Responsive */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 order-2 lg:order-1">
          <DesignCanvas 
            ref={canvasRef}
            activeColor={activeColor}
            activeTool={activeTool as any}
            brushSize={brushSize}
            uploadedImage={uploadedImage}
            width={canvasWidth}
            height={canvasHeight}
            initialJson={initialJson}
          />
        </div>
        
        {/* Sidebar - Mobile Responsive */}
        <div className="order-1 lg:order-2">
          <Sidebar 
            activeColor={activeColor}
            onColorChange={setActiveColor}
            onToolSelect={handleToolClick}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
      
      {/* Bottom Toolbar for Mobile */}
      <div className="lg:hidden border-t border-gray-200 bg-white p-2">
        <Toolbar 
          activeTool={activeTool}
          onToolClick={handleToolClick}
          onExport={handleExport}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};