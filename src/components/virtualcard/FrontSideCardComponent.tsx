import { Employee } from "@/types";
import Image from "next/image";

interface FrontSideCardComponentProps {
  employee: Employee;
}

export default function FrontSideCardComponent({
  employee,
}: FrontSideCardComponentProps) {
  const middleInitial = employee.middle_name
    ? `${employee.middle_name.charAt(0)}.`
    : "";

  return (
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
        <div
          className="space-y-0.5 text-center w-full px-2"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
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
          <div
            className="space-y-0.5 text-[#000000] w-full font-bold"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
          >
            {employee.telephone && (
              <p
                className="flex leading-tight"
                style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
              >
                <span style={{ minWidth: "7ch" }}>Tel</span>
                <span className="wrap-break-word min-w-0">
                  : {employee.telephone}
                </span>
              </p>
            )}
            {employee.mobile_number && (
              <p
                className="flex leading-tight"
                style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
              >
                <span style={{ minWidth: "7ch" }}>Mobile</span>
                <span className="wrap-break-word min-w-0">
                  : {employee.mobile_number}
                </span>
              </p>
            )}
            <p
              className="flex leading-tight"
              style={{ fontSize: "clamp(0.4rem, 1.2vw, 1rem)" }}
            >
              <span style={{ minWidth: "7ch" }}>Email</span>
              <span className="wrap-break-word min-w-0">
                : {employee.email}
              </span>
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
            {/* <Image
              src="/assets/certifications/ClassNK.jpg"
              alt="ISO 9001 Certified"
              fill
              className="object-contain"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
