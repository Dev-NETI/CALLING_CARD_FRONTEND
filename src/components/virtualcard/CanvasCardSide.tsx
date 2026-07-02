"use client";

import { useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  CardElement,
  TextCardElement,
  LogoCardElement,
  QRCardElement,
  CertLogoCardElement,
  ShapeCardElement,
  HorizontalAlign,
  Employee,
  resolveTemplate,
  templateHasData,
} from "@/types";

// ── Shared element renderer ───────────────────────────────────────────────────
// All sizes use cqw (container query width) so elements scale with the card's
// actual rendered width, not the viewport — keeping editor and card page identical.

// x% marks the left edge / center / right edge of an element depending on its
// align setting; this shifts the (always left-anchored) box to match so the
// chosen anchor point stays put regardless of the element's rendered width.
// Applied to the positioning wrapper (not the inner content) so drag handles
// and selection rings stay in sync with where the element actually renders.
export function anchorTransform(align: HorizontalAlign | undefined): string {
  if (align === "center") return "translateX(-50%)";
  if (align === "right") return "translateX(-100%)";
  return "none";
}

// The alignment anchor for any element type — text elements repurpose their
// existing text_align, everything else uses the dedicated align field.
export function getElementAlign(el: CardElement): HorizontalAlign | undefined {
  return el.type === "text" ? el.text_align : el.align;
}

