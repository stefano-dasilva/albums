import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import { BiShow, BiHide } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setUserID } from "../../../features/UserSlice";
// @ts-ignore
import image from "../../../assets/vector.jpg"
// @ts-ignore
import flat from "../../../assets/flat.png";

interface InputValues {
  username: string;
  password: string;
}
const Login = () => {

  const dispatch = useDispatch()
  const [inputValues, setInputValues] = useState<InputValues>({
    username: "",
    password: "",
  });
  const navigate = useNavigate()
  const [error, setError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const user_error = "user does not exists";
  const pass_error = "password does not match";

  const handleChange = (field : keyof InputValues, value : string) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log(showPassword);
  }, [showPassword]);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const FetchLoginAPI = async (event : React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username: inputValues.username,
        password: inputValues.password,
      });
      dispatch(setUserID(response.data.userID));
      window.localStorage.setItem("username", response.data.username);
      navigate("/home")
    } catch (err : any) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="wrapper">
      <div className="left-side">
        <form className="form-login" onSubmit={FetchLoginAPI}>
          <h1 className="title">Accedi</h1>
          <div className="form-content-layout">
            <div className="name-pass">
              <label
                htmlFor="username_login"
                style={{ color: "white", width: "100%" }}
              >
                username
                <br />
                <input
                  type="text"
                  id="username_login"
                  name="username_login"
                  value={inputValues.username}
                  style={{
                    border: "2px solid rgb(56, 56, 56)",
                    borderRadius: "0.5rem",
                    width: "100%",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
                <h6 className={error === user_error ? "error" : "hidden"}>
                  {error}
                </h6>
              </label>
              <label
                htmlFor="pass1"
                style={{ color: "white", width: "100%", marginTop: "1rem" }}
              >
                password
                <br />
                <div className="password">
                  <input
                    type={showPassword === false ? "password" : "text"}
                    id="password"
                    name="password"
                    value={inputValues.password}
                    style={{
                      width: "100%",
                      color: "white",
                    }}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  <BiShow
                    className={showPassword === false ? "" : "hidden"}
                    onClick={handleToggle}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <BiHide
                    className={showPassword === true ? "" : "hidden"}
                    onClick={handleToggle}
                    style={{ marginRight: "0.5rem" }}
                  />
                </div>
                <h6 className={error === pass_error ? "error" : "hidden"}>
                  {error}
                </h6>
              </label>
            </div>

            <div className="button-wrapper">
              <button type="submit" className="submit-login">
                Login
              </button>
              <h5>
                Non hai un'account?
                <Link to="/register">
                  <span style={{ color: "#4c68d7" }}>
                    &nbsp;&nbsp; Iscriviti!
                  </span>
                </Link>
              </h5>
            </div>
          </div>
        </form>
      </div>
      <div className="right-side-login">
        <div className="img-wrapper-login">
          <img src={flat} className="image-login" alt="vector" />
        </div>
      </div>
    </div>
  );
};

export default Login;
