import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shapes, 
  Type, 
  Image, 
  Palette,
  Layers
} from "lucide-react";
import { ColorPicker } from "./ColorPicker";

interface SidebarProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  onToolSelect: (tool: "select" | "draw" | "rectangle" | "circle" | "text") => void;
}

export const Sidebar = ({ activeColor, onColorChange, onToolSelect }: SidebarProps) => {
  const shapes = [
    { name: "Rectangle", tool: "rectangle" as const },
    { name: "Circle", tool: "circle" as const },
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
        <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
          <TabsTrigger value="elements" className="text-xs">
            <Shapes className="h-4 w-4" />
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
                        {shape.tool === "rectangle" ? (
                          <div className="w-8 h-6 bg-primary rounded"></div>
                        ) : (
                          <div className="w-8 h-8 bg-primary rounded-full"></div>
                        )}
                        <span className="text-xs">{shape.name}</span>
                      </Button>
                    ))}
                  </div>
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