"use client";
import { Header } from "@/components/layout/Header";
import { Icon } from "@/components/common/Icon";
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/common/AccountSidebar";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest, getAuthToken } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { useTranslation } from "react-i18next";

// API Response Type
interface ProfileApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  relationship_status: string;
  birth_month: string;
  birth_day: number;
  account_type: string;
  registration_number: string | null;
  company_name: string | null;
  registration_status: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const fetchProfile = async (): Promise<ProfileApiResponse> => {
  return authenticatedRequest<ProfileApiResponse>(
    "GET",
    "/api/store/auth/profile"
  );
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, token, setProfile, setToken } = useUserStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    relationshipStatus: "",
    birthMonth: "",
    birthDay: "",
    accountType: "",
    registrationNumber: "",
    companyName: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // جلب بيانات المستخدم من API
  const {
    data: profileFromApi,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!getAuthToken() && !profile, // Only fetch if no profile in store
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (profileFromApi) {
      setForm({
        firstName: profileFromApi.first_name || "",
        lastName: profileFromApi.last_name || "",
        email: profileFromApi.email || "",
        phone: profileFromApi.phone || "",
        gender: profileFromApi.gender || "",
        relationshipStatus: profileFromApi.relationship_status || "",
        birthMonth: profileFromApi.birth_month || "",
        birthDay: profileFromApi.birth_day?.toString() || "",
        accountType: profileFromApi.account_type || "",
        registrationNumber: profileFromApi.registration_number || "",
        companyName: profileFromApi.company_name || "",
      });
    }
  }, [profileFromApi]);

  // Initialize form immediately when component mounts
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        relationshipStatus: profile.relationshipStatus || "",
        birthMonth: profile.birthMonth || "",
        birthDay: profile.birthDay?.toString() || "",
        accountType: profile.accountType || "",
        registrationNumber: profile.registrationNumber || "",
        companyName: profile.companyName || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    setIsDirty(
      form.firstName !== (profile.firstName || "") ||
        form.lastName !== (profile.lastName || "") ||
        form.email !== (profile.email || "") ||
        form.phone !== (profile.phone || "") ||
        form.gender !== (profile.gender || "") ||
        form.relationshipStatus !== (profile.relationshipStatus || "") ||
        form.birthMonth !== (profile.birthMonth || "") ||
        form.birthDay !== (profile.birthDay?.toString() || "") ||
        form.accountType !== (profile.accountType || "") ||
        form.registrationNumber !== (profile.registrationNumber || "") ||
        form.companyName !== (profile.companyName || "")
    );
  }, [form, profile]);
  console.log("form", form, profile);

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("token");
      if (storedToken && setToken) setToken(storedToken);
    }
    if (!profile) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setProfile(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, [token, profile, setProfile, setToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Build query parameters for the new API
      const params = new URLSearchParams({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        relationship_status: form.relationshipStatus,
        birth_day: form.birthDay,
        birth_month: form.birthMonth,
        account_type: form.accountType,
        registration_number: form.registrationNumber,
        company_name: form.companyName,
      });

      // Send update request with query parameters
      const response = await fetch(
        `https://swag.ivadso.com/api/store/update_profile?${params}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data) {
        // Update profile in store
        const updatedProfile = {
          id: data.id || profile?.id,
          firstName: data.first_name || form.firstName,
          lastName: data.last_name || form.lastName,
          email: data.email || form.email,
          phone: data.phone || form.phone,
          gender: data.gender || form.gender,
          relationshipStatus:
            data.relationship_status || form.relationshipStatus,
          birthMonth: data.birth_month || form.birthMonth,
          birthDay: data.birth_day || parseInt(form.birthDay) || 0,
          accountType: data.account_type || form.accountType,
          registrationNumber:
            data.registration_number || form.registrationNumber,
          companyName: data.company_name || form.companyName,
          registrationStatus:
            data.registration_status || profile?.registrationStatus,
          emailVerifiedAt: data.email_verified_at || profile?.emailVerifiedAt,
          createdAt: data.created_at || profile?.createdAt,
          updatedAt: data.updated_at || profile?.updatedAt,
        };

        setProfile(updatedProfile);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsDirty(false);
      } else {
        console.error("Error updating profile:", data);
        // You can add error handling here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // You can add error handling here
    }
  };

  const handleSidebarMenuClick = (label: string) => {
    // Implement navigation logic here if needed
  };

  // Sidebar items
  const sidebar = [
    {
      icon: "user" as const,
      label: t("profile.sidebar.profile"),
      active: true,
    },
    { icon: "heart" as const, label: t("profile.sidebar.view_saved_products") },
    { icon: "briefcase" as const, label: t("profile.sidebar.orders") },
    // { icon: "home" as const, label: "Addresses" },
    // { icon: "shield" as const, label: "Change Password" },
    {
      icon: "log-out" as const,
      label: t("profile.sidebar.logout"),
      danger: true,
    },
  ];

  if (!token) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 py-20">
          {t("profile.login_required")}
        </div>
      </MainLayout>
    );
  }
  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-20">{t("profile.loading")}</div>
      </MainLayout>
    );
  }
  if (isError || !profile) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 py-20">
          {t("profile.error_loading")}
        </div>
      </MainLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-[#181e1e] font-sukar">
      <MainLayout>
        {showToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl flex justify-center pointer-events-none">
            <div className="flex items-center gap-4 bg-[#f6fbf4] border border-[#e0f3e0] rounded shadow-lg px-6 py-4 min-w-[400px] pointer-events-auto">
              <div className="bg-[#b6e7c9] rounded flex items-center justify-center w-12 h-12">
                <Icon name="checkCircle" size={28} className="text-green-600" />
              </div>
              <div>
                <div className="font-bold text-green-700 text-lg mb-0">
                  {t("profile.update_success_title")}
                </div>
                <div className="text-gray-700">
                  {t("profile.update_success_desc")}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10 flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar
            activeItem="Profile"
            onMenuClick={handleSidebarMenuClick}
          />
          {/* Profile Form */}
          <main className="flex-1 bg-white dark:bg-[#2c2c2c] rounded-none border  border-gray-200 dark:border-[#353535] p-8">
            <h1 className="text-2xl font-bold text-[#607A76] font-sukar">
              {t("profile.title")}
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              {t("profile.subtitle")}
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.first_name")}
                </label>
                <input
                  name="firstName"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.last_name")}
                </label>
                <input
                  name="lastName"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.email")}
                </label>
                <input
                  name="email"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.gender")}
                </label>
                <select
                  name="gender"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option>{t("profile.form.gender_male")}</option>
                  <option>{t("profile.form.gender_female")}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.relationship_status")}
                </label>
                <select
                  name="relationshipStatus"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.relationshipStatus}
                  onChange={handleChange}
                >
                  <option>{t("profile.form.relationship_single")}</option>
                  <option>{t("profile.form.relationship_married")}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.birthday")}
                </label>
                <div className="flex gap-2">
                  <select
                    name="birthMonth"
                    className="w-1/2 p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                    value={form.birthMonth}
                    onChange={handleChange}
                  >
                    <option>{t("profile.form.months.january")}</option>
                    <option>{t("profile.form.months.february")}</option>
                    <option>{t("profile.form.months.march")}</option>
                    <option>{t("profile.form.months.april")}</option>
                    <option>{t("profile.form.months.may")}</option>
                    <option>{t("profile.form.months.june")}</option>
                    <option>{t("profile.form.months.july")}</option>
                    <option>{t("profile.form.months.august")}</option>
                    <option>{t("profile.form.months.september")}</option>
                    <option>{t("profile.form.months.october")}</option>
                    <option>{t("profile.form.months.november")}</option>
                    <option>{t("profile.form.months.december")}</option>
                  </select>
                  <input
                    name="birthDay"
                    className="w-1/2 p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                    value={form.birthDay}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.account_type")}
                </label>
                <select
                  name="accountType"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.accountType}
                  onChange={handleChange}
                >
                  <option>{t("profile.form.account_establishment")}</option>
                  <option>{t("profile.form.account_individual")}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.registration_number")}
                </label>
                <input
                  name="registrationNumber"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.registrationNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  {t("profile.form.company_name")}
                </label>
                <input
                  name="companyName"
                  className="w-full p-3 border border-gray-200 dark:border-[#2c3531] rounded-none bg-white dark:bg-[#353535] text-gray-900 dark:text-white"
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  className="flex-1 h-12 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                  style={{ minWidth: "100%" }}
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  {t("profile.form.save")}
                </button>
              </div>
            </form>
          </main>
        </div>
        <ContactUsBannerSection />
      </MainLayout>
    </div>
  );
}
