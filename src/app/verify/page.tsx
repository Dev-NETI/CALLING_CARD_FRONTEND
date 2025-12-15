"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import VerificationInput from "@/components/ui/VerificationInput";

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setAuthData } = useAuth();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, router]);

  const handleVerify = async () => {
    if (!userId) return;

    const codeString = code.join("");
    if (codeString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api.verifyCode({
        user_id: parseInt(userId),
        code: codeString,
      });

      // Store auth data
      setAuthData(response.user, response.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      let errorMessage = "Verification failed";

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide user-friendly messages
        if (errorMessage.includes("Invalid verification code")) {
          errorMessage = "Invalid code. Please check and try again.";
        } else if (errorMessage.includes("expired")) {
          errorMessage = "Code expired. Please request a new code.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || !canResend) return;

    setIsLoading(true);
    setError("");

    try {
      await api.resendCode({ user_id: parseInt(userId) });

      // Reset countdown
      setResendCountdown(60);
      setCanResend(false);

      // Restart timer
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      let errorMessage = "Failed to resend code";

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide user-friendly messages
        if (
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError")
        ) {
          errorMessage =
            "Cannot connect to server. Please check your connection.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (code.every((digit) => digit !== "") && !isLoading) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const progressPercentage = (resendCountdown / 60) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
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
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We sent a 6-digit code to your email address.
            <br />
            Please enter it below.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <VerificationInput value={code} onChange={setCode} length={6} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={isLoading || code.some((digit) => digit === "")}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                {canResend ? (
                  "Didn't receive the code?"
                ) : (
                  <>Resend code in {resendCountdown}s</>
                )}
              </p>
              {!canResend && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              variant="outline"
              className="w-full"
            >
              Resend Code
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}
