"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Employee, CardDesign } from "@/types";
import { renderCardElement } from "./CanvasCardSide";

interface FrontSideCardComponentProps {
  employee: Employee;
  cardDesign?: CardDesign;
}

const FrontSideCardComponent = forwardRef<
  HTMLDivElement,
  FrontSideCardComponentProps
>(function FrontSideCardComponent({ employee, cardDesign }, ref) {
  const backgroundColor = cardDesign?.background_color ?? "#ffffff";
  const fontFamily = cardDesign?.font_family ?? "Century Gothic";
  const hasCustomLayout = (cardDesign?.front_elements?.length ?? 0) > 0;

  const sharedStyles: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
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
        {cardDesign!.front_elements.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{ left: `${el.x}%`, top: `${el.y}%` }}
          >
            {renderCardElement(el, employee)}
          </div>
        ))}
      </div>
    );
  }

  // ── Default flex layout ──────────────────────────────────────────────────
  const middleInitial = employee.middle_name
    ? `${employee.middle_name.charAt(0)}.`
    : "";

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between"
      style={{ ...sharedStyles, fontSize: "clamp(0.5rem, 2vw, 1rem)" }}
    >
      {/* Top — Logo */}
      <div className="flex justify-center items-start h-[20%]">
        <div className="relative w-full h-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
          <Image
            src={"/assets/logo/" + employee.company?.company_logo}
            alt={employee.company?.company_logo || "Company Logo"}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Center — Name block */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          className="space-y-0.5 text-center w-full px-2"
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
        >
          <h1
            className="font-bold uppercase break-words leading-tight"
            style={{ color: "#1e3a8a", fontSize: "clamp(0.75rem, 2.5vw, 2.5rem)" }}
          >
            {employee.first_name} {middleInitial} {employee.last_name}
          </h1>
          {employee.department && (
            <p
              className="font-bold break-words leading-tight"
              style={{ color: "#000000", fontSize: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
            >
              {employee.department}
            </p>
          )}
          <p
            className="font-bold break-words leading-tight"
            style={{ color: "#000000", fontSize: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
          >
            {employee.position}
          </p>
        </div>
      </div>

      {/* Bottom — Contact */}
      <div className="flex justify-between items-end gap-2">
        <div className="flex justify-start flex-1 min-w-0">
          <div
            className="space-y-0.5 w-full font-bold"
            style={{
              color: "#000000",
              fontFamily: `'${fontFamily}', sans-serif`,
              fontSize: "clamp(0.4rem, 1vw, 1rem)",
            }}
          >
            {employee.telephone && (
              <p className="flex leading-tight">
                <span style={{ minWidth: "7ch" }}>Tel</span>
                <span className="wrap-break-word min-w-0">: {employee.telephone}</span>
              </p>
            )}
            {employee.mobile_number && (
              <p className="flex leading-tight">
                <span style={{ minWidth: "7ch" }}>Mobile</span>
                <span className="wrap-break-word min-w-0">: {employee.mobile_number}</span>
              </p>
            )}
            <p className="flex leading-tight">
              <span style={{ minWidth: "7ch" }}>Email</span>
              <span className="wrap-break-word min-w-0">: {employee.email}</span>
            </p>
          </div>
        </div>
        <div
          className="shrink-0"
          style={{ width: "clamp(3rem, 8vw, 8rem)", height: "clamp(3rem, 8vw, 8rem)" }}
        />
      </div>
    </div>
  );
});

export default FrontSideCardComponent;
