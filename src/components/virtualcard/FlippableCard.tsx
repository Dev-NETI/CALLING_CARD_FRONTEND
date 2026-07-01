"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Employee, CardDesign } from "@/types";
import FrontSideCardComponent from "./FrontSideCardComponent";
import BackSideCardComponent from "./BackSideCardComponent";

interface FlippableCardProps {
  employee: Employee;
  cardDesign?: CardDesign;
}

export interface FlippableCardHandle {
  frontRef: HTMLDivElement | null;
  backRef: HTMLDivElement | null;
}

const FlippableCard = forwardRef<FlippableCardHandle, FlippableCardProps>(
  function FlippableCard({ employee, cardDesign }, ref) {
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

    // Explicit prop takes priority (used in design editor preview),
    // otherwise fall back to the company's saved design.
    const resolvedDesign = cardDesign ?? employee.company?.card_design;

    return (
      <div className="w-full max-w-5xl mx-auto">
        {/* @container here so cqw inside card sides = card width */}
        <div
          className="relative w-full cursor-pointer @container"
          style={{ paddingBottom: "57.14%", perspective: "1000px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <FrontSideCardComponent
              ref={frontRef}
              employee={employee}
              cardDesign={resolvedDesign}
            />
            <BackSideCardComponent
              ref={backRef}
              employee={employee}
              cardDesign={resolvedDesign}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default FlippableCard;
