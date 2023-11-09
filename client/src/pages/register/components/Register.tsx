import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Register.css";
// @ts-ignore
import image from "../../../assets/vector.jpg";
//@ts-ignore
import flat from "../../../assets/flat.png";
import  { handle_regex } from "../../../utils/regex.js"
import { useNavigate } from "react-router-dom";
import { setUserID } from "../../../features/UserSlice";
import { useAppDispatch } from "../../../app/hooks";



interface InputValues {
  username: string;
  password1: string;
  password2: string;
  email: string;
}

const Register = () => {
  const [inputValues, setInputValues] = useState<InputValues>({
    username: "",
    password1: "",
    password2: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const not_matching = "password don't match";

  const FetchLoginAPI = async (event: React.FormEvent) => {
    event.preventDefault();

    const return_value = handle_regex(inputValues.username, inputValues.email)

    if(return_value?.value === true){
      try {
        const response = await axios.post("http://localhost:3001/auth/register", {
          username: inputValues.username,
          password: inputValues.password1,
          email: inputValues.email,
        });
              dispatch(setUserID(response.data.userID));

        window.localStorage.setItem("username", response.data.username);
        navigate("/home");
      } catch (err) {
        console.log(err);
      }
    }
    else {
      setError(return_value?.message)
    }
  };

  

 useEffect(()=>{

  if (inputValues.password1 && inputValues.password2) {
    if (inputValues.password1 !== inputValues.password2) {
      setError("password don't match");
    } else {
      setError("");
    }
  } else setError("");

 },[inputValues.password2])

  const handleChange = (field: keyof InputValues, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className="wrapper">
      <div className="left-side">
        <form className="form-register" onSubmit={FetchLoginAPI}>
          <h1 className="title-register">Register</h1>
          <div className="register-layout">
            <div className="input_values_form">
              <label
                htmlFor="username"
                style={{
                  color: "white",
                  width: "100%",
                }}
              >
                username
                <br />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={inputValues.username}
                  style={{
                    border: "2px solid rgb(56, 56, 56)",
                    color: "white",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </label>
              <label htmlFor="pass1" style={{ color: "white", width: "100%" }}>
                password
                <br />
                <input
                  style={{
                    border: "2px solid rgb(56, 56, 56)",
                    color: "white",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  type="password"
                  id="password1"
                  name="password1"
                  value={inputValues.password1}
                  onChange={(e) => handleChange("password1", e.target.value)}
                />
              </label>
              <label htmlFor="pass2" style={{ color: "white", width: "100%" }}>
                ripeti password
                <br />
                <input
                  style={{
                    border: "2px solid rgb(56, 56, 56)",
                    color: "white",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  type="password"
                  id="password2"
                  name="password2"
                  value={inputValues.password2}
                  onChange={(e) => handleChange("password2", e.target.value)}
                />
                <h6 className={error === not_matching ? "" : "hidden"}>
                  password doesn't match
                </h6>
              </label>
              <label htmlFor="email" style={{ color: "white", width: "100%" }}>
                email
                <br />
                <input
                  style={{
                    border: "2px solid rgb(56, 56, 56)",
                    color: "white",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  type="email"
                  id="email"
                  name="email"
                  value={inputValues.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </label>
            </div>
            <button type="submit" className="submit-register">
              Register
            </button>
            <h6>{error}</h6>
          </div>
        </form>
      </div>
      <div className="right-side">
        <div className="img-wrapper">
          <img src={flat} className="image" alt="vector" />
        </div>
      </div>
    </div>
  );
};

export default Register;
