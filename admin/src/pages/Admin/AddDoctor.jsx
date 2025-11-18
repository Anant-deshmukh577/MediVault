import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, SetDocImg] = useState(false);
  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [experience, SetExperience] = useState("1 Year");
  const [fees, SetFees] = useState("");
  const [about, SetAbout] = useState("");
  const [speciality, SetSpeciality] = useState("General physician");
  const [degree, SetDegree] = useState("");
  const [address1, SetAddress1] = useState("");
  const [address2, SetAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) return toast.error("Please upload a doctor picture.");
      setLoading(true);

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // reset form
        SetDocImg(false);
        SetName("");
        SetEmail("");
        SetPassword("");
        SetExperience("1 Year");
        SetFees("");
        SetAbout("");
        SetSpeciality("General physician");
        SetDegree("");
        SetAddress1("");
        SetAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 md:my-10">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <form
          onSubmit={onSubmitHandler}
          className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Add doctor
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create a new doctor profile to accept appointments.
            </p>
          </div>

          {/* Card with scroll area */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] px-6 sm:px-8 py-8 max-h-[78vh] overflow-y-auto">
            {/* Upload */}
            <div className="flex items-center gap-4 mb-8 text-slate-600">
              <label htmlFor="doc-img" className="relative cursor-pointer">
                <div className="relative size-20 sm:size-24 rounded-full ring-2 ring-white shadow-[0_10px_24px_rgba(0,0,0,0.20)] overflow-hidden bg-slate-100">
                  <img
                    className="h-full w-full object-cover"
                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                    alt="upload"
                  />
                </div>
                {!docImg && (
                  <span className="absolute inset-0 rounded-full pointer-events-none" />
                )}
              </label>
              <input
                onChange={(e) => e.target.files?.[0] && SetDocImg(e.target.files[0])}
                type="file"
                id="doc-img"
                accept="image/*"
                hidden
              />
              <div>
                <p className="font-medium text-slate-800">Upload doctor picture</p>
                <p className="text-xs text-slate-500">PNG or JPG, up to 5MB.</p>
              </div>
            </div>

            {/* Grid */}
            <div className="flex flex-col lg:flex-row items-start gap-8 text-slate-700">
              {/* Left column */}
              <div className="w-full lg:flex-1 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Doctor name</label>
                  <input
                    onChange={(e) => SetName(e.target.value)}
                    value={name}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="text"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Doctor email</label>
                  <input
                    onChange={(e) => SetEmail(e.target.value)}
                    value={email}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Password</label>
                  <input
                    onChange={(e) => SetPassword(e.target.value)}
                    value={password}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Experience</label>
                  <select
                    onChange={(e) => SetExperience(e.target.value)}
                    value={experience}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i + 1} value={`${i + 1} Year`}>
                        {i + 1} Year
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Fees</label>
                  <input
                    onChange={(e) => SetFees(e.target.value)}
                    value={fees}
                    min="0"
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="number"
                    placeholder="Fees"
                    required
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="w-full lg:flex-1 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Speciality</label>
                  <select
                    onChange={(e) => SetSpeciality(e.target.value)}
                    value={speciality}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                  >
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Education</label>
                  <input
                    onChange={(e) => SetDegree(e.target.value)}
                    value={degree}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="text"
                    placeholder="e.g. MBBS, MD"
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Address</label>
                  <input
                    onChange={(e) => SetAddress1(e.target.value)}
                    value={address1}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6] mb-2"
                    type="text"
                    placeholder="Address line 1"
                    required
                  />
                  <input
                    onChange={(e) => SetAddress2(e.target.value)}
                    value={address2}
                    className="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                    type="text"
                    placeholder="Address line 2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-6">
              <label className="text-xs text-slate-500">About doctor</label>
              <textarea
                onChange={(e) => SetAbout(e.target.value)}
                value={about}
                className="mt-1 w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1177A6]"
                placeholder="Write about the doctor…"
                rows={5}
                required
              />
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_12px_26px_rgba(59,130,246,0.35),0_4px_12px_rgba(0,0,0,0.18)] hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Adding…" : "Add doctor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddDoctor;