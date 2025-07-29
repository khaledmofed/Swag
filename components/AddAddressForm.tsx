"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddAddressFormProps {
  onSubmit: (addressData: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function AddAddressForm({
  onSubmit,
  onCancel,
  isLoading,
}: AddAddressFormProps) {
  const [formData, setFormData] = useState({
    address: "",
    postal_code: "",
    city: "",
    country: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4 font-sukar text-md">
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
          <p className="text-red-500 text-md mt-1">{errors.postal_code}</p>
        )}
      </div>
      <div>
        <Label htmlFor="city" className="text-[#607A76]">
          City *
        </Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-[#607A76] hover:bg-[#4a5d5a] text-white rounded-none text-md font-sukar"
        >
          {isLoading ? "Adding..." : "Add Address"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-gray-200 dark:border-[#353535] rounded-none text-md text-[#607A76]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
