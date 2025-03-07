import React, { useState } from "react";
import "react-phone-number-input/style.css";

const PhoneInputField = ({
  type,
  onChange,
  placeholder = "Enter phone number",
  register = () => {},
  errors,
  name,
  validationRules = {},
  touchedInput = false,
  required = false,
}) => {
  const [touched, setTouched] = useState(touchedInput); // Track if input is touched

  const fieldError = name
    ?.split(".")
    .reduce((acc, part) => acc?.[part], errors);

  // Trigger validation on blur
  const handleBlur = () => {
    setTouched(true); // Set touched state to true on blur
  };

  return (
    <div className="input-container">
      <div className="input-title-container">
        <label className="input-title">
          {required ? "Phone number *" : "Phone number"}{" "}
        </label>
      </div>
      <div>
        <div className="phone-number-input-container flex items-center">
          <div
            className={`input-cont-color-cls phone-number-input-cls flex items-center border text-[12px] h-[35px] min-w-max px-[5px] rounded-l ${
              required && fieldError ? "input-error-cls" : ""
            }`}
          >
            <img
              src="/assets/images/indiaFlag.png"
              alt="Indian Flag"
              className="w-6 h-4 mr-1"
            />
            <span className="mt-[3px]">+91</span>
          </div>
          <div style={{ width: "100%" }}>
            <input
              className={`tel-input-field input-cont-color-cls w-full py-[10px] px-[5px] h-[35px] rounded-r border font-semibold text-[12px] focus:outline-none ${
                required && fieldError ? "input-error-cls" : ""
              }`}
              type={type}
              name={name}
              maxLength="10"
              placeholder={placeholder}
              onChange={onChange}
              onInput={(e) => {
                // Prevent non-numeric characters
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              {...register(name, { ...validationRules, onBlur: handleBlur })} // Register + custom onBlur
            />
          </div>
        </div>
        <div className="h-4" style={{ minHeight: "16px" }}>
          {fieldError &&
            touched && ( // Show error only if touched and error exists
              <p className="input-error text-red-600">{fieldError.message}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default PhoneInputField;
