"use client";

import { useState } from "react";
import { Employee } from "@/types";
import FrontSideCardComponent from "./FrontSideCardComponent";
import BackSideCardComponent from "./BackSideCardComponent";

interface FlippableCardProps {
  employee: Employee;
}

export default function FlippableCard({ employee }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

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
          <FrontSideCardComponent employee={employee} />
          <BackSideCardComponent employee={employee} />
        </div>
      </div>
    </div>
  );
}
