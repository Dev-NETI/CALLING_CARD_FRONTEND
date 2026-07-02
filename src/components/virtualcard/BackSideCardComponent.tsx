"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Employee, CardDesign } from "@/types";
import { renderCardElement, anchorTransform, getElementAlign } from "./CanvasCardSide";

interface BackSideCardComponentProps {
  employee: Employee;
  cardDesign?: CardDesign;
}

const BackSideCardComponent = forwardRef<
  HTMLDivElement,
  BackSideCardComponentProps
>(function BackSideCardComponent({ employee, cardDesign }, ref) {
  const backgroundColor = cardDesign?.background_color ?? "#ffffff";
  const fontFamily = cardDesign?.font_family ?? "Century Gothic";
  const hasCustomLayout = (cardDesign?.back_elements?.length ?? 0) > 0;

  const sharedStyles: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    backgroundColor,
  };

  // ── Custom canvas layout ──────────────────────────────────────────────────
  if (hasCustomLayout) {
    return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full rounded-lg shadow-2xl overflow-hidden @container"
        style={sharedStyles}
      >
        {cardDesign!.back_elements.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: anchorTransform(getElementAlign(el)),
            }}
          >
            {renderCardElement(el, employee)}
          </div>
        ))}
      </div>
    );
  }

  // ── Default flex layout ──────────────────────────────────────────────────
  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full rounded-lg shadow-2xl p-[clamp(0.5rem,2vw,2rem)] flex flex-col justify-between"
      style={{ ...sharedStyles, fontSize: "clamp(0.5rem, 2vw, 1rem)" }}
    >
      {/* Top — Logo */}
      <div
        className="flex justify-center items-start h-[18%]"
        style={{ paddingTop: "clamp(0.5rem, 2vw, 1rem)" }}
      >
        <div className="relative w-full h-full max-w-[50%]">
          <Image
            src={"/assets/logo/" + employee.company?.company_logo}
            alt={employee.company?.company_logo || "Company Logo"}
            width={500}
            height={500}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Company info */}
      <div
        className="flex flex-col justify-center flex-1 px-4"
        style={{
          gap: "clamp(0.125rem, 0.5vw, 0.5rem)",
          color: "#000000",
          fontFamily: `'${fontFamily}', sans-serif`,
        }}
      >
        {employee.company?.company_address && (
          <p
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(0.4rem, 1.5vw, 1.25rem)" }}
          >
            {employee.company.company_address}
          </p>
        )}
        {employee.company?.company_telephone && (
          <p
            className="leading-tight"
            style={{ fontSize: "clamp(0.35rem, 1vw, 0.9rem)" }}
          >
            Tel: {employee.company.company_telephone}
          </p>
        )}
        {employee.company?.company_website && (
          <p
            className="leading-tight"
            style={{ fontSize: "clamp(0.35rem, 1vw, 0.9rem)" }}
          >
            Website: {employee.company.company_website}
          </p>
        )}
      </div>
    </div>
  );
});

export default BackSideCardComponent;
