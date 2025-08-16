import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Textbox } from "fabric";
import { toast } from "sonner";

interface DesignCanvasProps {
  activeColor: string;
  activeTool: "select" | "draw" | "rectangle" | "circle" | "text";
}

export const DesignCanvas = ({ activeColor, activeTool }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Start designing!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    if (activeTool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 120,
        height: 80,
        rx: 8,
        ry: 8,
      });
      fabricCanvas.add(rect);
    } else if (activeTool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas.add(circle);
    } else if (activeTool === "text") {
      const text = new Textbox("Click to edit text", {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 24,
        fontFamily: "Inter, sans-serif",
        width: 200,
      });
      fabricCanvas.add(text);
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const exportToPNG = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = dataURL;
    link.click();
    
    toast.success("Design exported successfully!");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-canvas-bg p-8">
        <div className="bg-background rounded-lg shadow-elegant border border-border overflow-hidden">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button 
          onClick={exportToPNG}
          data-export
          className="hidden"
        >
          Export PNG
        </button>
        <button 
          onClick={clearCanvas}
          data-clear
          className="hidden"
        >
          Clear
        </button>
      </div>
    </div>
  );
};