"use client";

import { useRef } from "react";
import { Employee } from "@/types";
import { motion } from "framer-motion";
import IDCardFront from "./IDCardFront";
import IDCardBack from "./IDCardBack";

interface EmployeeIDCardProps {
  employee: Employee;
  onClose: () => void;
}

export default function EmployeeIDCard({
  employee,
  onClose,
}: EmployeeIDCardProps) {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-900">Employee ID Card</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cards Preview */}
        <div className="p-6">
          {/* Cards Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Front Card */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Front Side
              </h3>
              <div
                className="shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: "236px", // 40% of 590px
                  height: "400px", // 40% of 1000px
                }}
              >
                <div
                  style={{
                    width: "590px",
                    height: "1000px",
                    transform: "scale(0.4)",
                    transformOrigin: "top left",
                  }}
                >
                  <IDCardFront ref={frontCardRef} employee={employee} />
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Back Side
              </h3>
              <div
                className="shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: "236px", // 40% of 590px
                  height: "400px", // 40% of 1000px
                }}
              >
                <div
                  style={{
                    width: "590px",
                    height: "1000px",
                    transform: "scale(0.4)",
                    transformOrigin: "top left",
                  }}
                >
                  <IDCardBack ref={backCardRef} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
