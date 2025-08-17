import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette,Copy } from "lucide-react";
import {useState} from "react"

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [copied,setCopied]=useState(false)
  const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#000080", "#008000",
    "#FF1493", "#FFD700", "#4169E1", "#32CD32", "#FF69B4"
  ];
  const handleCopy = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div 
            className="w-4 h-4 rounded border border-border"
            style={{ backgroundColor: color }}
          />
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="color-input" className="text-sm font-medium">
              Color
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-10 p-1 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy hex code"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Preset Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  aria-label={`Select ${presetColor}`}
                  className={`w-9 h-9 rounded border border-border hover:scale-110 transition-transform ${
                    presetColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onMouseDown={() => onChange(presetColor)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};