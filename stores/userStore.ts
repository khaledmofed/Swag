import { create } from "zustand";
import axios from "axios";

const BASE_URL = "https://swag.ivadso.com";

// API Response Types
interface ApiUser {
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
  token?: string; // Optional token in user object
}

interface ApiResponse {
  status: boolean;
  msg: string;
  errNum: string;
  token?: string; // Optional token at root level
  data?: {
    user: ApiUser;
    token?: string; // Optional token in data
    access_token?: string; // Optional access_token
  };
}

// Frontend User Profile Type
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  relationshipStatus: string;
  birthMonth: string;
  birthDay: number;
  accountType: string;
  registrationNumber: string | null;
  companyName: string | null;
  registrationStatus: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  isRegistered: boolean;
  sendOtp: (phone: string) => Promise<ApiResponse>;
  verifyOtp: (phone: string, otp: string) => Promise<ApiResponse>;
  completeRegistration: (
    data: Partial<UserProfile> & { email: string }
  ) => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (fields: Partial<UserProfile>) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadProfileFromAPI: () => Promise<void>;
  // Helper function to convert API user to frontend profile
  convertApiUserToProfile: (apiUser: ApiUser) => UserProfile;
}

// Helper function to convert API user data to frontend profile
const convertApiUserToProfile = (apiUser: ApiUser): UserProfile => ({
  id: apiUser.id,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  email: apiUser.email,
  phone: apiUser.phone,
  gender: apiUser.gender,
  relationshipStatus: apiUser.relationship_status,
  birthMonth: apiUser.birth_month,
  birthDay: apiUser.birth_day,
  accountType: apiUser.account_type,
  registrationNumber: apiUser.registration_number,
  companyName: apiUser.company_name,
  registrationStatus: apiUser.registration_status,
  emailVerifiedAt: apiUser.email_verified_at,
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
});

