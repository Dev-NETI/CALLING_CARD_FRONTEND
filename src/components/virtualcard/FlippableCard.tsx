"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Employee } from "@/types";
import FrontSideCardComponent from "./FrontSideCardComponent";
import BackSideCardComponent from "./BackSideCardComponent";

interface FlippableCardProps {
  employee: Employee;
}

export interface FlippableCardHandle {
  frontRef: HTMLDivElement | null;
  backRef: HTMLDivElement | null;
}

const FlippableCard = forwardRef<FlippableCardHandle, FlippableCardProps>(
  function FlippableCard({ employee }, ref) {
    const [isFlipped, setIsFlipped] = useState(false);
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      get frontRef() {
        return frontRef.current;
      },
      get backRef() {
        return backRef.current;
      },
    }));

    if (!employee) return null;

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    return (
      <div className="w-full max-w-5xl mx-auto @container">
        {/* Card Container with 3D Flip - Business card aspect ratio (3.5:2) */}
        <div
          className="relative w-full cursor-pointer"
          style={{
            paddingBottom: "57.14%",
            perspective: "1000px",
          }}
          onClick={handleFlip}
        >
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <FrontSideCardComponent ref={frontRef} employee={employee} />
            <BackSideCardComponent ref={backRef} employee={employee} />
          </div>
        </div>
      </div>
    );
  }
);

export default FlippableCard;
