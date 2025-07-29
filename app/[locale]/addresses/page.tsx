"use client";
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/common/AccountSidebar";
import { Icon } from "@/components/common/Icon";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BASE_URL = "https://swag.ivadso.com";
const EMPTY_IMAGE = "/images/empty-favorites.png";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

const fetchAddresses = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/api/store/my_addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const addAddress = async ({
  token,
  addressData,
}: {
  token: string;
  addressData: any;
}) => {
  const res = await axios.post(
    `${BASE_URL}/api/store/add_address`,
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

const editAddress = async ({
  token,
  id,
  addressData,
}: {
  token: string;
  id: number;
  addressData: any;
}) => {
  const res = await axios.post(
    `${BASE_URL}/api/store/edit_address/${id}`,
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

const deleteAddress = async ({ token, id }: { token: string; id: number }) => {
  const res = await axios.post(
    `${BASE_URL}/api/store/delete_address/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

export default function AddressesPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    postal_code: "",
    city: "",
    country: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // جلب العناوين من API
  const {
    data: addressesData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["addresses", token],
    queryFn: () => fetchAddresses(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  // Mutations
  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsAddDialogOpen(false);
      setFormData({
        address: "",
        postal_code: "",
        city: "",
        country: "",
        phone: "",
      });
      setErrors({});
      setToastMessage({
        type: "success",
        message: "Address added successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error adding address:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to add address",
      });
      setToastMessage({
        type: "error",
        message: error.response?.data?.message || "Failed to add address",
      });
    },
  });

  const editAddressMutation = useMutation({
    mutationFn: editAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsEditDialogOpen(false);
      setSelectedAddress(null);
      setFormData({
        address: "",
        postal_code: "",
        city: "",
        country: "",
        phone: "",
      });
      setErrors({});
      setToastMessage({
        type: "success",
        message: "Address updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error editing address:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to edit address",
      });
      setToastMessage({
        type: "error",
        message: error.response?.data?.message || "Failed to edit address",
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (data) => {
      // Check the response status
      if (data.status === false) {
        // Handle specific error cases
        if (data.errNum === "404" && data.msg === "Orders already placed") {
          setToastMessage({
            type: "error",
            message:
              "Cannot delete address: Orders already placed with this address",
          });
        } else {
          setToastMessage({
            type: "error",
            message: data.msg || "Failed to delete address",
          });
        }
        setIsDeleteDialogOpen(false);
        setAddressToDelete(null);
        return;
      }

      // Success case
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
      setToastMessage({
        type: "success",
        message: "Address deleted successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting address:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to delete address",
      });
      setToastMessage({
        type: "error",
        message: error.response?.data?.message || "Failed to delete address",
      });
    },
  });

  // استخراج العناوين من الاستجابة الصحيحة
  const addresses = addressesData?.data?.addresses || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    if (validateForm()) {
      addAddressMutation.mutate({ token: token!, addressData: formData });
    }
  };

  const handleEditAddress = () => {
    if (validateForm() && selectedAddress) {
      editAddressMutation.mutate({
        token: token!,
        id: selectedAddress.id,
        addressData: formData,
      });
    }
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate({ token: token!, id: addressToDelete.id });
    }
  };

  const openEditDialog = (address: any) => {
    setSelectedAddress(address);
    setFormData({
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
      country: address.country,
      phone: address.phone,
    });
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (address: any) => {
    setAddressToDelete(address);
    setErrors({});
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      address: "",
      postal_code: "",
      city: "",
      country: "",
      phone: "",
    });
    setErrors({});
  };

  // Auto-hide toast after 5 seconds
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-[#181e1e] font-sukar">
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10 flex flex-col md:flex-row gap-8">
          <AccountSidebar
            activeItem="Addresses"
            onMenuClick={(label) => {
              if (label === "Profile") router.push("/profile");
              else if (label === "View Saved Products")
                router.push("/saved-products");
              else if (label === "Orders") router.push("/orders");
              else if (label === "Addresses") router.push("/addresses");
            }}
          />
          <main className="flex-1 bg-white dark:bg-[#2c2c2c] rounded-none border border-gray-200 dark:border-[#353535] p-8">
            {!token ? (
              <div className="text-center text-red-600 py-20">
                يجب تسجيل الدخول لعرض العناوين
              </div>
            ) : isLoading ? (
              <div className="text-center py-20">جاري تحميل العناوين...</div>
            ) : isError ? (
              <div className="text-center text-red-600 py-20">
                حدث خطأ أثناء جلب العناوين
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#607A76] font-sukar">
                    My Addresses
                  </h2>
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(true);
                    }}
                    className="bg-[#607A76] hover:bg-[#4a5d5a] text-md rounded-none text-white font-sukar"
                  >
                    <Icon name="plus" size={16} className="mr-1" />
                    Add New Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
                    <div className="flex-2 flex flex-col items-start justify-center">
                      <h1
                        className="text-3xl md:text-4xl font-sukar font-bold mb-4"
                        style={{ lineHeight: "30px" }}
                      >
                        No Addresses Yet – Add Your First Address!
                      </h1>
                      <p
                        className="text-lg font-sukar text-[#607A76] font-semibold mb-6"
                        style={{ lineHeight: "22px" }}
                      >
                        You haven't added any addresses yet. Add your first
                        address to make shopping easier.
                      </p>
                      <Button
                        onClick={() => {
                          resetForm();
                          setIsAddDialogOpen(true);
                        }}
                        className="bg-[#607A76] hover:bg-[#4a5d5a] text-white font-sukar"
                      >
                        Add First Address
                      </Button>
                    </div>
                    <div className="flex-2 flex items-center justify-end">
                      <img
                        src={EMPTY_IMAGE}
                        alt="Empty addresses"
                        className="w-100 select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-none border border-gray-100 dark:border-[#353535] bg-[#f9f9fa] dark:bg-[#232b2b]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-[#353535]">
                      <thead className="bg-[#f5f8f7] dark:bg-[#232b2b]">
                        <tr>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            Address
                          </th>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            City
                          </th>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            Country
                          </th>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-md font-bold text-[#607A76]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {addresses.map((address: any, idx: number) => (
                          <tr
                            key={address.id}
                            className="hover:bg-gray-50 dark:hover:bg-[#232b2b]"
                          >
                            <td className="px-4 py-3 text-[#607A76] font-bold">
                              {address.id}
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-bold text-gray-800 dark:text-white">
                                  {address.address}
                                </div>
                                <div className=" text-md">
                                  Postal Code: {address.postal_code}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-800 dark:text-white">
                              {address.city}
                            </td>
                            <td className="px-4 py-3 text-gray-800 dark:text-white">
                              {address.country}
                            </td>
                            <td className="px-4 py-3 text-gray-800 dark:text-white">
                              {address.phone}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditDialog(address)}
                                  className="hover:bg-gray-200 dark:hover:bg-[#353535] p-2 rounded-none"
                                  title="Edit"
                                >
                                  <Icon name="edit" size={18} />
                                </button>
                                <button
                                  onClick={() => openDeleteDialog(address)}
                                  className="hover:bg-red-100 dark:hover:bg-red-900 p-2 rounded-none text-red-600"
                                  title="Delete"
                                >
                                  <Icon name="trash" size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </MainLayout>

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border border-gray-200 rounded-none dark:border-[#353535]">
          <DialogHeader>
            <DialogTitle className="text-[#607A76] font-sukar">
              Add New Address
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-sukar text-md ">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded">
                {errors.general}
              </div>
            )}
            <div>
              <Label htmlFor="address" className="text-[#607A76]">
                Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter your address"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-md mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postal_code" className="text-[#607A76]">
                Postal Code *
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                placeholder="Enter postal code"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.postal_code ? "border-red-500" : ""
                }`}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-md mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city" className="text-[#607A76]">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Enter city"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.city ? "border-red-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-md mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country" className="text-[#607A76]">
                Country *
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Enter country"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.country ? "border-red-500" : ""
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-md mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#607A76]">
                Phone *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-md mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddAddress}
                disabled={addAddressMutation.isPending}
                className="flex-1 bg-[#607A76] hover:bg-[#4a5d5a] text-white rounded-none text-md font-sukar"
              >
                {addAddressMutation.isPending ? "Adding..." : "Add Address"}
              </Button>
              <Button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                variant="outline"
                className="flex-1 border-gray-200 dark:border-[#353535] rounded-none text-md  text-[#607A76]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#353535]">
          <DialogHeader>
            <DialogTitle className="text-[#607A76] font-sukar">
              Edit Address
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-sukar text-md">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded">
                {errors.general}
              </div>
            )}
            <div>
              <Label htmlFor="edit-address" className="text-[#607A76]">
                Address *
              </Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter your address"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-md mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-postal_code" className="text-[#607A76]">
                Postal Code *
              </Label>
              <Input
                id="edit-postal_code"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                placeholder="Enter postal code"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.postal_code ? "border-red-500" : ""
                }`}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-md mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-city" className="text-[#607A76]">
                City *
              </Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Enter city"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.city ? "border-red-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-md mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-country" className="text-[#607A76]">
                Country *
              </Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Enter country"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.country ? "border-red-500" : ""
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-md mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-phone" className="text-[#607A76]">
                Phone *
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className={`border-gray-200 dark:border-[#353535] ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-md mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleEditAddress}
                disabled={editAddressMutation.isPending}
                className="flex-1 bg-[#607A76] hover:bg-[#4a5d5a] text-white rounded-none text-md font-sukar"
              >
                {editAddressMutation.isPending
                  ? "Updating..."
                  : "Update Address"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
                variant="outline"
                className="flex-1 border-gray-200 dark:border-[#353535] rounded-none text-md text-[#607A76]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#353535]">
          <DialogHeader>
            <DialogTitle className="text-[#607A76] font-sukar">
              Delete Address
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded">
                {errors.general}
              </div>
            )}
            <p className="text-lg font-sukar">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            {addressToDelete && (
              <div className="bg-gray-50 dark:bg-[#232b2b] p-4 rounded">
                <p className="font-bold text-[#607A76]">
                  {addressToDelete.address}
                </p>
                <p className="text-md text-gray-600 dark:text-gray-300">
                  {addressToDelete.city}, {addressToDelete.country}
                </p>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleDeleteAddress}
                disabled={deleteAddressMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none text-md font-sukar"
              >
                {deleteAddressMutation.isPending
                  ? "Deleting..."
                  : "Delete Address"}
              </Button>
              <Button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setAddressToDelete(null);
                }}
                variant="outline"
                className="flex-1 border-gray-200 dark:border-[#353535] rounded-none text-md font-sukar text-[#607A76]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Message */}
      {toastMessage && (
        <div
          className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 shadow-lg font-sukar rounded-md transition-all duration-300 ease-in-out min-w-[340px] ${
            toastMessage.type === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div
            className={`rounded-md p-2 flex items-center justify-center ${
              toastMessage.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {toastMessage.type === "success" ? (
              <svg width="32" height="32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#D1FADF" />
                <path
                  d="M10 17l4 4 8-8"
                  stroke="#12B76A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="32" height="32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#FEE2E2" />
                <path
                  d="M16 8v8M16 24h.01"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div>
            <div
              className={`font-bold mb-0 ${
                toastMessage.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {toastMessage.type === "success" ? "Success" : "Error"}
            </div>
            <div className="text-gray-800">{toastMessage.message}</div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