export const useUserStore = create<UserStore>((set, get) => {
  // Initialize from localStorage
  let initialToken = null;
  let initialProfile = null;

  if (typeof window !== "undefined") {
    initialToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    console.log("UserStore - Initial token from localStorage:", initialToken);
    console.log("UserStore - Initial user from localStorage:", storedUser);

    if (storedUser) {
      try {
        initialProfile = JSON.parse(storedUser);
        console.log("UserStore - Parsed initial profile:", initialProfile);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }

  return {
    profile: initialProfile,
    token: initialToken,
    loading: false,
    error: null,
    otpSent: false,
    isRegistered: !!initialProfile,

    sendOtp: async (phone) => {
      set({ loading: true, error: null });
      try {
        const language =
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[1] === "ar"
              ? "ar"
              : "en"
            : "en";

        const headers = {
          Accept: "application/json",
          "Accept-Language": language,
        };

        console.log("Sending OTP with headers:", headers);

        const res = await axios.post(
          `${BASE_URL}/api/store/auth/send-otp`,
          null,
          {
            params: { phone },
            headers,
          }
        );
        set({ otpSent: true, loading: false });
        return res.data;
      } catch (error: any) {
        const errorMsg = error?.response?.data?.msg || "خطأ في إرسال OTP";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    verifyOtp: async (phone, otp) => {
      set({ loading: true, error: null });
      try {
        const language =
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[1] === "ar"
              ? "ar"
              : "en"
            : "en";

        const headers = {
          Accept: "application/json",
          "Accept-Language": language,
        };

        console.log("Verifying OTP with headers:", headers);

        const res = await axios.post(
          `${BASE_URL}/api/store/auth/verify-otp`,
          null,
          {
            params: { phone, otp },
            headers,
          }
        );

        const responseData = res.data as ApiResponse;
        console.log("OTP Verification Response:", responseData);
        console.log(
          "Full response data:",
          JSON.stringify(responseData, null, 2)
        );

        if (responseData.status && responseData.data) {
          // Check different possible token locations
          let token = null;

          // Try different possible token locations
          if (responseData.data.token) {
            token = responseData.data.token;
          } else if (responseData.data.user?.token) {
            token = responseData.data.user.token;
          } else if (responseData.token) {
            token = responseData.token;
          } else if (responseData.data.access_token) {
            token = responseData.data.access_token;
          }

          console.log("Extracted token:", token);
          console.log("Token type:", typeof token);

          if (!token) {
            console.error("No token found in response:", responseData);
            throw new Error("Token not found in API response");
          }

          // Store token
          console.log("Storing token:", token);
          localStorage.setItem("token", token);

          // Convert and store user profile
          const userProfile = convertApiUserToProfile(responseData.data.user);
          console.log("Storing user profile:", userProfile);
          localStorage.setItem("user", JSON.stringify(userProfile));

          // Update store state immediately
          set({
            token,
            profile: userProfile,
            isRegistered: true,
            loading: false,
            error: null,
          });

          // Verify the state was updated
          console.log("UserStore state after update:", get());

          // Dispatch custom event to notify other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("user-logged-in", {
                detail: { token, profile: userProfile },
              })
            );
          }
        } else {
          console.error("Invalid response structure:", responseData);
          throw new Error("Invalid API response structure");
        }

        return responseData;
      } catch (error: any) {
        const errorMsg = error?.response?.data?.msg || "خطأ في التحقق من OTP";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    completeRegistration: async (data) => {
      set({ loading: true, error: null });
      try {
        const token = get().token;
        const language =
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[1] === "ar"
              ? "ar"
              : "en"
            : "en";

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Accept-Language": language,
        };

        console.log("Completing registration with headers:", headers);

        const res = await axios.post(
          `${BASE_URL}/api/store/auth/complete-registration`,
          null,
          {
            params: data,
            headers,
          }
        );

        if (res.data?.data?.user) {
          const userProfile = convertApiUserToProfile(res.data.data.user);
          localStorage.setItem("user", JSON.stringify(userProfile));
          set({ profile: userProfile, isRegistered: true, loading: false });

          // Dispatch custom event to notify other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("user-logged-in", {
                detail: { profile: userProfile },
              })
            );
          }
        }
      } catch (e: any) {
        const errorMsg = e?.response?.data?.msg || "خطأ في إكمال التسجيل";
        set({ error: errorMsg, loading: false });
        throw e;
      }
    },

    setProfile: (profile) => {
      localStorage.setItem("user", JSON.stringify(profile));
      set({ profile });

      // Dispatch custom event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-logged-in", {
            detail: { profile },
          })
        );
      }
    },

    updateProfile: (fields) =>
      set((state) => {
        const current = state.profile ?? {
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          relationshipStatus: "",
          birthMonth: "",
          birthDay: 0,
          accountType: "",
          registrationNumber: null,
          companyName: null,
          registrationStatus: false,
          emailVerifiedAt: null,
          createdAt: "",
          updatedAt: "",
        };
        const updatedProfile = { ...current, ...fields };
        localStorage.setItem("user", JSON.stringify(updatedProfile));

        // Dispatch custom event to notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("user-logged-in", {
              detail: { profile: updatedProfile },
            })
          );
        }

        return { profile: updatedProfile };
      }),

    setToken: (token) => {
      console.log("UserStore - setToken called with:", token);
      console.log("UserStore - Token type:", typeof token);

      if (token) {
        localStorage.setItem("token", token);
        console.log(
          "UserStore - Token stored in localStorage:",
          localStorage.getItem("token")
        );
      } else {
        console.warn("UserStore - Attempting to store null/undefined token");
      }

      set({ token });

      // Dispatch custom event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-logged-in", {
            detail: { token },
          })
        );
      }
    },

    logout: () => {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("favorites");

      // Clear sessionStorage if any
      sessionStorage.clear();

      // Clear all cookies related to authentication
      if (typeof document !== "undefined") {
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }

      // Reset store state
      set({
        profile: null,
        token: null,
        isRegistered: false,
        otpSent: false,
        loading: false,
        error: null,
      });

      // Dispatch custom event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("user-logged-out"));
      }
    },

    loadProfileFromAPI: async () => {
      const token = get().token;
      if (!token) {
        return;
      }

      set({ loading: true, error: null });
      try {
        const language =
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[1] === "ar"
              ? "ar"
              : "en"
            : "en";

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Accept-Language": language,
        };

        console.log("Loading profile from API with headers:", headers);

        const res = await axios.get(`${BASE_URL}/api/store/auth/profile`, {
          headers,
        });

        const responseData = res.data as ApiResponse;
        console.log("Profile Load Response:", responseData);

        if (responseData.status && responseData.data?.user) {
          const userProfile = convertApiUserToProfile(responseData.data.user);
          localStorage.setItem("user", JSON.stringify(userProfile));
          set({ profile: userProfile, isRegistered: true, loading: false });

          // Dispatch custom event to notify other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("user-logged-in", {
                detail: { profile: userProfile },
              })
            );
          }
        } else {
          set({ profile: null, isRegistered: false, loading: false });
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.msg || "خطأ في تحميل الملف الشخصي";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    convertApiUserToProfile,
  };
});
