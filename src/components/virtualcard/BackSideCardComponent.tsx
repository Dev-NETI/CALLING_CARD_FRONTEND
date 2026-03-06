import { forwardRef } from "react";
import { Employee } from "@/types";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

interface BackSideCardComponentProps {
  employee: Employee;
}

const QR_CODE_URL =
  "https://netiph-my.sharepoint.com/:b:/g/personal/hannah_hernandez_neti_com_ph/IQCosby9uj4wT6e8GLcrc6ibAUKobdW25mkUDVox44Fp63o?e=Ss08aQ";

const BackSideCardComponent = forwardRef<
  HTMLDivElement,
  BackSideCardComponentProps
>(function BackSideCardComponent({ employee }, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-2xl p-[clamp(0.5rem,2vw,2rem)] flex flex-col justify-between"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        fontSize: "clamp(0.5rem, 2vw, 1rem)",
        fontFamily: "'Century Gothic', sans-serif",
      }}
    >
      {/* Top Section - Company Logo */}
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

      {/* Two Column Section - Centered */}
      <div
        className="flex flex-1 items-stretch justify-center w-full"
        style={{
          gap: "clamp(1.5rem, 6vw, 4rem)",
          paddingLeft: "clamp(0.5rem, 2vw, 1rem)",
          paddingRight: "clamp(0.5rem, 2vw, 1rem)",
        }}
      >
        {/* Left - QR Code + Label — vertically centered in card */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div
            className="mt-7 ml-10 sm:mt-10 sm:ml-4 md:mt-10 md:ml-4"
            style={{ width: "clamp(3rem, 14vw, 9rem)" }}
          >
            <QRCodeSVG
              value={QR_CODE_URL}
              size={150}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <p
            className="ml-10 sm:ml-4 text-center font-bold text-[#000000] leading-tight "
            style={{
              fontSize: "clamp(0.3rem, 1.2vw, 0.85rem)",
              marginTop: "clamp(0.125rem, 0.5vw, 0.5rem)",
            }}
          >
            Training Courses Offered
          </p>
        </div>

        {/* Right - Company Info — vertically centered in card */}
        <div
          className="flex flex-col justify-center text-[#000000] mr-6 sm:mr-0"
          style={{ gap: "clamp(0.125rem, 0.5vw, 0.5rem)" }}
        >
          {employee.company?.company_address && (
            <p
              className="font-bold leading-tight wrap-break-word sm:-mt-9"
              style={{ fontSize: "clamp(0.4rem, 1.8vw, 1.25rem)" }}
            >
              {employee.company.company_address}
            </p>
          )}
          {employee.company?.company_telephone && (
            <p
              className="leading-tight wrap-break-word"
              style={{ fontSize: "clamp(0.35rem, 1.2vw, 0.9rem)" }}
            >
              Tel: {employee.company.company_telephone}
            </p>
          )}
          {employee.company?.company_website && (
            <p
              className="leading-tight wrap-break-word"
              style={{ fontSize: "clamp(0.35rem, 1.2vw, 0.9rem)" }}
            >
              Website: {employee.company.company_website}
            </p>
          )}
        </div>
      </div>

      {/* Certification Logos */}
      <div
        className="relative flex justify-center items-center w-full"
        style={{ marginTop: "clamp(0.5rem, 2vw, 1.5rem)" }}
      >
        {/* Sail Green Logo - Centered */}
        <div
          className="relative"
          style={{
            width: "clamp(3.5rem, 12vw, 10rem)",
            height: "clamp(3.5rem, 12vw, 10rem)",
          }}
        >
          <Image
            src={"/assets/certifications/sail_green.png"}
            alt="Sail Green"
            fill
            className="object-contain"
          />
        </div>

        {/* ClassNK Logo - Right side, shifted left */}
        <div
          className="absolute"
          style={{
            width: "clamp(3.5rem, 12vw, 10rem)",
            height: "clamp(3.5rem, 12vw, 10rem)",
            right: "clamp(1rem, 8vw, 6rem)",
          }}
        >
          <Image
            src="/assets/certifications/ClassNK.jpg"
            alt="ClassNK Certified"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
});

export default BackSideCardComponent;
