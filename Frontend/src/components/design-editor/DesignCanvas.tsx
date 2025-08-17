import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Textbox, PencilBrush, Triangle, Line, Path, Image as FabricImage } from "fabric";
import { toast } from "sonner";

interface DesignCanvasProps {
  activeColor: string;
  activeTool:
    | "select"
    | "draw"
    | "rectangle"
    | "circle"
    | "text"
    | "triangle"
    | "line"
    | "arrow"
    | "eraser";
  brushSize: number;
  uploadedImage?: File | null;
  width?: number;
  height?: number;
  initialJson?: unknown;
}

export const DesignCanvas = forwardRef(({ activeColor, activeTool, brushSize, uploadedImage, width = 800, height = 600, initialJson }: DesignCanvasProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getCanvasJSON: () => {
      if (fabricCanvas) {
        return JSON.stringify(fabricCanvas.toJSON());
      }
      return null;
    },
    fabricCanvas,
    getCanvasRef: () => fabricCanvas, // Debug helper
    exportToPNG,
    clearCanvas,
    undoCanvas,
    redoCanvas,
    deleteSelected,
  }), [fabricCanvas, history, redoStack]);

  // Save state to history
  const saveHistory = () => {
    if (fabricCanvas) {
      setHistory((prev) => [...prev, JSON.stringify(fabricCanvas.toJSON())]);
      setRedoStack([]);
    }
  };

  // Listen for changes to save history
  useEffect(() => {
    if (!fabricCanvas) return;
    const save = () => saveHistory();
    fabricCanvas.on("object:added", save);
    fabricCanvas.on("object:modified", save);
    fabricCanvas.on("object:removed", save);
    return () => {
      fabricCanvas.off("object:added", save);
      fabricCanvas.off("object:modified", save);
      fabricCanvas.off("object:removed", save);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
    });
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;
    setFabricCanvas(canvas);
    setHistory([JSON.stringify(canvas.toJSON())]);
    setRedoStack([]);
    toast.success("Canvas ready! Start designing!");
    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Handle canvas size changes
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Update canvas dimensions
    fabricCanvas.setDimensions({ width, height });
    
    // If we have initial JSON, reload it with new dimensions
    if (initialJson) {
      fabricCanvas.loadFromJSON(initialJson, () => {
        fabricCanvas.renderAll();
        console.log("Design reloaded with new dimensions");
      });
    }
    
    fabricCanvas.renderAll();
  }, [width, height, fabricCanvas, initialJson]);

  // Load initial design when both canvas and JSON are ready
  useEffect(() => {
    if (initialJson && fabricCanvas) {
      console.log("Loading initial design on ready canvas:", initialJson);
      console.log("Canvas dimensions:", fabricCanvas.width, "x", fabricCanvas.height);
      
      // Parse the JSON if it's a string
      let designData = initialJson;
      if (typeof initialJson === 'string') {
        try {
          designData = JSON.parse(initialJson);
        } catch (error) {
          console.error("Failed to parse initial JSON:", error);
          return;
        }
      }
      
      console.log("Parsed design data:", designData);
      
      fabricCanvas.loadFromJSON(designData, () => {
        console.log("Design loaded, objects count:", fabricCanvas.getObjects().length);
        
        // Center all objects on the canvas
        const objects = fabricCanvas.getObjects();
        if (objects.length > 0) {
          console.log("Objects found:", objects.length);
          
          // Calculate the bounding box of all objects
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          
          objects.forEach((obj, index) => {
            const objBounds = obj.getBoundingRect();
            console.log(`Object ${index}:`, obj.type, "at", objBounds.left, objBounds.top, "size:", objBounds.width, "x", objBounds.height);
            
            minX = Math.min(minX, objBounds.left);
            minY = Math.min(minY, objBounds.top);
            maxX = Math.max(maxX, objBounds.left + objBounds.width);
            maxY = Math.max(maxY, objBounds.top + objBounds.height);
          });
          
          console.log("Design bounds:", minX, minY, maxX, maxY);
          
          // Calculate center offset
          const canvasCenterX = fabricCanvas.width! / 2;
          const canvasCenterY = fabricCanvas.height! / 2;
          const designCenterX = (minX + maxX) / 2;
          const designCenterY = (minY + maxY) / 2;
          
          console.log("Canvas center:", canvasCenterX, canvasCenterY);
          console.log("Design center:", designCenterX, designCenterY);
          
          // Move all objects to center them on canvas
          const offsetX = canvasCenterX - designCenterX;
          const offsetY = canvasCenterY - designCenterY;
          
          console.log("Offset to apply:", offsetX, offsetY);
          
          objects.forEach(obj => {
            obj.set({
              left: obj.left! + offsetX,
              top: obj.top! + offsetY
            });
          });
        } else {
          console.log("No objects found in design");
        }
        
        // Ensure all objects are visible
        fabricCanvas.renderAll();
        
        console.log("Initial design loaded and rendered");
        
        // Save to history after loading
        setHistory([JSON.stringify(fabricCanvas.toJSON())]);
        setRedoStack([]);
      });
    }
  }, [initialJson, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode =
      activeTool === "draw" || activeTool === "eraser";
    if (activeTool === "draw") {
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      }
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    } else if (activeTool === "eraser") {
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      }
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
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
      // 👇 Clear placeholder when user starts editing
      text.on("editing:entered", () => {
        if (text.text === "Click to edit text") {
          text.text = "";
          text.selectAll(); // Auto-select so user can type right away
          fabricCanvas.renderAll();
        }
      });

      // 👇 Restore placeholder if user leaves it empty
      text.on("editing:exited", () => {
        if (text.text === "") {
          text.text = "Click to edit text";
          fabricCanvas.renderAll();
        }
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.requestRenderAll();
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

  // Add image to canvas when uploadedImage changes
  useEffect(() => {
    if (!fabricCanvas || !uploadedImage) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        try {
          const img = await FabricImage.fromURL(dataUrl);
          img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.requestRenderAll();
          toast.success("Image uploaded to canvas!");
        } catch (err) {
          toast.error("Failed to load image");
        }
      }
    };
    reader.readAsDataURL(uploadedImage);
  }, [uploadedImage, fabricCanvas]);

  const exportToPNG = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataURL;
    link.click();
    toast.success("Design exported successfully!");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    saveHistory();
    toast.success("Canvas cleared!");
  };

  const undoCanvas = () => {
    if (!fabricCanvas || history.length < 2) return;
    setRedoStack((prev) => [JSON.stringify(fabricCanvas.toJSON()), ...prev]);
    const prevState = history[history.length - 2];
    fabricCanvas.loadFromJSON(prevState, () => {
      fabricCanvas.renderAll();
      setHistory((h) => h.slice(0, h.length - 1));
      toast.success("Undo");
    });
  };

  const redoCanvas = () => {
    if (!fabricCanvas || redoStack.length === 0) return;
    const nextState = redoStack[0];
    setHistory((prev) => [...prev, nextState]);
    setRedoStack((prev) => prev.slice(1));
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
      toast.success("Redo");
    });
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      saveHistory();
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
        <button onClick={exportToPNG} data-export className="hidden">
          Export PNG
        </button>
        <button onClick={clearCanvas} data-clear className="hidden">
          Clear
        </button>
        <button onClick={undoCanvas} data-undo className="hidden">
          Undo
        </button>
        <button onClick={redoCanvas} data-redo className="hidden">
          Redo
        </button>
        <button onClick={deleteSelected} data-delete className="hidden">
          Delete
        </button>
      </div>
    </div>
  );
});
