"use client";

import { useState } from "react";
import { useSignInWithEmail, useVerifyEmailOTP, useIsSignedIn } from "@coinbase/cdp-hooks";
import { Button } from "./Button";

export function EmailAuth() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { isSignedIn } = useIsSignedIn();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  if (isSignedIn) {
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailLoading(true);
    
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
      setStep("otp");
    } catch (error: any) {
      setError(error.message || "Failed to send verification code");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) return;
    
    setError(null);
    setOtpLoading(true);
    
    try {
      await verifyEmailOTP({ flowId, otp });
      // User is now signed in automatically
    } catch (error: any) {
      setError(error.message || "Invalid verification code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setFlowId(null);
    setOtp("");
    setError(null);
  };

  if (step === "email") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Enter Your Email
            </h2>
            <p className="text-gray-400">
              We'll send you a verification code to get started
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                required
                disabled={emailLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={emailLoading || !email}
              loading={emailLoading}
              size="lg"
              fullWidth
            >
              Send Verification Code
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-400 mb-4">
            Enter the 6-digit code sent to
          </p>
          <p className="text-red-500 font-semibold">{email}</p>
        </div>

        <form onSubmit={handleOTPSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-600 focus:border-red-500 focus:outline-none transition-colors text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              required
              disabled={otpLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={otpLoading || otp.length !== 6}
              loading={otpLoading}
              size="lg"
              fullWidth
            >
              Verify & Continue
            </Button>
            
            <Button
              type="button"
              onClick={handleBackToEmail}
              variant="ghost"
              size="lg"
              fullWidth
            >
              Use Different Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}