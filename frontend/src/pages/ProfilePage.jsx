import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Create image element to resize
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
      // Create canvas to resize image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set maximum dimensions
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;
  
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
  
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
  
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
  
      // Convert to base64
      const resizedImage = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
  
      // Clear object URL
      URL.revokeObjectURL(img.src);
  
      // Update state and upload
      setSelectedImage(resizedImage);
      await updateProfile({ profilePic: resizedImage });
    };
  };
  return (
    <div className="h-full pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="font-semibold text-2xl">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                alt="profile"
                className="rounded-full object-cover border-4 size-32"
                src={selectedImage || authUser.profilePic || "/avatar.png"}
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2
                   rounded-full cursor-pointer transition-all duration-200
                   ${
                     isUpdatingProfile
                       ? "animate-pulse pointer-events-none"
                       : ""
                   }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  className="hidden"
                  id="avatar-upload"
                  accept="image/*"
                  disabled={isUpdatingProfile}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading"
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          {/* details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 gap-2 flex items-center">
                <User className="size-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 gap-2 flex items-center">
                <Mail className="size-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
          {/* active */}
          <div className="mt-6 bg-base-300 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center py-2 justify-between">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
