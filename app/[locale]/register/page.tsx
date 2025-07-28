"use client";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/common/Icon";
import { useUserStore } from "@/stores/userStore";

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
  const router = useRouter();
  const { completeRegistration, loading, error, isRegistered } = useUserStore();

  useEffect(() => {
    if (isRegistered) {
      const timeout = setTimeout(() => {
        router.push("/store");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isRegistered, router]);

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
              await completeRegistration({
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
            }}
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.first_name")}
                </label>
                <input
                  type="text"
                  className="w-full  border border-gray-300 px-4 py-2"
                  placeholder={t("register.first_name_placeholder")}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.last_name")}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300  px-4 py-2"
                  placeholder={t("register.last_name_placeholder")}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>
            </div>
            <label className="text-gray-700 font-medium">
              {t("register.email")}
            </label>
            <input
              type="email"
              className="w-full border border-gray-300  px-4 py-2"
              placeholder={t("register.email_placeholder")}
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.gender")}
                </label>
                <select
                  className="w-full border border-gray-300  px-4 py-2"
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value }))
                  }
                >
                  <option value="">{t("register.gender_placeholder")}</option>
                  <option value="male">{t("register.gender_male")}</option>
                  <option value="female">{t("register.gender_female")}</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.relationship")}
                </label>
                <select
                  className="w-full border border-gray-300  px-4 py-2"
                  value={form.relationship}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, relationship: e.target.value }))
                  }
                >
                  <option value="">
                    {t("register.relationship_placeholder")}
                  </option>
                  <option value="single">
                    {t("register.relationship_single")}
                  </option>
                  <option value="married">
                    {t("register.relationship_married")}
                  </option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.birthday_month")}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300  px-4 py-2"
                  placeholder={t("register.birthday_month_placeholder")}
                  value={form.birthdayMonth}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birthdayMonth: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium">
                  {t("register.birthday_day")}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300  px-4 py-2"
                  placeholder={t("register.birthday_day_placeholder")}
                  value={form.birthdayDay}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, birthdayDay: e.target.value }))
                  }
                />
              </div>
            </div>
            <label className="text-gray-700 font-medium">
              {t("register.account_type")}
            </label>
            <select
              className="w-full border border-gray-300  px-4 py-2"
              value={form.accountType}
              onChange={(e) =>
                setForm((f) => ({ ...f, accountType: e.target.value }))
              }
            >
              <option value="">{t("register.account_type_placeholder")}</option>
              <option value="person">
                {t("register.account_type_person")}
              </option>
              <option value="establishment">
                {t("register.account_type_establishment")}
              </option>
            </select>
            {form.accountType === "establishment" && (
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <label className="text-gray-700 font-medium">
                    {t("register.registration_number")}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2"
                    placeholder={t("register.registration_number_placeholder")}
                    value={form.registrationNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        registrationNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-700 font-medium">
                    {t("register.company_name")}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2"
                    placeholder={t("register.company_name_placeholder")}
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="mt-4 w-full py-3 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
              disabled={loading}
            >
              {loading ? "...جاري التسجيل" : t("register.create_button")}
            </button>
          </form>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
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
    </div>
  );
}
