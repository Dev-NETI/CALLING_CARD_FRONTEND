"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

function TwoFactorSetupContent() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoadingSetup, setIsLoadingSetup] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeToken = searchParams.get("token");
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!challengeToken) {
      router.replace("/login");
      return;
    }

    api.twoFactorGetSetup(challengeToken)
      .then((data) => {
        setQrCode(data.qr_code);
        setSecret(data.secret);
      })
      .catch(() => {
        showToast("Session expired. Please sign in again.", "error");
        router.replace("/login");
      })
      .finally(() => setIsLoadingSetup(false));
  }, [challengeToken, router, showToast]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    setError(null);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...code];
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setCode(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await api.twoFactorConfirmSetup({
        challenge_token: challengeToken!,
        code: fullCode,
      });
      login(response.user, response.token);
      showToast("2FA setup complete! Welcome.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(msg);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoadingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Setting up your authenticator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Up Authenticator</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Scan the QR code with <strong>Microsoft Authenticator</strong> then enter the 6-digit code to confirm.
          </p>
        </div>

        {/* QR Code */}
        {qrCode && (
          <div className="flex justify-center mb-5">
            <div className="p-3 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          </div>
        )}

        {/* Manual secret */}
        {secret && (
          <div className="bg-gray-50 rounded-xl p-3 mb-6 text-center">
            <p className="text-xs text-gray-500 mb-1">Manual entry key</p>
            <p className="font-mono text-sm font-semibold text-gray-800 tracking-widest break-all">{secret}</p>
          </div>
        )}

        {/* Steps */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Setup steps</p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Open <strong>Microsoft Authenticator</strong> on your phone</li>
            <li>Tap <strong>Add account → Work or school account → Scan QR code</strong></li>
            <li>Point your camera at the QR code above</li>
            <li>Enter the 6-digit code shown in the app below</li>
          </ol>
        </div>

        {/* Code input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
            Enter verification code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-13 text-center text-xl font-bold text-gray-900 border-2 rounded-xl outline-none transition-all
                  ${error ? "border-red-400 bg-red-50" : digit ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={handleVerify}
          isLoading={isVerifying}
          disabled={code.join("").length !== 6}
        >
          Confirm &amp; Continue
        </Button>
      </motion.div>
    </div>
  );
}

export default function TwoFactorSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TwoFactorSetupContent />
    </Suspense>
  );
}
