import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Shapes, 
  Type, 
  Image, 
  Palette,
  Layers,
  Triangle,
  Minus,
  ArrowRight,
  Brush
} from "lucide-react";
import { ColorPicker } from "./ColorPicker";

interface SidebarProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  onToolSelect: (tool: "select" | "draw" | "rectangle" | "circle" | "text" | "triangle" | "line" | "arrow") => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
}

export const Sidebar = ({ activeColor, onColorChange, onToolSelect, brushSize, onBrushSizeChange }: SidebarProps) => {
  const shapes = [
    { name: "Rectangle", tool: "rectangle" as const, icon: "rect" },
    { name: "Circle", tool: "circle" as const, icon: "circle" },
    { name: "Triangle", tool: "triangle" as const, icon: "triangle" },
    { name: "Line", tool: "line" as const, icon: "line" },
    { name: "Arrow", tool: "arrow" as const, icon: "arrow" },
  ];

  const textStyles = [
    { name: "Heading 1", size: "32px", weight: "bold" },
    { name: "Heading 2", size: "24px", weight: "bold" },
    { name: "Body Text", size: "16px", weight: "normal" },
    { name: "Caption", size: "12px", weight: "normal" },
  ];

  return (
    <div className="w-80 bg-secondary border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Design Tools</h2>
      </div>
      
      <Tabs defaultValue="elements" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 m-4 mb-0">
          <TabsTrigger value="elements" className="text-xs">
            <Shapes className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="brush" className="text-xs">
            <Brush className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="images" className="text-xs">
            <Image className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="colors" className="text-xs">
            <Palette className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="elements" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Basic Shapes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shapes.map((shape) => (
                      <Button
                        key={shape.name}
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-accent hover:shadow-soft transition-all"
                        onClick={() => onToolSelect(shape.tool)}
                      >
                        {shape.icon === "rect" && <div className="w-8 h-6 bg-primary rounded"></div>}
                        {shape.icon === "circle" && <div className="w-8 h-8 bg-primary rounded-full"></div>}
                        {shape.icon === "triangle" && <Triangle className="w-8 h-8 text-primary" />}
                        {shape.icon === "line" && <Minus className="w-8 h-8 text-primary" />}
                        {shape.icon === "arrow" && <ArrowRight className="w-8 h-8 text-primary" />}
                        <span className="text-xs">{shape.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="brush" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Brush Settings</h3>
                  <Button
                    variant="outline"
                    className="w-full h-16 flex-col gap-2 hover:bg-accent hover:shadow-soft transition-all mb-4"
                    onClick={() => onToolSelect("draw")}
                  >
                    <Brush className="w-6 h-6 text-primary" />
                    <span className="text-xs">Free Draw</span>
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-sm flex items-center justify-between">
                    Brush Size
                    <span className="text-xs text-muted-foreground">{brushSize}px</span>
                  </h3>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => onBrushSizeChange(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1px</span>
                    <span>50px</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-sm">Brush Color</h3>
                  <ColorPicker color={activeColor} onChange={onColorChange} />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="text" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Text Styles</h3>
                  <div className="space-y-2">
                    {textStyles.map((style) => (
                      <Button
                        key={style.name}
                        variant="outline"
                        className="w-full justify-start h-auto p-3 hover:bg-accent hover:shadow-soft transition-all"
                        onClick={() => onToolSelect("text")}
                      >
                        <div className="text-left">
                          <div 
                            className="text-foreground"
                            style={{ 
                              fontSize: style.size, 
                              fontWeight: style.weight,
                              lineHeight: 1.2
                            }}
                          >
                            {style.name}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="images" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Upload Images</h3>
                  <Button 
                    variant="outline" 
                    className="w-full h-32 border-dashed border-2 hover:bg-accent transition-all"
                  >
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Click to upload
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="colors" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Color Picker</h3>
                  <ColorPicker color={activeColor} onChange={onColorChange} />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};