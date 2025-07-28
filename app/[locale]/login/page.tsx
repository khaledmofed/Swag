"use client";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { useState, useRef, useEffect, RefObject } from "react";
import Icon from "@/components/common/Icon";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useRef as useToastRef } from "react";
import { useEffect as useToastEffect } from "react";

export type ToastType = { type: "success" | "error"; message: string };

export default function LoginPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const codeRefs: RefObject<HTMLInputElement | null>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const router = useRouter();

  // Toast state
  const [toast, setToast] = useState<ToastType | null>(null);
  const toastTimeout = useToastRef<NodeJS.Timeout | null>(null);

  // Toast effect
  useToastEffect(() => {
    if (toast) {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToast(null), 3500);
    }
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [toast]);

  // Zustand store
  const {
    loading,
    error,
    otpSent: storeOtpSent,
    sendOtp,
    verifyOtp,
    token,
    profile,
  } = useUserStore();
  const [otpSent, setOtpSent] = useState(storeOtpSent);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  useEffect(() => {
    if (token && profile) {
      // إعادة التوجيه بعد نجاح التحقق
      router.push("/store");
    }
  }, [token, profile, router]);

  // منع الدخول للوجن إذا كان مسجل دخول
  useEffect(() => {
    if (token && profile) {
      router.replace("/store");
    }
  }, [token, profile, router]);

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 3) codeRefs[idx + 1].current?.focus();
    if (!val && idx > 0) codeRefs[idx - 1].current?.focus();
  };

  const handleCodeKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      codeRefs[idx - 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) codeRefs[idx - 1].current?.focus();
    if (e.key === "ArrowRight" && idx < 3) codeRefs[idx + 1].current?.focus();
  };

  const toastMessage = (toast as ToastType | null)?.message ?? "";

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sukar">
      {/* Toast Message */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md flex justify-center pointer-events-none`}
        >
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded shadow-lg min-w-[300px] pointer-events-auto border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <Icon
              name="checkCircle"
              size={28}
              className={
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }
            />
            <div className="flex flex-col">
              <span
                className={`font-bold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success"
                  ? t("common.success")
                  : t("common.error")}
              </span>
              <span className="text-gray-700">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
      {/* Left: Welcome */}
      <div
        className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-[#e8e6e3] to-[#b7c7c7] p-12 relative"
        style={{
          direction: isRTL ? "rtl" : "ltr",
          backgroundImage:
            "url(/bk-auth.png), linear-gradient(135deg, #e8e6e3 0%, #b7c7c7 100%)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-start max-w-lg w-full">
          <div className="mb-8">
            <img
              src="/logo-auth.png"
              alt="SWAG Logo"
              className="w-auto h-14 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/")}
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-10 font-sans">
              {t("login.welcome_title")}
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              {t("login.welcome_desc")}
            </p>
          </div>
        </div>
      </div>
      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <img
            src="/logo-swag-dark.png"
            alt="SWAG Logo"
            className="w-auto h-20 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          />

          {!otpSent ? (
            <>
              <h2 className="text-2xl font-bold text-[#607A76] mb-2">
                {t("login.login_title")}
              </h2>
              <p className=" mb-6">{t("login.login_desc")}</p>
              <form
                className="w-full flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!phone.trim()) return;
                  try {
                    const res = (await sendOtp(phone)) as {
                      status: boolean;
                      msg: string;
                      data?: any;
                    };
                    if (res.status) {
                      setToast({ type: "success", message: res.msg });
                      setTimer(45);
                      setCode(["", "", "", ""]);
                      setOtpSent(true); // فعّل شاشة إدخال OTP
                    } else {
                      setToast({ type: "error", message: res.msg });
                    }
                  } catch (err: any) {
                    setToast({
                      type: "error",
                      message: t("login.error_sending_otp"),
                    });
                  }
                }}
              >
                <label className="text-gray-700 font-medium">
                  {t("login.mobile_label")}
                </label>
                <div
                  className={`flex gap-2 ${
                    error ? "border border-red-400" : ""
                  } p-1`}
                >
                  <select
                    className="border border-gray-300  px-2 py-2 bg-gray-50 text-gray-700"
                    defaultValue="966"
                    disabled
                  >
                    <option value="966">+966</option>
                  </select>
                  <input
                    type="tel"
                    className={`flex-1 border border-gray-300  px-4 py-2 text-lg ${
                      error ? "text-red-500 placeholder-red-400" : ""
                    }`}
                    placeholder={
                      error
                        ? t("login.mobile_error_placeholder")
                        : t("login.mobile_placeholder")
                    }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ background: "transparent" }}
                  />
                </div>
                {error && <p className="text-md text-red-500 mt-1">{error}</p>}
                <button
                  type="submit"
                  className="mt-4 w-full py-3 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                  disabled={loading}
                >
                  {loading ? t("login.sending") : t("login.login_button")}
                </button>
              </form>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold text-[#607A76] mb-2 font-sans">
                {t("login.verify_title")}
              </h2>
              <p className="mb-6 text-center">{t("login.verify_desc")}</p>
              <div className="flex justify-center gap-2 mb-4">
                {code.map((v, i) => (
                  <input
                    key={i}
                    ref={codeRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-14 h-14 text-2xl text-center border border-gray-300 bg-white focus:border-[#607A76] focus:ring-2 focus:ring-[#607A76] outline-none"
                    value={v}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  />
                ))}
              </div>
              <div className="mb-6 text-center text-gray-500">
                {t("login.verify_not_received")}{" "}
                <button
                  className="text-primary-500 underline disabled:text-gray-400"
                  disabled={timer > 0 || loading}
                  onClick={() => {
                    sendOtp(phone);
                    setTimer(45);
                  }}
                >
                  {t("login.verify_resend")}
                  {timer > 0 ? ` (${String(timer).padStart(2, "0")})` : ""}
                </button>
              </div>
              <button
                className="w-full py-3 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                onClick={async () => {
                  const otp = code.join("");
                  if (otp.length === 4) {
                    try {
                      console.log("Verifying OTP:", otp);
                      const res = (await verifyOtp(phone, otp)) as {
                        status: boolean;
                        msg: string;
                        data?: any;
                      };
                      console.log("Login verification response:", res);
                      console.log(
                        "Token from localStorage:",
                        localStorage.getItem("token")
                      );
                      console.log(
                        "User from localStorage:",
                        localStorage.getItem("user")
                      );

                      if (res.status) {
                        setToast({ type: "success", message: res.msg });
                        if (res.data?.user) {
                          // انتقل تلقائياً إلى صفحة /store
                          console.log("Redirecting to store...");
                          router.push("/store");
                        }
                      } else {
                        setToast({ type: "error", message: res.msg });
                      }
                    } catch (err: any) {
                      setToast({
                        type: "error",
                        message: t("login.invalid_otp"),
                      });
                    }
                  }
                }}
                disabled={loading}
              >
                {loading ? t("login.verifying") : t("login.verify_button")}
              </button>
              {error && <p className="text-md text-red-500 mt-2">{error}</p>}
            </div>
          )}
          <div className="mt-6 text-center">
            <span>{t("login.no_account")}</span>
            <a
              href="/register"
              className="ml-2 text-primary-500 font-bold hover:underline"
            >
              {t("login.register_now")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
