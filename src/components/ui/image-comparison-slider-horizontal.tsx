/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the props for the component
export interface ImageComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  leftImage: string;
  rightImage: string;
  altLeft?: string;
  altRight?: string;
  initialPosition?: number;
  labelLeft?: string;
  labelRight?: string;
}

export const ImageComparisonSlider = React.forwardRef<
  HTMLDivElement,
  ImageComparisonSliderProps
>(
  (
    {
      className,
      leftImage,
      rightImage,
      altLeft = "Left image",
      altRight = "Right image",
      initialPosition = 50,
      labelLeft,
      labelRight,
      ...props
    },
    ref
  ) => {
    // State to manage slider position (0 to 100)
    const [sliderPosition, setSliderPosition] = React.useState(initialPosition);
    // State to track if the user is currently dragging the handle
    const [isDragging, setIsDragging] = React.useState(false);
    // Ref for the container element to calculate relative cursor position
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Function to handle slider movement based on horizontal position
    const handleMove = React.useCallback((clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let newPosition = (x / rect.width) * 100;

      // Clamp the position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    }, []);

    // Handlers for starting and stopping the drag interaction
    const handleInteractionStart = () => {
      setIsDragging(true);
    };

    // Effect to add and remove global event listeners for dragging
    React.useEffect(() => {
      if (!isDragging) return;

      const onMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          handleMove(e.touches[0].clientX);
        }
      };

      const onInteractionEnd = () => {
        setIsDragging(false);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("mouseup", onInteractionEnd);
      document.addEventListener("touchend", onInteractionEnd);
      document.body.style.cursor = 'ew-resize';

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mouseup", onInteractionEnd);
        document.removeEventListener("touchend", onInteractionEnd);
        document.body.style.cursor = '';
      };
    }, [isDragging, handleMove]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-full overflow-hidden select-none group touch-none",
          className
        )}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        {...props}
      >
        {/* Right Image (bottom layer) */}
        <img
          src={rightImage}
          alt={altRight}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        {labelRight && (
          <span className="pointer-events-none absolute bottom-3 end-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm z-10">
            {labelRight}
          </span>
        )}
        
        {/* Left Image (top layer, clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={leftImage}
            alt={altLeft}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {labelLeft && (
            <span className="pointer-events-none absolute bottom-3 start-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm z-10">
              {labelLeft}
            </span>
          )}
        </div>

        {/* Slider Handle and Divider */}
        <div
          className="absolute top-0 h-full w-1 cursor-ew-resize z-20"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          {/* Divider Line */}
          <div className="absolute inset-y-0 w-1 bg-white/70 backdrop-blur-sm shadow-md"></div>
          
          {/* Handle */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-white/95 text-primary shadow-xl backdrop-blur-md border border-white/80",
              "transition-all duration-200 ease-in-out",
              "group-hover:scale-105",
              isDragging && "scale-110 shadow-2xl shadow-primary/50"
            )}
            role="slider"
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-orientation="horizontal"
            aria-label="Image comparison slider"
          >
            <div className="flex items-center text-primary">
              <ChevronLeft className="h-4 w-4 drop-shadow-md" />
              <ChevronRight className="h-4 w-4 drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImageComparisonSlider.displayName = "ImageComparisonSlider";
