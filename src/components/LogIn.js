import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/loginSlice";
import { getOperatingSystem, getDeviceType } from "../utils/deviceUtils";
import Coordinate from "../utils/Coordinate";
import { detectBrowser } from "../utils/browserUtils";
import { Radio } from "react-loader-spinner";
import LanguageDropdown from "./LanguageDropdown";
import { useParams } from "react-router-dom";

const LogIn = () => {
  const [userLanguage, setUserLanguage] = useState("en");
  // Get the mainParams directly using useParams
  const { mainParams } = useParams();
  const navigate = useNavigate();

  const { userInfo, loading, error } =
    useSelector((state) => state.login) || {};
  const dispatch = useDispatch();

  const Time = new Date();
  const formatTime = Time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const currentTime = formatTime;

  const operatingSystem = getOperatingSystem();
  const device = getDeviceType();
  const userTimezone = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace(/\//g, "");
  const browserType = detectBrowser();

  // Append query parameters to the URL
  const appendQueryParameters = (baseUrl, queryParams) => {
    const url = new URL(baseUrl);
    const urlParams = new URLSearchParams(queryParams);
    url.search = urlParams.toString();
    return url.toString();
  };

  // Handle user information
  const handleUserInfo = async (e) => {
    e.preventDefault();

    const { username, password } = e.target.elements;

    const locationValue = await Coordinate().catch((error) => {
      console.log(error.message);
      return "";
    });

    const userData = {
      username: username.value,
      password: password.value,
      time: currentTime,
      ip: "",
      os: operatingSystem,
      device,
      timezone: userTimezone,
      language: userLanguage,
      browser: browserType,
      location: locationValue,
      random_session: mainParams || "",
    };

    try {
      const response = await dispatch(loginUser(userData));
      const session_id = response?.payload?.session_id;

      // Update the sessionID in the userData object
      userData.random_session = session_id;

      if (session_id) {
        // Set the base URL for redirection
        const baseUrl = "https://100093.pythonanywhere.com/home";

        // Destructure the userData object to get individual properties
        const {
          username,
          time,
          ip,
          os,
          device,
          timezone,
          language,
          browser,
          location,
          random_session,
        } = userData;

        // Redirect to the desired page with query parameters
        const queryParams = {
          username,
          time,
          ip,
          os,
          device,
          timezone,
          language,
          browser,
          location,
          random_session,
        };

        // redirect to the desired URL
        const redirectURL = appendQueryParameters(baseUrl, queryParams);
        navigate(redirectURL);
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      console.log("Error while logging in:", error.message);
    }
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    setUserLanguage(language);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col justify-between md:flex-row md:space-x-4 space-y-2 md:space-y-0 bg-yellow-50 w-full max-w-3xl p-4 md:p-6 rounded-xl shadow-lg text-gray-500 overflow-hidden">
        <div className="flex flex-col space-y-8 bg-gradient-to-r from-yellow-50 to-gray-50">
          <h2 className="text-2xl bg-green-600 bg-clip-text text-transparent">
            Member Login
          </h2>

          <div className="flex flex-col space-y-2">
            <p className=" text-gray-500 text-base">
              Don't remember username and password?
            </p>
            <Link to="/password">
              <span className="text-green-500 text-base">Click here</span>
            </Link>
          </div>

          <div className="text-gray-500 text-base">
            <p>Don't have an account?</p>
            <Link to="/signup">
              <span className="text-green-500 text-base">Sign up</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 bg-yellow-50 rounded-2xl drop-shadow-md p-6 text-gray-700 w-80 space-y-2">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="label">Select your language</p>
              <LanguageDropdown
                selectedLanguage={userLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            <form className="flex flex-col space-y-4" onSubmit={handleUserInfo}>
              <div>
                <label htmlFor="username" className="label">
                  User Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter Your Username"
                    autoComplete="username"
                    className="input-field"
                  />
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
                    placeholder="Enter Your Password"
                    autoComplete="password"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" className="submit-btn" disabled={loading}>
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
                {userInfo && (
                  <p className="text-green-500 font-base">
                    {userInfo?.username}
                  </p>
                )}

                {error && <p>{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
