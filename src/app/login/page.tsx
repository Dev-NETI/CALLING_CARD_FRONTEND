"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const MICROSOFT_URL =
  process.env.NEXT_PUBLIC_MICROSOFT_LOGIN_URL ??
  "https://api-business-card.neti.com.ph/api/auth/microsoft/redirect";

export default function LoginPage() {
  const [isMountedState, setIsMountedState] = useState(false);

  useEffect(() => {
    setIsMountedState(true);
  }, []);

  const floatingShapes = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="min-h-screen flex overflow-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {isMountedState &&
          floatingShapes.map((shape) => (
            <motion.div
              key={shape.id}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{ left: `${shape.left}%`, top: `${shape.top}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: shape.duration,
                repeat: Infinity,
                delay: shape.delay,
              }}
            />
          ))}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row relative z-10">
        {/* Left side - Branding */}
        <motion.div
          className="hidden lg:flex lg:flex-1 flex-col justify-center items-center p-12 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="max-w-md"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              NETI Business Card App
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Manage and share digital business cards.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Right side - Login card */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 border border-gray-100"
              whileHover={{ scale: 1.01 }}
            >
              {/* Mobile logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 tracking-tight">
                  Welcome
                </h2>
                <p className="text-gray-500 text-sm">
                  Sign in with your Microsoft 365 account
                </p>
              </div>

              {/* Direct anchor link — most reliable way to trigger OAuth redirect */}
              <motion.a
                href={MICROSOFT_URL}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  viewBox="0 0 21 21"
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Sign in with Microsoft
              </motion.a>
            </motion.div>

            <motion.p
              className="text-center mt-8 text-sm text-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              NETI Business Card App &copy; 2025
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
