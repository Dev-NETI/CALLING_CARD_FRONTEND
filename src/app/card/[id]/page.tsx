"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import { api } from "@/lib/api";
import { Employee } from "@/types";
import Button from "@/components/ui/Button";
import FlippableCard, {
  FlippableCardHandle,
} from "@/components/virtualcard/FlippableCard";

export default function PublicCardPage() {
  const params = useParams();
  const employeeId = parseInt(params.id as string);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<FlippableCardHandle>(null);

  useEffect(() => {
    if (employeeId) {
      fetchCard();
    }
  }, [employeeId]);

  const fetchCard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getVirtualCard(employeeId);
      setEmployee(data);
    } catch (error: any) {
      // Handle different error types
      if (error.message?.includes("404")) {
        setError("Employee not found");
      } else if (error.message?.includes("403")) {
        setError("This employee or company is no longer active");
      } else {
        setError("Employee not found");
      }
      console.error("Error fetching employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadContact = () => {
    if (!employee) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.first_name} ${employee.middle_name || ""} ${employee.last_name}
N:${employee.last_name};${employee.first_name};${employee.middle_name || ""};;
TITLE:${employee.position}
ORG:${employee.company?.company_name || ""}
EMAIL:${employee.email}
TEL:${employee.mobile_number || ""}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${employee.first_name}_${employee.last_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const captureElement = async (
    element: HTMLDivElement
  ): Promise<string> => {
    // Get the rendered dimensions of the element
    const rect = element.getBoundingClientRect();

    // Clone the element so we can capture it without affecting the visible card
    const clone = element.cloneNode(true) as HTMLDivElement;

    // Set explicit pixel dimensions on the clone to preserve the exact layout
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.transform = "none";
    clone.style.backfaceVisibility = "visible";
    (clone.style as any).WebkitBackfaceVisibility = "visible";

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      width: rect.width,
      height: rect.height,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(clone);

    return canvas.toDataURL("image/png");
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCard = async () => {
    if (!employee || !cardRef.current) return;

    const { frontRef, backRef } = cardRef.current;
    if (!frontRef || !backRef) return;

    setIsDownloading(true);

    try {
      const name = `${employee.first_name}_${employee.last_name}`;

      // Capture front side
      const frontDataUrl = await captureElement(frontRef);
      downloadImage(frontDataUrl, `${name}_front.png`);

      // Small delay between downloads so browser handles both
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture back side
      const backDataUrl = await captureElement(backRef);
      downloadImage(backDataUrl, `${name}_back.png`);
    } catch (err) {
      console.error("Error downloading card images:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading virtual card...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <svg
            className="w-20 h-20 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error?.includes("no longer active") ? "Inactive" : "Not Found"}
          </h2>
          <p className="text-gray-600">
            {error || "The employee you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-end gap-3">
          <Button variant="primary" size="sm" onClick={handleDownloadContact}>
            <svg
              className="w-4 h-4 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Save Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCard}
            disabled={isDownloading}
          >
            <svg
              className="w-4 h-4 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isDownloading ? "Downloading..." : "Download Card"}
          </Button>
        </div>

        <FlippableCard ref={cardRef} employee={employee} />
      </div>
    </div>
  );
}
