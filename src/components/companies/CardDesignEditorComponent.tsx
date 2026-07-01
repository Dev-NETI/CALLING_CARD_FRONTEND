"use client";

import { useState } from "react";
import {
  Company,
  CardDesign,
  CardDesignFormData,
  CardElement,
  TextCardElement,
  LogoCardElement,
  QRCardElement,
  CertLogoCardElement,
  ShapeCardElement,
  Employee,
  CARD_VARIABLES,
} from "@/types";
import Button from "@/components/ui/Button";
import CanvasCardSide from "@/components/virtualcard/CanvasCardSide";

const FONT_OPTIONS = [
  "Century Gothic",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Calibri",
  "Trebuchet MS",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function buildMockEmployee(company: Company): Employee {
  return {
    id: 0,
    company_id: company.id,
    employee_id: "EMP-001",
    first_name: "Juan",
    middle_name: "D",
    last_name: "dela Cruz",
    department: "Operations",
    position: "Senior Manager",
    email: "juan.delacruz@example.com",
    mobile_number: "+63 912 345 6789",
    telephone: "+63 2 1234 5678",
    status: "active",
    created_at: "",
    updated_at: "",
    company,
  };
}

function defaultTextElement(fontFamily: string): TextCardElement {
  return {
    id: genId(),
    type: "text",
    label: "New Text",
    template: "",
    x: 40,
    y: 40,
    font_size: 1.5,
    font_weight: "normal",
    color: "#000000",
    font_family: fontFamily,
    text_align: "left",
    uppercase: false,
  };
}

function defaultLogoElement(): LogoCardElement {
  return { id: genId(), type: "logo", x: 25, y: 3, width: 20 };
}

function defaultQRElement(): QRCardElement {
  return { id: genId(), type: "qr", x: 5, y: 35, url: "", label: "", size: 10 };
}

function defaultCertLogoElement(): CertLogoCardElement {
  return { id: genId(), type: "cert_logo", x: 10, y: 72, filename: "", width: 10 };
}

function defaultShapeElement(): ShapeCardElement {
  return {
    id: genId(),
    type: "shape",
    shape: "rectangle",
    x: 20,
    y: 20,
    width: 20,
    height: 10,
    fill_color: "#1e3a8a",
    border_color: "#000000",
    border_width: 0,
    opacity: 100,
  };
}

interface CardDesignEditorProps {
  company: Company;
  initialDesign?: CardDesign | null;
  onSave: (data: CardDesignFormData) => Promise<void>;
  isSaving: boolean;
}

export default function CardDesignEditorComponent({
  company,
  initialDesign,
  onSave,
  isSaving,
}: CardDesignEditorProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [backgroundColor, setBackgroundColor] = useState(
    initialDesign?.background_color ?? "#ffffff",
  );
  const [fontFamily, setFontFamily] = useState(
    initialDesign?.font_family ?? "Century Gothic",
  );
  const [frontElements, setFrontElements] = useState<CardElement[]>(
    initialDesign?.front_elements ?? [],
  );
  const [backElements, setBackElements] = useState<CardElement[]>(
    initialDesign?.back_elements ?? [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mockEmployee = buildMockEmployee(company);
  const elements = side === "front" ? frontElements : backElements;
  const setElements = side === "front" ? setFrontElements : setBackElements;
  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const updateElement = (id: string, patch: Record<string, unknown>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? ({ ...el, ...patch } as CardElement) : el)),
    );
  };

  const moveElement = (id: string, x: number, y: number) => {
    updateElement(id, { x, y });
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addElement = (el: CardElement) => {
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const handleSave = () => {
    onSave({
      background_color: backgroundColor,
      font_family: fontFamily,
      front_elements: frontElements,
      back_elements: backElements,
    });
  };

  return (
    <div className="space-y-4">
      {/* Front / Back tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["front", "back"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSide(s);
              setSelectedId(null);
            }}
            className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize ${
              side === s
                ? "bg-white shadow text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {s} Side
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left panel ── */}
        <div className="space-y-4">

          {/* Global settings */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Card Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Default Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Element list */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                {side === "front" ? "Front" : "Back"} Elements ({elements.length})
              </h3>
            </div>

            {elements.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No elements yet. Add one below.
              </p>
            ) : (
              <div className="space-y-1.5 mb-3">
                {elements.map((el) => {
                  const label =
                    el.type === "text"
                      ? (el as TextCardElement).label || "Text"
                      : el.type === "logo"
                        ? "Logo"
                        : el.type === "qr"
                          ? "QR Code"
                          : el.type === "shape"
                            ? `Shape (${(el as ShapeCardElement).shape})`
                            : `Cert: ${(el as CertLogoCardElement).filename || "untitled"}`;
                  const typeColor =
                    el.type === "text"
                      ? "bg-blue-50 text-blue-700"
                      : el.type === "logo"
                        ? "bg-green-50 text-green-700"
                        : el.type === "qr"
                          ? "bg-purple-50 text-purple-700"
                          : el.type === "shape"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-orange-50 text-orange-700";
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedId === el.id
                          ? "bg-blue-50 ring-1 ring-blue-400"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-[0.65rem] font-bold px-1.5 py-0.5 rounded shrink-0 ${typeColor}`}
                      >
                        {el.type}
                      </span>
                      <span className="flex-1 text-sm text-gray-700 truncate">{label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(el.id);
                        }}
                        className="text-gray-300 hover:text-red-500 text-sm shrink-0 font-semibold"
                        title="Delete element"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add element buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addElement(defaultTextElement(fontFamily))}
                className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                + Text
              </button>
              <button
                onClick={() => addElement(defaultLogoElement())}
                className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
              >
                + Logo
              </button>
              <button
                onClick={() => addElement(defaultQRElement())}
                className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
              >
                + QR Code
              </button>
              <button
                onClick={() => addElement(defaultCertLogoElement())}
                className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors"
              >
                + Cert Logo
              </button>
              <button
                onClick={() => addElement(defaultShapeElement())}
                className="col-span-2 py-1.5 px-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                + Shape
              </button>
            </div>
          </div>

          {/* Properties panel for selected element */}
          {selectedElement && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Properties</h3>
              <ElementProperties
                element={selectedElement}
                onChange={(patch) => updateElement(selectedElement.id, patch)}
              />
            </div>
          )}

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving…" : "Save Design"}
          </Button>
        </div>

        {/* ── Right panel: Canvas preview ── */}
        <div className="lg:sticky lg:top-8 self-start">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Canvas Preview</h3>
            <p className="text-xs text-gray-400 mb-4">
              Drag elements to reposition · Click to select · Uses sample data
            </p>
            <CanvasCardSide
              elements={elements}
              employee={mockEmployee}
              backgroundColor={backgroundColor}
              editable
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={moveElement}
            />
            <p className="text-xs text-gray-300 text-center mt-3">
              {elements.length === 0
                ? "Default card layout will be used when no elements are added"
                : `${elements.length} element${elements.length !== 1 ? "s" : ""} on ${side} side`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Per-element properties panels ─────────────────────────────────────────────

interface ElementPropertiesProps {
  element: CardElement;
  onChange: (patch: Record<string, unknown>) => void;
}

function ElementProperties({ element, onChange }: ElementPropertiesProps) {
  if (element.type === "text")
    return <TextElementProperties el={element as TextCardElement} onChange={onChange} />;
  if (element.type === "logo")
    return <LogoElementProperties el={element as LogoCardElement} onChange={onChange} />;
  if (element.type === "qr")
    return <QRElementProperties el={element as QRCardElement} onChange={onChange} />;
  if (element.type === "shape")
    return <ShapeElementProperties el={element as ShapeCardElement} onChange={onChange} />;
  return <CertLogoElementProperties el={element as CertLogoCardElement} onChange={onChange} />;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function TextElementProperties({
  el,
  onChange,
}: {
  el: TextCardElement;
  onChange: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Element Label
        </label>
        <input
          type="text"
          value={el.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Fullname"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Template */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Template{" "}
          <span className="text-gray-400 font-normal">
            (type text or insert variables)
          </span>
        </label>
        <textarea
          value={el.template}
          onChange={(e) => onChange({ template: e.target.value })}
          placeholder="e.g. {{first_name}} {{last_name}}"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Variable insertion */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1.5">Insert Variable</p>
        <div className="flex flex-wrap gap-1">
          {CARD_VARIABLES.map((v) => (
            <button
              key={v.key}
              onClick={() => onChange({ template: el.template + v.key })}
              className="text-[0.65rem] px-1.5 py-0.5 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded transition-colors font-mono"
              title={v.key}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={el.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
          />
          <input
            type="text"
            value={el.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Font family */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Font</label>
        <select
          value={el.font_family}
          onChange={(e) => onChange({ font_family: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500">Font Size</label>
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {el.font_size.toFixed(1)} vw
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.1}
          value={el.font_size}
          onChange={(e) => onChange({ font_size: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Style options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={el.font_weight === "bold"}
            onChange={(e) => onChange({ font_weight: e.target.checked ? "bold" : "normal" })}
            className="accent-blue-600"
          />
          Bold
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={el.uppercase}
            onChange={(e) => onChange({ uppercase: e.target.checked })}
            className="accent-blue-600"
          />
          Uppercase
        </label>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Alignment
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ text_align: a })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                el.text_align === a
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoElementProperties({
  el,
  onChange,
}: {
  el: LogoCardElement;
  onChange: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Logo Image
        </label>
        {el.src ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={el.src}
              alt="Logo preview"
              className="max-h-16 object-contain rounded border border-gray-200 bg-gray-50 p-1"
            />
            <button
              onClick={() => onChange({ src: undefined })}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove upload (use company logo)
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-xs text-gray-500">Upload logo image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange({ src: await readFileAsDataURL(file) });
                }}
              />
            </label>
            <p className="text-[0.65rem] text-gray-400 text-center">
              Or leave empty to use the company logo
            </p>
          </div>
        )}
      </div>

      {/* Width */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500">Width</label>
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {el.width.toFixed(0)} vw
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={el.width}
          onChange={(e) => onChange({ width: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}

function QRElementProperties({
  el,
  onChange,
}: {
  el: QRCardElement;
  onChange: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          QR Code URL
        </label>
        <input
          type="url"
          value={el.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://example.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={el.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Training Courses Offered"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500">Size</label>
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {el.size.toFixed(0)} vw
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={20}
          step={1}
          value={el.size}
          onChange={(e) => onChange({ size: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}

function CertLogoElementProperties({
  el,
  onChange,
}: {
  el: CertLogoCardElement;
  onChange: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Certification Logo Image
        </label>
        {el.src ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={el.src}
              alt="Cert logo preview"
              className="max-h-16 object-contain rounded border border-gray-200 bg-gray-50 p-1"
            />
            <button
              onClick={() => onChange({ src: undefined })}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove upload (use filename instead)
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-xs text-gray-500">Upload cert logo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) onChange({ src: await readFileAsDataURL(file) });
              }}
            />
          </label>
        )}
      </div>

      {/* Fallback filename */}
      {!el.src && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Or use filename
          </label>
          <input
            type="text"
            value={el.filename}
            onChange={(e) => onChange({ filename: e.target.value })}
            placeholder="e.g. ClassNK.jpg"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-[0.65rem] text-gray-400 mt-1">
            From <code className="bg-gray-100 px-1 rounded">/public/assets/certifications/</code>
          </p>
        </div>
      )}

      {/* Width */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500">Width</label>
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {el.width.toFixed(0)} vw
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={20}
          step={1}
          value={el.width}
          onChange={(e) => onChange({ width: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}

function SliderWithInput({
  label,
  value,
  min,
  max,
  sliderStep,
  inputStep,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  sliderStep: number;
  inputStep: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={inputStep}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
          }}
          className="w-20 text-xs font-mono text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 text-right focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={sliderStep}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-[0.65rem] text-gray-400 w-5 shrink-0">{unit}</span>
      </div>
    </div>
  );
}

function ShapeElementProperties({
  el,
  onChange,
}: {
  el: ShapeCardElement;
  onChange: (p: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Shape type */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Shape</label>
        <div className="flex gap-1">
          {(["rectangle", "rounded_rectangle", "circle"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ shape: s })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                el.shape === s
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {s === "rectangle" ? "Rect" : s === "rounded_rectangle" ? "Rounded" : "Circle"}
            </button>
          ))}
        </div>
      </div>

      {/* Fill color */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Fill Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={el.fill_color}
            onChange={(e) => onChange({ fill_color: e.target.value })}
            className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
          />
          <input
            type="text"
            value={el.fill_color}
            onChange={(e) => onChange({ fill_color: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Border */}
      <div className="space-y-2">
        <SliderWithInput
          label="Border Width"
          value={el.border_width}
          min={0}
          max={20}
          sliderStep={1}
          inputStep={0.5}
          unit="px"
          onChange={(v) => onChange({ border_width: v })}
        />
        {el.border_width > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Border Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={el.border_color}
                onChange={(e) => onChange({ border_color: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
              />
              <input
                type="text"
                value={el.border_color}
                onChange={(e) => onChange({ border_color: e.target.value })}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Width */}
      <SliderWithInput
        label="Width"
        value={el.width}
        min={0.05}
        max={100}
        sliderStep={0.5}
        inputStep={0.05}
        unit="vw"
        onChange={(v) => onChange({ width: v })}
      />

      {/* Height */}
      <SliderWithInput
        label="Height"
        value={el.height}
        min={0.05}
        max={100}
        sliderStep={0.5}
        inputStep={0.05}
        unit="vw"
        onChange={(v) => onChange({ height: v })}
      />

      {/* Opacity */}
      <SliderWithInput
        label="Opacity"
        value={el.opacity}
        min={0}
        max={100}
        sliderStep={1}
        inputStep={0.5}
        unit="%"
        onChange={(v) => onChange({ opacity: v })}
      />
    </div>
  );
}
