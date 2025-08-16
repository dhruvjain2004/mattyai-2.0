import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer2, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Download, 
  Trash2, 
  Undo2, 
  Redo2,
  Save,
  Triangle,
  Minus,
  ArrowRight,
  Eraser
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  activeTool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow" | "eraser";
  onToolClick: (tool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow" | "eraser") => void;
  onExport: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
}

export const Toolbar = ({ activeTool, onToolClick, onExport, onClear, onUndo, onRedo, onDelete }: ToolbarProps) => {
  const tools = [
    { id: "select" as const, icon: MousePointer2, label: "Select" },
    { id: "draw" as const, icon: Pencil, label: "Draw" },
    { id: "eraser" as const, icon: Eraser, label: "Eraser" },
    { id: "rectangle" as const, icon: Square, label: "Rectangle" },
    { id: "circle" as const, icon: Circle, label: "Circle" },
    { id: "triangle" as const, icon: Triangle, label: "Triangle" },
    { id: "line" as const, icon: Minus, label: "Line" },
    { id: "arrow" as const, icon: ArrowRight, label: "Arrow" },
    { id: "text" as const, icon: Type, label: "Text" },
  ];

  return (
    <div className="bg-toolbar-bg border-b border-border px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onUndo}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo}>
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolClick(tool.id)}
              className={cn(
                "transition-all duration-200",
                isActive && "bg-gradient-primary shadow-soft"
              )}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={onExport}
          className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-soft"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};