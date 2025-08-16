import { useState } from "react";
import { DesignCanvas } from "./DesignCanvas";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";

export const DesignEditor = () => {
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow">("select");
  const [brushSize, setBrushSize] = useState(2);

  const handleToolClick = (tool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow") => {
    setActiveTool(tool);
  };

  const handleExport = () => {
    const exportButton = document.querySelector('[data-export]') as HTMLButtonElement;
    exportButton?.click();
  };

  const handleClear = () => {
    const clearButton = document.querySelector('[data-clear]') as HTMLButtonElement;
    clearButton?.click();
  };

  const handleUndo = () => {
    const undoButton = document.querySelector('[data-undo]') as HTMLButtonElement;
    undoButton?.click();
  };

  const handleRedo = () => {
    const redoButton = document.querySelector('[data-redo]') as HTMLButtonElement;
    redoButton?.click();
  };

  const handleDelete = () => {
    const deleteButton = document.querySelector('[data-delete]') as HTMLButtonElement;
    deleteButton?.click();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar 
        activeTool={activeTool}
        onToolClick={handleToolClick}
        onExport={handleExport}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={handleDelete}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <DesignCanvas 
            activeColor={activeColor}
            activeTool={activeTool}
            brushSize={brushSize}
          />
        </div>
        
        <Sidebar 
          activeColor={activeColor}
          onColorChange={setActiveColor}
          onToolSelect={handleToolClick}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
        />
      </div>
    </div>
  );
};