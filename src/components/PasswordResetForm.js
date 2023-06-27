import React from "react";
import { Link } from "react-router-dom";
import DoWellVerticalLogo from "../assets/images/Dowell-logo-Vertical.jpeg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, sendOTP } from "../redux/passwordSlice";
import { Radio } from "react-loader-spinner";

const PasswordResetForm = () => {
  const schema = yup.object().shape({
    username: yup
      .string()
      .required("User Name is required")
      .max(20)
      .notOneOf(
        [
          "administrator",
          "uxlivinglab",
          "dowellresearch",
          "dowellteam",
          "admin",
        ],
        "Username not allowed"
      ),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    otp: yup.string().when("otpSent", {
      is: true,
      then: yup.string().required("OTP is required"),
    }),
    new_password: yup.string().when("otpSent", {
      is: true,
      then: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(99)
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit"
        ),
    }),
    confirm_password: yup.string().when("otpSent", {
      is: true,
      then: yup
        .string()
        .oneOf([yup.ref("new_password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  const { passwordReset, loading, error, otpSent } = useSelector(
    (state) => state.password
  );

  const handleSendOTP = ({ username, email }) => {
    dispatch(sendOTP({ username, email }));
  };

  const handleResetPassword = (data) => {
    const { username, email, otp, new_password, confirm_password } = data;
    if (otp && new_password && confirm_password) {
      dispatch(
        resetPassword({ username, email, otp, new_password, confirm_password })
      );
    }
  };

  return (
    <div className="flex relative flex-col md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
      <div className="py-8 md:col-span-2 space-y-4 my-10">
        <div className="flex items-center justify-center space-x-2 px-2 sm:px-0">
          <img
            src={DoWellVerticalLogo}
            alt="DoWell logo"
            className="h-28 w-34 rounded-full drop-shadow-sm"
          />
          <h3 className="text-lg uppercase md:text-xl text-center font-bold leading-6 text-green-600">
            Forget Password
          </h3>
        </div>

        <div className="flex text-gray-600 space-x-2 py-2 px-2 text-left">
          <p>Do you forget username?</p>
          <Link to="/username">
            <span className="text-green-600">Click here</span>
          </Link>
        </div>

        <div className="overflow-hidden drop-shadow-2xl sm:rounded-2xl bg-yellow-50">
          <div className="px-4 py-2 sm:p-6 space-y-4">
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold leading-6 text-green-700"
                >
                  User Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="input-field"
                    {...register("username")}
                  />
                  {errors?.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.username?.message}
                    </p>
                  )}
                </div>
              </div>

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
                    className="input-field"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="mt-2.5">
                  <div className="flex flex-row space-x-3 items-center">
                    <button
                      className="btn-send px-2 py-1 self-start"
                      onClick={handleSubmit(handleSendOTP)}
                      disabled={loading}
                    >
                      {loading ? (
                        <Radio
                          visible={true}
                          height={50}
                          width={50}
                          ariaLabel="radio-loading"
                          wrapperStyle={{}}
                          wrapperClassName="radio-wrapper"
                          color="#4fa94d"
                        />
                      ) : (
                        "Get OTP"
                      )}
                    </button>
                    <p className="text-base font-normal text-green-600">
                      {otpSent}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold leading-6 text-green-700"
                  htmlFor="otp"
                >
                  Enter OTP from Email
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  autoComplete="otp"
                  className="input-field"
                  {...register("otp", { required: otpSent })}
                />
                {errors?.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="new_password"
                  className="block text-sm font-semibold leading-6 text-green-700"
                >
                  New Password
                </label>
                <div className="mt-2.5">
                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    autoComplete="new_password"
                    className="input-field"
                    {...register("new_password", { required: otpSent })}
                  />
                  {errors?.new_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-semibold leading-6 text-green-700"
                >
                  Confirm Password
                </label>
                <div className="mt-2.5">
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    autoComplete="confirm_password"
                    className="input-field"
                    {...register("confirm_password", { required: otpSent })}
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="btn-send px-1 py-1 mt-2 self-start">
                <button type="submit" className="btn-send" disabled={loading}>
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </div>
              <p className="text-base font-normal text-green-600">
                {passwordReset}
              </p>

              {error && <p>{error}</p>}
            </form>
          </div>
        </div>

        <div className="text-gray-500 space-x-2 py-4 px-6 text-right">
          Do have an account?
          <Link to="/signin">
            <span className="text-green-600"> Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
