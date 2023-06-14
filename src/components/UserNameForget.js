import React from "react";
import { Link } from "react-router-dom";
import DoWellVerticalLogo from "../assets/images/Dowell-logo-Vertical.jpeg";

const UserNameForget = () => {
  return (
    <div>
      <div className="flex relative flex-col md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
        <div className="py-8 md:col-span-2 space-y-8 my-10">
          <div className="flex items-center justify-center space-x-2 px-2 sm:px-0">
            <img
              src={DoWellVerticalLogo}
              alt="DoWell logo"
              className="h-36 w-44"
            />
            <h3 className="text-lg uppercase md:text-xl text-center font-bold leading-6 text-gray-900">
              Forget Username
            </h3>
          </div>

          <form>
            <div className="overflow-hidden drop-shadow-2xl sm:rounded-2xl bg-amber-100">
              <div className="px-4 py-2 sm:p-6 space-y-4">
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    for="name"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email-address"
                    placeholder="Sender Email"
                    id="email-address"
                    autoComplete="email"
                    className="form-input"
                  />
                </div>

                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    for="name"
                  >
                    Enter OTP from email
                  </label>
                  <input
                    type="text"
                    name="email-address"
                    placeholder="Receiver Email"
                    id="email-address"
                    autoComplete="email"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="px-4 py-2 text-center md:text-left sm:px-6">
                <button type="submit" className="btn-send">
                  Verify
                </button>
              </div>

              <div className="text-gray-500 space-x-2 py-2 px-6 text-right">
                Do have an account?
                <Link to="/signin">
                  <span className="text-gray-800"> Log in</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserNameForget;
