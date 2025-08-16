import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Textbox, PencilBrush, Triangle, Line, Path } from "fabric";
import { toast } from "sonner";

interface DesignCanvasProps {
  activeColor: string;
  activeTool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow";
  brushSize: number;
}

export const DesignCanvas = ({ activeColor, activeTool, brushSize }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush safely (Fabric v6)
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Start designing!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";

    if (activeTool === "draw") {
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      }
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
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
    } else if (activeTool === "triangle") {
      const triangle = new Triangle({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas.add(triangle);
    } else if (activeTool === "line") {
      const line = new Line([50, 100, 200, 100], {
        left: 100,
        top: 100,
        stroke: activeColor,
        strokeWidth: brushSize,
      });
      fabricCanvas.add(line);
    } else if (activeTool === "arrow") {
      const arrowPath = "M 0 0 L 100 50 L 0 100 L 20 50 z";
      const arrow = new Path(arrowPath, {
        left: 100,
        top: 100,
        fill: activeColor,
        scaleX: 0.8,
        scaleY: 0.8,
      });
      fabricCanvas.add(arrow);
    }
  }, [activeTool, activeColor, fabricCanvas, brushSize]);

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

  const undoCanvas = () => {
    if (!fabricCanvas) return;
    const state = JSON.stringify(fabricCanvas.toJSON());
    // Simple undo - in production you'd want a proper history stack
    toast.success("Undo functionality - implement with history stack!");
  };

  const redoCanvas = () => {
    if (!fabricCanvas) return;
    // Simple redo - in production you'd want a proper history stack
    toast.success("Redo functionality - implement with history stack!");
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      toast.success("Selected objects deleted!");
    }
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
        <button 
          onClick={undoCanvas}
          data-undo
          className="hidden"
        >
          Undo
        </button>
        <button 
          onClick={redoCanvas}
          data-redo
          className="hidden"
        >
          Redo
        </button>
        <button 
          onClick={deleteSelected}
          data-delete
          className="hidden"
        >
          Delete
        </button>
      </div>
    </div>
  );
};