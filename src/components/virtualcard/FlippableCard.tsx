"use client";

import { useState } from "react";
import { Employee } from "@/types";
import Image from "next/image";

interface FlippableCardProps {
  employee: Employee;
}

export default function FlippableCard({ employee }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!employee) return null;

  // Format middle name as initial
  const middleInitial = employee.middle_name
    ? `${employee.middle_name.charAt(0)}.`
    : "";

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
          {/* FRONT SIDE */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              fontSize: "clamp(0.5rem, 2vw, 1rem)",
            }}
          >
            {/* Top Section */}
            <div className="flex justify-center items-start h-[20%]">
              {/* Company Logo - Centered */}
              <div className="relative w-full h-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                <Image
                  src={"/assets/logo/" + employee.company?.company_logo}
                  alt={employee.company?.company_logo || "Company Logo"}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Center Section - Employee Details */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="space-y-0.5 text-center w-full px-2">
                {/* Name */}
                <h1
                  className="font-bold text-[#1e3a8a] uppercase break-words leading-tight"
                  style={{ fontSize: "clamp(0.75rem, 3.5vw, 2.5rem)" }}
                >
                  {employee.first_name} {middleInitial} {employee.last_name}
                </h1>

                {/* Department */}
                {employee.department && (
                  <p
                    className="font-bold text-[#000000] break-words leading-tight"
                    style={{ fontSize: "clamp(0.5rem, 2vw, 1.5rem)" }}
                  >
                    {employee.department}
                  </p>
                )}

                {/* Position */}
                <p
                  className="font-bold text-[#000000] break-words leading-tight"
                  style={{ fontSize: "clamp(0.5rem, 2vw, 1.5rem)" }}
                >
                  {employee.position}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end gap-2">
              <div className="flex justify-start flex-1 min-w-0">
                {/* Contact Info */}
                <div className="space-y-0.5 text-[#000000] w-full">
                  {employee.telephone && (
                    <p
                      className="break-words leading-tight"
                      style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
                    >
                      Tel : {employee.telephone}
                    </p>
                  )}
                  {employee.mobile_number && (
                    <p
                      className="break-words leading-tight"
                      style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
                    >
                      Mobile : {employee.mobile_number}
                    </p>
                  )}
                  <p
                    className="break-words leading-tight"
                    style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
                  >
                    Email :{employee.email}
                  </p>
                </div>
              </div>

              {/* Bottom Right - Certification Badge */}
              <div className="flex justify-end shrink-0">
                <div
                  className="relative"
                  style={{
                    width: "clamp(3rem, 8vw, 8rem)",
                    height: "clamp(3rem, 8vw, 8rem)",
                  }}
                >
                  {/* Placeholder for ISO certification logo */}
                  <Image
                    src="/assets/certifications/ClassNK.jpg"
                    alt="ISO 9001 Certified"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}

          <div
            className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              fontSize: "clamp(0.5rem, 2vw, 1rem)",
            }}
          >
            {/* Top Section */}
            <div className="flex justify-center items-start h-[20%]">
              {/* Company Logo - Centered */}
              <div className="relative w-full h-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                <Image
                  src={"/assets/logo/" + employee.company?.company_logo}
                  alt={employee.company?.company_logo || "Company Logo"}
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-center space-y-2 w-full px-2">
              {/* Company Address */}
              {employee.company?.company_address && (
                <div className="text-[#000000]">
                  <p
                    className="break-words font-bold leading-tight"
                    style={{ fontSize: "clamp(0.5rem, 2vw, 1.5rem)" }}
                  >
                    {employee.company.company_address}
                  </p>
                </div>
              )}
              {/* Company Telephone */}
              <div className="text-[#000000] space-y-1">
                {employee.company?.company_telephone && (
                  <p
                    className="break-words leading-tight"
                    style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
                  >
                    Tel: {employee.company.company_telephone}
                  </p>
                )}
              </div>

              {/* Company Website */}
              <div className="text-[#000000] space-y-1">
                {employee.company?.company_website && (
                  <p
                    className="break-words leading-tight"
                    style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
                  >
                    Website: {employee.company.company_website}
                  </p>
                )}
              </div>

              {/* Sail Green Logo - Centered */}
              <div className="flex justify-center items-center w-full">
                <div
                  className="relative"
                  style={{
                    width: "clamp(4rem, 10vw, 12rem)",
                    height: "clamp(4rem, 10vw, 12rem)",
                  }}
                >
                  <Image
                    src={"/assets/certifications/sail_green.png"}
                    alt={employee.company?.company_logo || "Sail Green"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
