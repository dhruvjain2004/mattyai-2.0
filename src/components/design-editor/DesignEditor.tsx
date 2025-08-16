import { useState } from "react";
import { DesignCanvas } from "./DesignCanvas";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";

export const DesignEditor = () => {
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text">("select");

  const handleToolClick = (tool: "select" | "draw" | "rectangle" | "circle" | "text") => {
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar 
        activeTool={activeTool}
        onToolClick={handleToolClick}
        onExport={handleExport}
        onClear={handleClear}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <DesignCanvas 
            activeColor={activeColor}
            activeTool={activeTool}
          />
        </div>
        
        <Sidebar 
          activeColor={activeColor}
          onColorChange={setActiveColor}
          onToolSelect={handleToolClick}
        />
      </div>
    </div>
  );
};