export function renderCardElement(
  element: CardElement,
  employee: Employee,
): React.ReactNode {
  switch (element.type) {
    case "text": {
      const el = element as TextCardElement;
      if (!templateHasData(el.template, employee)) return null;
      const text = resolveTemplate(el.template, employee) || el.label || "…";
      return (
        <p
          style={{
            fontSize: `clamp(0.3rem, ${el.font_size}cqw, 3rem)`,
            fontWeight: el.font_weight,
            color: el.color,
            fontFamily: `'${el.font_family}', sans-serif`,
            textAlign: el.text_align,
            textTransform: el.uppercase ? "uppercase" : "none",
            lineHeight: 1.25,
            margin: 0,
            whiteSpace: "pre-wrap",
            width: el.width ? `${el.width}cqw` : undefined,
            maxWidth: el.width ? `${el.width}cqw` : "94cqw",
            overflowWrap: "break-word",
          }}
        >
          {text}
        </p>
      );
    }

    case "logo": {
      const el = element as LogoCardElement;
      const logoSrc = el.src ?? (employee.company?.company_logo
        ? "/assets/logo/" + employee.company.company_logo
        : null);
      if (!logoSrc) return null;
      return (
        <div
          className="relative"
          style={{ width: `${el.width}cqw`, aspectRatio: "2 / 1" }}
        >
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            className="object-contain"
            draggable={false}
            unoptimized={!!el.src}
          />
        </div>
      );
    }

    case "qr": {
      const el = element as QRCardElement;
      if (!el.url) {
        return (
          <div className="border border-dashed border-gray-300 rounded p-2 text-[0.6rem] text-gray-400 text-center">
            No URL
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center">
          <QRCodeSVG
            value={el.url}
            size={100}
            style={{ width: `${el.size}cqw`, height: "auto" }}
          />
          {el.label && (
            <p
              className="text-center font-bold mt-1 leading-tight"
              style={{ fontSize: `clamp(0.25rem, 1cqw, 0.8rem)` }}
            >
              {el.label}
            </p>
          )}
        </div>
      );
    }

    case "cert_logo": {
      const el = element as CertLogoCardElement;
      const certSrc = el.src ?? (el.filename ? `/assets/certifications/${el.filename}` : null);
      if (!certSrc) {
        return (
          <div className="border border-dashed border-gray-300 rounded p-2 text-[0.6rem] text-gray-400 text-center">
            No image
          </div>
        );
      }
      return (
        <div
          className="relative"
          style={{ width: `${el.width}cqw`, aspectRatio: "1 / 1" }}
        >
          <Image
            src={certSrc}
            alt={el.filename || "cert"}
            fill
            className="object-contain"
            draggable={false}
            unoptimized={!!el.src}
          />
        </div>
      );
    }

    case "shape": {
      const el = element as ShapeCardElement;
      const borderRadius =
        el.shape === "circle"
          ? "50%"
          : el.shape === "rounded_rectangle"
            ? "12px"
            : "0";
      return (
        <div
          style={{
            width: `clamp(0.5rem, ${el.width}cqw, 100cqw)`,
            height: `clamp(0.25rem, ${el.height}cqw, 57.14cqw)`,
            backgroundColor: el.fill_color,
            border:
              el.border_width > 0
                ? `${el.border_width}px solid ${el.border_color}`
                : "none",
            borderRadius,
            opacity: el.opacity / 100,
          }}
        />
      );
    }
  }
}

function getElementLabel(el: CardElement): string {
  if (el.type === "text") return (el as TextCardElement).label || "Text";
  if (el.type === "logo") return "Logo";
  if (el.type === "qr") return "QR Code";
  if (el.type === "shape") return `Shape (${(el as ShapeCardElement).shape})`;
  return `Cert: ${(el as CertLogoCardElement).filename || "untitled"}`;
}

// ── Editor canvas (draggable, selectable) ─────────────────────────────────────

interface CanvasCardSideProps {
  elements: CardElement[];
  employee: Employee;
  backgroundColor: string;
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onMove?: (id: string, x: number, y: number) => void;
}

export default function CanvasCardSide({
  elements,
  employee,
  backgroundColor,
  editable = false,
  selectedId,
  onSelect,
  onMove,
}: CanvasCardSideProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    id: string;
    startMouseX: number;
    startMouseY: number;
    startElemX: number;
    startElemY: number;
    cardWidth: number;
    cardHeight: number;
  } | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    el: CardElement,
  ) => {
    if (!editable) return;
    e.stopPropagation();
    onSelect?.(el.id);
    if (!cardRef.current || !onMove) return;
    const rect = cardRef.current.getBoundingClientRect();
    dragState.current = {
      id: el.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElemX: el.x,
      startElemY: el.y,
      cardWidth: rect.width,
      cardHeight: rect.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s || !onMove) return;
    const dx = ((e.clientX - s.startMouseX) / s.cardWidth) * 100;
    const dy = ((e.clientY - s.startMouseY) / s.cardHeight) * 100;
    onMove(
      s.id,
      Math.max(0, Math.min(92, s.startElemX + dx)),
      Math.max(0, Math.min(92, s.startElemY + dy)),
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  // Outer div is the container query context — cqw inside resolves to this width.
  return (
    <div className="relative w-full @container" style={{ paddingBottom: "57.14%" }}>
      <div
        ref={cardRef}
        className="absolute inset-0 rounded-lg shadow-xl overflow-hidden"
        style={{ backgroundColor }}
        onClick={() => editable && onSelect?.(null)}
      >
        {editable && elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-gray-300 text-center px-4">
              Add elements using the controls on the left
            </p>
          </div>
        )}

        {elements.map((el) => {
          const content = renderCardElement(el, employee);
          const isSelected = selectedId === el.id;

          return (
            <div
              key={el.id}
              className={`absolute group ${
                editable
                  ? isSelected
                    ? "ring-2 ring-blue-500 z-20"
                    : "hover:ring-1 hover:ring-blue-300 z-10"
                  : ""
              }`}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                transform: anchorTransform(getElementAlign(el)),
                cursor: editable ? "move" : "default",
                userSelect: "none",
                touchAction: "none",
              }}
              onPointerDown={(e) => handlePointerDown(e, el)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {editable && (
                <div
                  className={`absolute -top-6 left-0 text-[0.6rem] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-30 transition-opacity ${
                    isSelected
                      ? "bg-blue-500 text-white opacity-100"
                      : "bg-gray-700 text-white opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {getElementLabel(el)}
                </div>
              )}
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
