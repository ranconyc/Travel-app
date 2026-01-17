"use client";

import { useState } from "react";
import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/domain/user/user.actions";

export const DeleteAccountSection = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Block className="border-red-100 bg-red-50">
      <Title icon={<Trash2 size={22} className="text-red-500" />}>
        <span className="text-red-500">Danger Zone</span>
      </Title>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </Block>
  );
};
