import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { assetUrl } from "../utils/assets";
import "./Profile.css";

export default function Profile() {
  const fileRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    bio: "",
    profileImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [generatingBio, setGeneratingBio] = useState(false);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/user");

        if (!data) return;

        setUser({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "JOB_SEEKER",
          skills: data.skills || "",
          bio: data.bio || "",
          profileImageUrl: data.profileImageUrl || "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Could not load profile data.");
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, []);

  /* =====================================================
     UPDATE NAVBAR / OTHER COMPONENTS
  ===================================================== */

  const notifyProfileChange = (nextUser) => {
    localStorage.setItem("userName", nextUser.name || "User");

    if (nextUser.profileImageUrl) {
      localStorage.setItem(
          "profileImageUrl",
          nextUser.profileImageUrl
      );
    } else {
      localStorage.removeItem("profileImageUrl");
    }

    window.dispatchEvent(
        new CustomEvent("hireflow-profile-updated", {
          detail: nextUser,
        })
    );
  };

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user.name.trim()) {
      toast.warn("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.put(
          "/auth/profile",
          {
            name: user.name.trim(),
            skills: user.skills.trim(),
            bio: user.bio.trim(),
          }
      );

      const nextUser = {
        ...user,
        ...data,
        password: undefined,
      };

      setUser(nextUser);
      notifyProfileChange(nextUser);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
          error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     PROFILE IMAGE
  ===================================================== */

  const handleImageUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
          "Please choose a JPG, PNG, WEBP or GIF image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
          "Profile image must be 5 MB or smaller."
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const { data } = await axiosInstance.post(
          "/files/profile-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );

      const nextUser = {
        ...user,
        profileImageUrl: data.url,
      };

      setUser(nextUser);
      notifyProfileChange(nextUser);

      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
          error.response?.data?.message ||
          "Could not upload profile photo"
      );
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  /* =====================================================
     AI BIO
  ===================================================== */

  const handleAiBioEnhance = async () => {
    if (!user.name.trim()) {
      toast.warn("Add your name first.");
      return;
    }

    if (!user.skills.trim()) {
      toast.warn("Add your skills first.");
      return;
    }

    setGeneratingBio(true);

    const toastId = toast.loading(
        "HireFlow AI is improving your bio..."
    );

    try {
      const { data } = await axiosInstance.post(
          "/ai/generate-bio",
          {
            name: user.name,
            bio: user.bio,
            skills: user.skills,
          }
      );

      setUser((previous) => ({
        ...previous,
        bio: data.bio || previous.bio,
      }));

      toast.update(toastId, {
        render: "Professional bio generated",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });
    } catch (error) {
      console.error("AI bio error:", error);

      toast.update(toastId, {
        render:
            error.response?.data?.message ||
            "AI service is currently unavailable",
        type: "error",
        isLoading: false,
        autoClose: 3500,
      });
    } finally {
      setGeneratingBio(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (fetching) {
    return (
        <DashboardLayout>
          <div className="profile-loading">
            <div
                className="spinner-border text-primary"
                role="status"
            >
            <span className="visually-hidden">
              Loading profile...
            </span>
            </div>

            <p>Loading your profile...</p>
          </div>
        </DashboardLayout>
    );
  }

  /* =====================================================
     DERIVED VALUES
  ===================================================== */

  const skills = user.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

  const completeness = Math.min(
      100,
      35 +
      (user.name ? 15 : 0) +
      (user.bio ? 20 : 0) +
      Math.min(skills.length * 6, 30)
  );

  const initial = (user.name || "U")
      .charAt(0)
      .toUpperCase();

  const formattedRole = (
      user.role || "JOB_SEEKER"
  ).replaceAll("_", " ");

  /* =====================================================
     JSX
  ===================================================== */

  return (
      <DashboardLayout>
        <main className="profile-page">
          {/* =================================================
            PAGE HEADER
        ================================================= */}

          <header className="profile-page-header">
            <div className="profile-page-title">
            <span className="profile-eyebrow">
              Professional identity
            </span>

              <h1>My Profile</h1>

              <p>
                Manage your professional identity and keep
                your HireFlow profile up to date.
              </p>
            </div>

            <div className="profile-header-status">
              <div className="profile-header-percentage">
                {completeness}%
              </div>

              <div className="profile-header-status-text">
                <strong>Profile complete</strong>

                <span>
                Complete your profile for better matching
              </span>
              </div>
            </div>
          </header>

          {/* =================================================
            WORKSPACE
        ================================================= */}

          <div className="row g-4 profile-workspace">
            {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

            <div className="col-xl-4 col-lg-5 profile-sidebar-column">
              <aside className="profile-card profile-card-sticky">
                {/* Avatar */}

                <div className="profile-avatar-section">
                  <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                      {user.profileImageUrl ? (
                          <img
                              src={assetUrl(
                                  user.profileImageUrl
                              )}
                              alt={
                                user.name
                                    ? `${user.name} profile`
                                    : "Profile"
                              }
                          />
                      ) : (
                          <span>{initial}</span>
                      )}
                    </div>

                    <button
                        type="button"
                        className="profile-camera-button"
                        disabled={uploading}
                        onClick={() =>
                            fileRef.current?.click()
                        }
                        aria-label="Change profile picture"
                        title="Change profile picture"
                    >
                      {uploading ? (
                          <span className="spinner-border spinner-border-sm" />
                      ) : (
                          <i className="bi bi-camera-fill" />
                      )}
                    </button>
                  </div>

                  <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="d-none"
                      onChange={(e) =>
                          handleImageUpload(
                              e.target.files?.[0]
                          )
                      }
                  />
                </div>

                {/* Identity */}

                <div className="profile-identity">
                  <h2>
                    {user.name || "Your name"}
                  </h2>

                  <div className="profile-email">
                  <span className="profile-email-icon">
                    <i className="bi bi-envelope" />
                  </span>

                    <span className="profile-email-text">
                    {user.email}
                  </span>
                  </div>

                  <span className="profile-role-badge">
                  <i className="bi bi-patch-check-fill" />

                    {formattedRole}
                </span>
                </div>

                <div className="profile-card-divider" />

                {/* Profile strength */}

                <div className="profile-strength">
                  <div className="profile-strength-heading">
                    <div>
                      <strong>Profile strength</strong>

                      <p>
                        Keep improving your professional
                        profile
                      </p>
                    </div>

                    <span>{completeness}%</span>
                  </div>

                  <div
                      className="profile-strength-track"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={completeness}
                  >
                    <div
                        className="profile-strength-progress"
                        style={{
                          width: `${completeness}%`,
                        }}
                    />
                  </div>
                </div>

                {/* Upload */}

                <div className="profile-upload-area">
                  <button
                      type="button"
                      className="profile-change-photo-button"
                      disabled={uploading}
                      onClick={() =>
                          fileRef.current?.click()
                      }
                  >
                    {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" />
                          Uploading...
                        </>
                    ) : (
                        <>
                          <i className="bi bi-image" />
                          Change profile photo
                        </>
                    )}
                  </button>

                  <p>
                    JPG, PNG, WEBP or GIF
                    <span>•</span>
                    Maximum 5 MB
                  </p>
                </div>
              </aside>
            </div>

            {/* =================================================
              RIGHT PROFILE EDITOR
          ================================================= */}

            <div className="col-xl-8 col-lg-7 profile-editor-column">
              <section className="profile-editor-card profile-editor-scroll">
                {/* Editor header */}

                <div className="profile-editor-header">
                  <div>
                  <span className="profile-eyebrow">
                    Profile details
                  </span>

                    <h2>About you</h2>

                    <p>
                      Information shown in your HireFlow
                      profile.
                    </p>
                  </div>

                  <div className="profile-editor-header-icon">
                    <i className="bi bi-person-lines-fill" />
                  </div>
                </div>

                {/* Form */}

                <form
                    className="profile-form"
                    onSubmit={handleUpdate}
                >
                  <div className="row g-4">
                    {/* Full name */}

                    <div className="col-md-6">
                      <label
                          htmlFor="profileFullName"
                          className="profile-form-label"
                      >
                        Full name
                      </label>

                      <div className="profile-field-control">
                      <span
                          className="profile-field-icon"
                          aria-hidden="true"
                      >
                        <i className="bi bi-person" />
                      </span>

                        <input
                            id="profileFullName"
                            type="text"
                            className="form-control profile-control-with-icon"
                            value={user.name}
                            onChange={(e) =>
                                setUser((previous) => ({
                                  ...previous,
                                  name: e.target.value,
                                }))
                            }
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                      </div>
                    </div>

                    {/* Email */}

                    <div className="col-md-6">
                      <label
                          htmlFor="profileEmail"
                          className="profile-form-label"
                      >
                        Email address
                      </label>

                      <div className="profile-field-control">
                      <span
                          className="profile-field-icon"
                          aria-hidden="true"
                      >
                        <i className="bi bi-envelope" />
                      </span>

                        <input
                            id="profileEmail"
                            type="email"
                            className="form-control profile-control-with-icon profile-readonly-input"
                            value={user.email}
                            readOnly
                        />
                      </div>
                    </div>

                    {/* Bio */}

                    <div className="col-12">
                      <div className="profile-field-header">
                        <label
                            htmlFor="profileBio"
                            className="profile-form-label mb-0"
                        >
                          Professional bio
                        </label>

                        <button
                            type="button"
                            className="profile-ai-button"
                            disabled={generatingBio}
                            onClick={
                              handleAiBioEnhance
                            }
                        >
                          {generatingBio ? (
                              <>
                                <span className="spinner-border spinner-border-sm" />
                                Improving...
                              </>
                          ) : (
                              <>
                                <i className="bi bi-stars" />
                                Improve with AI
                              </>
                          )}
                        </button>
                      </div>

                      <div className="profile-textarea-wrapper">
                      <textarea
                          id="profileBio"
                          className="form-control profile-bio-textarea"
                          rows="7"
                          value={user.bio}
                          maxLength={1000}
                          onChange={(e) =>
                              setUser((previous) => ({
                                ...previous,
                                bio: e.target.value,
                              }))
                          }
                          placeholder="Tell recruiters about your experience, strengths, achievements and career goals..."
                      />

                        <span className="profile-character-count">
                        {user.bio.length}/1000
                      </span>
                      </div>
                    </div>

                    {/* Skills */}

                    <div className="col-12">
                      <label
                          htmlFor="profileSkills"
                          className="profile-form-label"
                      >
                        Skills
                      </label>

                      <div className="profile-field-control">
                      <span
                          className="profile-field-icon"
                          aria-hidden="true"
                      >
                        <i className="bi bi-code-slash" />
                      </span>

                        <input
                            id="profileSkills"
                            type="text"
                            className="form-control profile-control-with-icon"
                            value={user.skills}
                            onChange={(e) =>
                                setUser((previous) => ({
                                  ...previous,
                                  skills: e.target.value,
                                }))
                            }
                            placeholder="Java, Spring Boot, React, MySQL"
                        />
                      </div>

                      <p className="profile-helper-text">
                        <i className="bi bi-info-circle" />

                        Separate skills with commas.
                        HireFlow uses your skills for job
                        matching and recommendations.
                      </p>
                    </div>

                    {/* Skills preview */}

                    {skills.length > 0 && (
                        <div className="col-12">
                          <div className="profile-skills-container">
                        <span className="profile-skills-label">
                          Your skills
                        </span>

                            <div className="profile-skills-list">
                              {skills.map(
                                  (skill, index) => (
                                      <span
                                          key={`${skill}-${index}`}
                                          className="profile-skill-chip"
                                      >
                                {skill}
                              </span>
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Account information */}

                    <div className="col-12">
                      <div className="profile-account-info">
                        <div className="profile-account-info-icon">
                          <i className="bi bi-shield-check" />
                        </div>

                        <div>
                          <strong>
                            Account information
                          </strong>

                          <p>
                            Your email address and account
                            role cannot be changed from this
                            profile page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}

                  <div className="profile-form-footer">
                    <p>
                      <i className="bi bi-lock" />
                      Your information is securely stored
                      with your HireFlow account.
                    </p>

                    <button
                        type="submit"
                        className="profile-save-button"
                        disabled={loading}
                    >
                      {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />
                            Saving...
                          </>
                      ) : (
                          <>
                            <i className="bi bi-check2-circle" />
                            Save changes
                          </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </main>
      </DashboardLayout>
  );
}