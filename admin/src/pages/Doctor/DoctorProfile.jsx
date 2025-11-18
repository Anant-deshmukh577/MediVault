import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateProfile = async () => {
    try {
      setSaving(true);
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = async () => {
    // reload to discard local changes
    try {
      await getProfileData();
    } finally {
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  if (!profileData) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 md:my-10">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              My profile
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your clinic availability and appointment fees.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Profile card with gradient banner + avatar */}
            <div className="md:col-span-4">
              <div className="relative rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                <div className="px-5 pb-6 -mt-12 flex flex-col items-center text-center">
                  <img
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                    src={profileData.image}
                    alt="doctor"
                  />
                  <p className="mt-3 text-xl font-semibold text-slate-900">
                    {profileData.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {profileData.degree} • {profileData.speciality}
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-slate-200 bg-white text-slate-700">
                    {profileData.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Details card */}
            <div className="md:col-span-8">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] p-5 md:p-6">
                {/* About */}
                <div>
                  <p className="text-sm font-medium text-slate-800">About</p>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    {profileData.about}
                  </p>
                </div>

                {/* Fees */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-800">Appointment fee</p>
                  <div className="mt-1 flex items-center gap-2 text-slate-700">
                    <span className="text-slate-900 font-semibold">{currency}</span>
                    {isEdit ? (
                      <input
                        type="number"
                        min="0"
                        className="w-32 rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                        value={profileData.fees}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            fees: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <span className="text-slate-900 font-semibold">{profileData.fees}</span>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-800">Clinic address</p>
                  <div className="mt-1 grid grid-cols-1 gap-2 text-sm">
                    {isEdit ? (
                      <>
                        <input
                          type="text"
                          className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                          placeholder="Address line 1"
                          value={profileData.address?.line1 || ""}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                        />
                        <input
                          type="text"
                          className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1177A6]"
                          placeholder="Address line 2"
                          value={profileData.address?.line2 || ""}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                        />
                      </>
                    ) : (
                      <p className="text-slate-700 whitespace-pre-line">
                        {profileData.address?.line1}
                        {profileData.address?.line2 ? `\n${profileData.address.line2}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-800">Availability</p>
                  <label className="mt-1 inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={profileData.available}
                      disabled={!isEdit}
                      onChange={() =>
                        isEdit &&
                        setProfileData((prev) => ({
                          ...prev,
                          available: !prev.available,
                        }))
                      }
                    />
                    <span
                      className="
                        relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300
                        peer-checked:bg-emerald-500 transition-colors
                        peer-disabled:opacity-60
                      "
                    >
                      <span
                        className="
                          absolute left-1 h-4 w-4 rounded-full bg-white shadow
                          transition-transform peer-checked:translate-x-5
                        "
                      />
                    </span>
                    <span className="text-sm text-slate-700">
                      {profileData.available ? "Open for booking" : "Closed"}
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  {isEdit ? (
                    <>
                      <button
                        onClick={updateProfile}
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_12px_26px_rgba(59,130,246,0.35)] hover:brightness-105 disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save changes"}
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
                      Edit profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
};

export default DoctorProfile;