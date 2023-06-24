import React from "react";
import { Link } from "react-router-dom";
import DoWellVerticalLogo from "../assets/images/Dowell-logo-Vertical.jpeg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../redux/authSlice";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  otp: yup.string().required("OTP is required"),
});

const ForgotUsername = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  // const { usernameList, loading, error } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(verifyOTP({ email: data.email, otp: data.otp }));
  };

  return (
    <div>
      <div className="flex relative flex-col md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
        <div className="py-8 md:col-span-2 space-y-8 my-10">
          <div className="flex items-center justify-center space-x-2 px-2 sm:px-0">
            <img
              src={DoWellVerticalLogo}
              alt="DoWell logo"
              className="h-28 w-34 rounded-full drop-shadow-sm"
            />
            <h3 className="text-lg uppercase md:text-xl text-center font-bold leading-6 text-green-600">
              Forget Username
            </h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="overflow-hidden drop-shadow-2xl sm:rounded-2xl bg-yellow-50">
              <div className="px-4 py-2 sm:p-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-green-700"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className={`input-field ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="flex flex-row space-x-3 items-center">
                    <button
                      className="btn-send px-2 py-1 self-start"
                      type="submit"
                    >
                      Get OTP
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold leading-6 text-green-700"
                  >
                    Enter OTP from email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      autoComplete="otp"
                      className="input-field"
                      {...register("otp")}
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.otp.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2 text-center md:text-left sm:px-6">
                  <button type="submit" className="btn-send">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* {usernameList.length > 0 && (
            <div>
              <p>Your username/s:</p>
              <ul>
                {usernameList.map((username) => (
                  <li key={username}>{username}</li>
                ))}
              </ul>
            </div>
          )} */}
          <div className="text-gray-500 space-x-2 py-4 px-6 text-right">
            Do you have an account?{" "}
            <Link to="/signin">
              <span className="text-green-600">Log in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotUsername;
