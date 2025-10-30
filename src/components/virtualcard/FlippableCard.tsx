"use client";

import { useState } from "react";
import { VirtualCard } from "@/types";

interface FlippableCardProps {
  card: VirtualCard;
}

export default function FlippableCard({ card }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const employee = card.employee;
  const themeColor = card.theme_color || "#6366f1";

  if (!employee) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 w-full max-w-4xl mx-auto">
      <div
        className={`relative w-full transition-transform duration-700 transform-style-3d cursor-pointer ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <div
          className="backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor})`,
          }}
        >
          <div className="p-8 md:p-12 text-white min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold mb-6 md:mb-0 md:mr-8 shadow-lg">
                  {employee.first_name.charAt(0)}
                  {employee.last_name.charAt(0)}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    {employee.first_name}{" "}
                    {employee.middle_name && employee.middle_name + " "}
                    {employee.last_name}
                  </h1>
                  <p className="text-2xl opacity-90 mb-2">{employee.position}</p>
                  {employee.department && (
                    <p className="text-lg opacity-80">{employee.department}</p>
                  )}
                </div>
              </div>

              {employee.company && (
                <div className="mb-6">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 opacity-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <div>
                      <p className="text-xl font-semibold">
                        {employee.company.company_name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center pt-6 border-t border-white border-opacity-20">
              <svg
                className="w-6 h-6 mr-2 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <p className="text-lg opacity-90">Click to flip card</p>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute top-0 left-0 w-full backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
          }}
        >
          <div className="p-8 md:p-12 text-white min-h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-4">
                <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${employee.email}`}
                    className="hover:underline break-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {employee.email}
                  </a>
                </div>

                {employee.mobile_number && (
                  <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                    <svg
                      className="w-6 h-6 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${employee.mobile_number}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {employee.mobile_number}
                    </a>
                  </div>
                )}

                {employee.telephone && (
                  <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                    <svg
                      className="w-6 h-6 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${employee.telephone}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {employee.telephone}
                    </a>
                  </div>
                )}

                {employee.company?.address && (
                  <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                    <svg
                      className="w-6 h-6 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{employee.company.address}</span>
                  </div>
                )}
              </div>

              {card.bio && (
                <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">About</h3>
                  <p className="opacity-90 leading-relaxed">{card.bio}</p>
                </div>
              )}

              {(card.facebook_url ||
                card.linkedin_url ||
                card.twitter_url ||
                card.instagram_url) && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {card.facebook_url && (
                      <a
                        href={card.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Facebook
                      </a>
                    )}
                    {card.linkedin_url && (
                      <a
                        href={card.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        LinkedIn
                      </a>
                    )}
                    {card.twitter_url && (
                      <a
                        href={card.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Twitter
                      </a>
                    )}
                    {card.instagram_url && (
                      <a
                        href={card.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center pt-6 border-t border-white border-opacity-20">
              <svg
                className="w-6 h-6 mr-2 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <p className="text-lg opacity-90">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
