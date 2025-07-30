"use client";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/common/Icon";
import { useUserStore } from "@/stores/userStore";

export type ToastType = { type: "success" | "error"; message: string };

export default function RegisterPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    relationship: "",
    birthdayMonth: "",
    birthdayDay: "",
    accountType: "",
    registrationNumber: "",
    companyName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { completeRegistration, loading, error, isRegistered, token, profile } =
    useUserStore();

  // Toast state
  const [toast, setToast] = useState<ToastType | null>(null);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  // Toast effect
  useEffect(() => {
    console.log("=== Toast effect triggered ===");
    console.log("Toast value:", toast);

    if (toast) {
      console.log("Toast exists, setting timeout");
      if (toastTimeout.current) {
        console.log("Clearing existing timeout");
        clearTimeout(toastTimeout.current);
      }
      toastTimeout.current = setTimeout(() => {
        console.log("Toast timeout fired, clearing toast");
        setToast(null);
      }, 3500);
    }
    return () => {
      if (toastTimeout.current) {
        console.log("Clearing timeout on cleanup");
        clearTimeout(toastTimeout.current);
      }
    };
  }, [toast]);

  // التحقق من وجود registrationToken وحذفه عند الخروج من الصفحة
  useEffect(() => {
    const registrationToken = localStorage.getItem("registrationToken");
    if (!registrationToken) {
      console.log("No registration token found, redirecting to login");
      router.replace("/login");
    }

    // Cleanup function - حذف registrationToken عند الخروج من الصفحة
    return () => {
      const currentRegistrationToken =
        localStorage.getItem("registrationToken");
      if (currentRegistrationToken) {
        console.log("Cleaning up registrationToken on page unmount");
        localStorage.removeItem("registrationToken");
        // Also clear from store if it exists
        const { setRegistrationToken } = useUserStore.getState();
        setRegistrationToken("");
      }
    };
  }, [router]);

  useEffect(() => {
    console.log("=== Register page useEffect for isRegistered ===");
    console.log("isRegistered value:", isRegistered);
    console.log("Current router path:", window.location.pathname);

    if (isRegistered) {
      console.log("isRegistered is true, setting timeout for redirect");
      const timeout = setTimeout(() => {
        console.log("Timeout fired, redirecting to /store");
        // Clear registrationToken before redirecting
        localStorage.removeItem("registrationToken");
        const { setRegistrationToken } = useUserStore.getState();
        setRegistrationToken("");
        router.push("/store");
      }, 2000);
      return () => {
        console.log("Clearing timeout");
        clearTimeout(timeout);
      };
    }
  }, [isRegistered, router]);

  // معالجة الأخطاء من API
  useEffect(() => {
    if (error) {
      try {
        // محاولة تحليل رسالة الخطأ كـ JSON array
        const errorMessages = JSON.parse(error);
        if (Array.isArray(errorMessages)) {
          const newErrors: Record<string, string> = {};
          errorMessages.forEach((msg: string) => {
            if (msg.includes("first name")) {
              newErrors.firstName = msg;
            } else if (msg.includes("last name")) {
              newErrors.lastName = msg;
            } else if (msg.includes("email")) {
              newErrors.email = msg;
            } else if (msg.includes("gender")) {
              newErrors.gender = msg;
            } else if (msg.includes("relationship")) {
              newErrors.relationship = msg;
            } else if (msg.includes("birth")) {
              newErrors.birthdayMonth = msg;
            } else if (msg.includes("account")) {
              newErrors.accountType = msg;
            } else if (msg.includes("registration")) {
              newErrors.registrationNumber = msg;
            } else if (msg.includes("company")) {
              newErrors.companyName = msg;
            }
          });
          setErrors(newErrors);
        } else {
          // إذا لم تكن array، اعرض الخطأ العام
          setErrors({ general: t(error) });
        }
      } catch {
        // إذا فشل في تحليل JSON، اعرض الخطأ كما هو
        setErrors({ general: t(error) });
      }
    } else {
      setErrors({});
    }
  }, [error, t]);

  // Monitor userStore state changes
  useEffect(() => {
    console.log("=== UserStore state changed ===");
    console.log("isRegistered:", isRegistered);
    console.log("token:", token);
    console.log("profile:", profile);
    console.log("loading:", loading);
    console.log("error:", error);
  }, [isRegistered, token, profile, loading, error]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sukar">
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
              className="w-auto h-14 mb-10"
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-10 font-sans">
              {t("register.welcome_title")}
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              {t("register.welcome_desc")}
            </p>
          </div>
        </div>
      </div>
      {/* Right: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <img
            src="/logo-swag-dark.png"
            alt="SWAG Logo"
            className="w-auto h-20 mb-6"
          />
          <h2 className="text-2xl font-bold text-[#607A76] mb-2">
            {t("register.register_title")}
          </h2>
          <p
            className=" mb-6 text-center"
            style={{ lineHeight: "20px", fontSize: "15px" }}
          >
            {t("register.register_desc")}
          </p>
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("=== Form submitted ===");
              console.log("Form data:", form);

              try {
                console.log("Calling completeRegistration...");
                const result = await completeRegistration({
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  gender: form.gender,
                  relationshipStatus: form.relationship || "",
                  birthMonth: form.birthdayMonth,
                  birthDay: parseInt(form.birthdayDay) || 0,
                  accountType: form.accountType,
                  registrationNumber: form.registrationNumber,
                  companyName: form.companyName,
                });

                console.log("=== completeRegistration result ===");
                console.log("Result:", result);
                console.log("Result status:", result?.status);
                console.log("Result msg:", result?.msg);

                // Show success toast if registration was successful
                if (result && result.status) {
                  console.log("Setting success toast");
                  setToast({
                    type: "success",
                    message: result.msg || t("register.success_message"),
                  });
                  console.log("Toast set:", {
                    type: "success",
                    message: result.msg || t("register.success_message"),
                  });
                } else {
                  console.log("No result or result.status is false");
                }
              } catch (error) {
                // Error handling is already done in the useEffect
                console.error("Registration error:", error);
              }
            }}
          >
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
                {errors.general}
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.first_name")}
                </label>
                <input
                  type="text"
                  className={`w-full border px-4 py-2 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("register.first_name_placeholder")}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.last_name")}
                </label>
                <input
                  type="text"
                  className={`w-full border px-4 py-2 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("register.last_name_placeholder")}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <label className="text-gray-700 font-medium">
              {t("register.email")}
            </label>
            <input
              type="email"
              className={`w-full border px-4 py-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("register.email_placeholder")}
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.gender")}
                </label>
                <select
                  className={`w-full border px-4 py-2 ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value }))
                  }
                >
                  <option value="">{t("register.gender_placeholder")}</option>
                  <option value="Male">{t("register.gender_male")}</option>
                  <option value="Female">{t("register.gender_female")}</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.relationship")}
                </label>
                <select
                  className={`w-full border px-4 py-2 ${
                    errors.relationship ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.relationship}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, relationship: e.target.value }))
                  }
                >
                  <option value="">
                    {t("register.relationship_placeholder")}
                  </option>
                  <option value="Single">
                    {t("register.relationship_single")}
                  </option>
                  <option value="Married">
                    {t("register.relationship_married")}
                  </option>
                </select>
                {errors.relationship && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.relationship}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.birthday_month")}
                </label>
                <input
                  type="text"
                  className={`w-full border px-4 py-2 ${
                    errors.birthdayMonth ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("register.birthday_month_placeholder")}
                  value={form.birthdayMonth}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birthdayMonth: e.target.value }))
                  }
                />
                {errors.birthdayMonth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthdayMonth}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.birthday_day")}
                </label>
                <input
                  type="text"
                  className={`w-full border px-4 py-2 ${
                    errors.birthdayDay ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("register.birthday_day_placeholder")}
                  value={form.birthdayDay}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birthdayDay: e.target.value }))
                  }
                />
                {errors.birthdayDay && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthdayDay}
                  </p>
                )}
              </div>
            </div>
            <label className="text-gray-700 font-medium">
              {t("register.account_type")}
            </label>
            <select
              className={`w-full border px-4 py-2 ${
                errors.accountType ? "border-red-500" : "border-gray-300"
              }`}
              value={form.accountType}
              onChange={(e) =>
                setForm((f) => ({ ...f, accountType: e.target.value }))
              }
            >
              <option value="">{t("register.account_type_placeholder")}</option>
              <option value="Individual">
                {t("register.account_type_person")}
              </option>
              <option value="Establishment">
                {t("register.account_type_establishment")}
              </option>
            </select>
            {errors.accountType && (
              <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>
            )}
            {form.accountType === "Establishment" && (
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <label className="text-gray-700 font-medium">
                    {t("register.registration_number")}
                  </label>
                  <input
                    type="text"
                    className={`w-full border px-4 py-2 ${
                      errors.registrationNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={t("register.registration_number_placeholder")}
                    value={form.registrationNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        registrationNumber: e.target.value,
                      }))
                    }
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-gray-700 font-medium">
                    {t("register.company_name")}
                  </label>
                  <input
                    type="text"
                    className={`w-full border px-4 py-2 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t("register.company_name_placeholder")}
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="mt-4 w-full py-3 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
              disabled={loading}
            >
              {loading
                ? t("register.registering")
                : t("register.create_button")}
            </button>
          </form>

          {isRegistered && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm font-sukar"
              style={{ background: "rgba(0, 0, 0, 0.19)" }}
            >
              <div
                className="bg-[#f5f8f7] border border-gray-200 w-full max-w-2xl mx-auto shadow-lg relative"
                style={{ borderRadius: 0, padding: 20 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => router.push("/store")}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 rounded-full p-3 mb-2">
                    <Icon
                      name="checkCircle"
                      size={38}
                      className="text-green-500"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-center">
                    {t("register.success_title")}
                  </h2>
                  <p className=" mb-6 text-center">
                    {t("register.success_desc")}
                  </p>
                  <button
                    className="w-full py-3 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                    onClick={() => router.push("/store")}
                  >
                    {t("register.go_home")}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 text-center">
            <span>{t("register.have_account")}</span>
            <a
              href="/login"
              className="ml-2 text-primary-500 font-bold hover:underline"
            >
              {t("register.sign_in_now")}
            </a>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <Icon
              name={toast.type === "success" ? "checkCircle" : "x"}
              size={20}
              className="text-white"
            />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
