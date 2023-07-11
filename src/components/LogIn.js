import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/loginSlice";
import { getOperatingSystem, getDeviceType } from "../utils/deviceUtils";
import Coordinate from "../utils/Coordinate";
import { detectBrowser } from "../utils/browserUtils";
import DoWellVerticalLogo from "../assets/images/Dowell-logo-Vertical.jpeg";
import { Radio } from "react-loader-spinner";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("User Name is required")
    .max(20)
    .notOneOf(
      ["administrator", "uxlivinglab", "dowellresearch", "dowellteam", "admin"],
      "Username not allowed"
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 digit"
    ),
});

const LogIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.login) || {};

  // Retrieves the current local time in the user's browser
  const currentTime = new Date().toLocaleTimeString();
  // Operating System
  const operatingSystem = getOperatingSystem();
  // Device Type
  const device = getDeviceType();
  // Retrieves the user's location in latitude and longitude format
  const location = Coordinate();
  // Retrieves the user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Retrieves the user's preferred language
  const userLanguage = navigator.language;
  // Use the detectBrowser
  const browserType = detectBrowser();

  const handleUserInfo = async ({ username, password }) => {
    const userData = {
      username,
      password,
      time: currentTime,
      ip: "",
      os: operatingSystem,
      device: device,
      location: location,
      timezone: userTimezone,
      language: userLanguage,
      browser: browserType,
    };
    await dispatch(loginUser(userData));
  };

  return (
    <>
      <div className="antialiased bg-gray-100">
        <div className="flex w-full min-h-screen items-center justify-center">
          <div className="flex flex-col justify-between md:flex-row md:space-x-6 space-y-6 md:space-y-0 bg-gray-50 w-full max-w-3xl p-8 md:p-10 rounded-xl shadow-lg text-gray-500 overflow-hidden">
            <div className="flex flex-col space-y-8">
              <div className="flex items-center mx-auto max-w-2xl justify-center space-x-2 px-2 sm:px-0">
                <img
                  src={DoWellVerticalLogo}
                  alt="DoWell logo"
                  className="h-28 w-38 rounded-full drop-shadow-sm"
                />
                <h2 className="text-2xl font-bold tracking-tight text-green-600 md:text-3xl">
                  Member Login
                </h2>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="pt-2 text-gray-500 text-base">
                  Don't remember username and password?
                </p>
                <Link to="/password">
                  <span className="text-green-600 text-center">Click here</span>
                </Link>
              </div>

              <div className="flex text-gray-500 text-base space-x-2">
                <p>Don't have an account?</p>
                <Link to="/signup">
                  <span className="text-green-600">Sign up</span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gray-50 rounded-2xl drop-shadow-md p-8 text-gray-700 md:w-80">
                <form
                  className="flex flex-col space-y-4"
                  onSubmit={handleSubmit(handleUserInfo)}
                >
                  <div>
                    <label htmlFor="username" className="label">
                      User Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className={`input-field ${
                          errors.username ? "border-red-500" : ""
                        }`}
                        {...register("username")}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="label">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="password"
                        className={`input-field ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="btn-send px-1 py-1 mt-2 self-start">
                    <button
                      type="submit"
                      className="btn-send px-2 py-1 self-start"
                      disabled={loading}
                    >
                      {loading ? (
                        <Radio
                          visible={true}
                          height={30}
                          width={30}
                          ariaLabel="radio-loading"
                          wrapperStyle={{}}
                          wrapperClassName="radio-wrapper"
                          color="#1ff507"
                        />
                      ) : (
                        "Login"
                      )}
                    </button>
                    {error && <p>{error}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
