"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface Point {
  x: number;
  y: number;
}

interface Annotation {
  id: string;
  type: "arrow" | "rectangle" | "circle" | "text" | "blur";
  points: Point[];
  text?: string;
  color: string;
  lineWidth: number;
}

export function AnnotationCanvas({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<"arrow" | "rectangle" | "circle" | "text" | "blur">("arrow");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(2);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState<Point>({ x: 0, y: 0 });

  // Load image and initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      redrawAnnotations();
    };
  }, [imageUrl]);

  const redrawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas and redraw image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Redraw all annotations
      annotations.forEach(annotation => {
        drawAnnotation(ctx, annotation);
      });

      // Draw current annotation if exists
      if (currentAnnotation) {
        drawAnnotation(ctx, currentAnnotation);
      }
    };
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.lineWidth;

    switch (annotation.type) {
      case "arrow":
        drawArrow(ctx, annotation.points);
        break;
      case "rectangle":
        drawRectangle(ctx, annotation.points);
        break;
      case "circle":
        drawCircle(ctx, annotation.points);
        break;
      case "text":
        drawText(ctx, annotation);
        break;
      case "blur":
        drawBlur(ctx, annotation.points);
        break;
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;

    const start = points[0];
    const end = points[points.length - 1];

    // Draw line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - 10 * Math.cos(angle - Math.PI / 6),
      end.y - 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - 10 * Math.cos(angle + Math.PI / 6),
      end.y - 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;

    const start = points[0];
    const end = points[points.length - 1];
    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.strokeRect(start.x, start.y, width, height);
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;

    const start = points[0];
    const end = points[points.length - 1];
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawText = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    if (!annotation.text) return;

    ctx.font = `${annotation.lineWidth * 10}px Arial`;
    ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
  };

  const drawBlur = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;

    const start = points[0];
    const end = points[points.length - 1];
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    // Create a temporary canvas for blurring
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    
    if (!tempCtx) return;

    // Copy the area to blur
    tempCtx.drawImage(
      ctx.canvas,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    // Apply blur effect
    ctx.filter = "blur(5px)";
    ctx.drawImage(tempCanvas, x, y);
    ctx.filter = "none";
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "text") {
      const pos = getMousePos(e);
      setTextInputPosition(pos);
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    const pos = getMousePos(e);

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: currentTool,
      points: [pos],
      color: selectedColor,
      lineWidth: lineWidth
    };

    setCurrentAnnotation(newAnnotation);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return;

    const pos = getMousePos(e);
    const updatedAnnotation = {
      ...currentAnnotation,
      points: [...currentAnnotation.points, pos]
    };

    setCurrentAnnotation(updatedAnnotation);
    redrawAnnotations();
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentAnnotation) return;

    setIsDrawing(false);
    setAnnotations([...annotations, currentAnnotation]);
    setCurrentAnnotation(null);
  };

  const addTextAnnotation = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: "text",
      points: [textInputPosition],
      text: textInput,
      color: selectedColor,
      lineWidth: lineWidth
    };

    setAnnotations([...annotations, newAnnotation]);
    setTextInput("");
    setShowTextInput(false);
    redrawAnnotations();
  };

  const clearAnnotations = () => {
    setAnnotations([]);
    setCurrentAnnotation(null);
    redrawAnnotations();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentTool === "arrow" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentTool("arrow")}
        >
          <Icons.arrowRight className="h-4 w-4 mr-1" />
          Arrow
        </Button>
        <Button
          variant={currentTool === "rectangle" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentTool("rectangle")}
        >
          <Icons.square className="h-4 w-4 mr-1" />
          Rectangle
        </Button>
        <Button
          variant={currentTool === "circle" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentTool("circle")}
        >
          <Icons.circle className="h-4 w-4 mr-1" />
          Circle
        </Button>
        <Button
          variant={currentTool === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentTool("text")}
        >
          <Icons.type className="h-4 w-4 mr-1" />
          Text
        </Button>
        <Button
          variant={currentTool === "blur" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentTool("blur")}
        >
          <Icons.eyeOff className="h-4 w-4 mr-1" />
          Blur
        </Button>
        
        <div className="flex items-center gap-2 ml-4">
          <label>Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label>Size:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-20"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearAnnotations}
        >
          <Icons.trash className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">Add Text</h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowTextInput(false)}>
                Cancel
              </Button>
              <Button onClick={addTextAnnotation}>
                Add Text
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="max-w-full h-auto cursor-crosshair"
        />
      </div>
    </div>
  );
}