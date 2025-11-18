import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!userData) return null;

  const address = userData.address || { line1: "", line2: "" };

  const updateUserProfileData = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("address", JSON.stringify(address));
      formData.append("gender", userData.gender || "");
      formData.append("dob", userData.dob || "");

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // FIXED: avoid empty catch; move resets to finally
  const cancelEdit = async () => {
    try {
      await loadUserProfileData();
    } catch (err) {
      console.warn("Reload profile failed:", err);
    } finally {
      setIsEdit(false);
      setImage(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients inside */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              My Profile
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
              Manage your personal details and contact information.
            </p>
          </div>

          {/* Content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left: Profile card */}
            <div className="md:col-span-4">
              <div className="relative rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] overflow-hidden">
                {/* Top banner */}
                <div className="h-24 bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                {/* Avatar */}
                <div className="px-5 pb-5 -mt-12 flex flex-col items-center text-center">
                  {isEdit ? (
                    <label htmlFor="image" className="relative cursor-pointer">
                      <img
                        className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] opacity-90"
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="avatar"
                      />
                      {!image && (
                        <img
                          className="w-8 h-8 absolute bottom-0 right-0 translate-x-1 translate-y-1"
                          src={assets.upload_icon}
                          alt=""
                        />
                      )}
                      <input
                        onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                      />
                    </label>
                  ) : (
                    <img
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                      src={userData.image}
                      alt="avatar"
                    />
                  )}

                  {/* Name */}
                  {isEdit ? (
                    <input
                      className="mt-4 w-full max-w-[220px] text-center rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 text-lg font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#1177A6]"
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="mt-4 text-xl font-semibold text-slate-900">
                      {userData.name}
                    </p>
                  )}

                  {/* Email */}
                  <p className="mt-1 text-sm text-slate-600">{userData.email}</p>

                  {/* Action buttons (mobile placement) */}
                  <div className="mt-4 flex md:hidden gap-3">
                    {isEdit ? (
                      <>
                        <button
                          disabled={saving}
                          onClick={updateUserProfileData}
                          className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_8px_18px_rgba(59,130,246,0.35)] hover:brightness-105 disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-full px-5 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEdit(true)}
                        className="rounded-full px-5 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details cards */}
            <div className="md:col-span-8 space-y-6">
              {/* Contact information */}
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] p-5 md:p-6">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                  <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M6.6 10.8c1.6 3.1 4.1 5.6 7.2 7.2l2.4-2.4c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 4 .6.6 0 1 .4 1 1V22c0 .6-.4 1-1 1C10.4 23 1 13.6 1 2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1 0 1.4.2 2.8.6 4 .1.4 0 .8-.3 1.1L6.6 10.8Z" />
                    </svg>
                  </span>
                  Contact information
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {/* Email (read-only) */}
                  <div className="sm:col-span-1">
                    <p className="text-slate-500 mb-1">Email</p>
                    <p className="font-medium text-slate-900 break-words">
                      {userData.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-1">
                    <p className="text-slate-500 mb-1">Phone</p>
                    {isEdit ? (
                      <input
                        className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                        type="text"
                        value={userData.phone || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="font-medium text-slate-900">
                        {userData.phone || "-"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-3">
                    <p className="text-slate-500 mb-1">Address</p>
                    {isEdit ? (
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                          placeholder="Address line 1"
                          value={address.line1 || ""}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...(prev.address || {}), line1: e.target.value },
                            }))
                          }
                        />
                        <input
                          className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                          placeholder="Address line 2"
                          value={address.line2 || ""}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...(prev.address || {}), line2: e.target.value },
                            }))
                          }
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-slate-900 whitespace-pre-line">
                        {(address.line1 || "-") + (address.line2 ? `\n${address.line2}` : "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic information */}
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] p-5 md:p-6">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                  <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                  </span>
                  Basic information
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {/* Gender */}
                  <div>
                    <p className="text-slate-500 mb-1">Gender</p>
                    {isEdit ? (
                      <select
                        className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                        value={userData.gender || "Male"}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, gender: e.target.value }))
                        }
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="font-medium text-slate-900">
                        {userData.gender || "-"}
                      </p>
                    )}
                  </div>

                  {/* DOB */}
                  <div>
                    <p className="text-slate-500 mb-1">Birthday</p>
                    {isEdit ? (
                      <input
                        className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                        type="date"
                        value={userData.dob || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, dob: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="font-medium text-slate-900">
                        {userData.dob || "-"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center gap-3">
                {isEdit ? (
                  <>
                    <button
                      disabled={saving}
                      onClick={updateUserProfileData}
                      className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_12px_26px_rgba(59,130,246,0.35)] hover:brightness-105 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save information"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-full px-6 py-3 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="rounded-full px-6 py-3 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden mt-6 flex justify-center">
            {isEdit ? (
              <div className="flex gap-3">
                <button
                  disabled={saving}
                  onClick={updateUserProfileData}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_12px_26px_rgba(59,130,246,0.35)] hover:brightness-105 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded-full px-6 py-3 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;