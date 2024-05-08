import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useNavigate } from "react-router-dom";
import logo from "images/logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Login } from "services/LoginRepository";
import LoadingApiGif from "../../../images/loading-api.gif";
import Logo from "../../../images/ameinvoice.png";
import { useDispatch } from "react-redux";
import { loginSuccess } from "redux/actions/authActions";

export default () => {
  document.title = "Đăng nhập Admin";

  const navigate = useNavigate();
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [acessToken, setAcessToken] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();

  const initialState = {
      username: "",
      password: "",
      companyID: 0,
      Lag: "",
    },
    [formData, setFormData] = useState(initialState);

  sessionStorage.setItem("loggedInUsername", "");
  sessionStorage.setItem("accessToken", "");
  sessionStorage.setItem("lag", "");

  const validateAllHeritageInput = () => {
    //console.log(heritageData)
    const validationErrors = {};

    if (formData.username.trim() === "") {
      validationErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (formData.password.trim() === "") {
      validationErrors.password = "Vui lòng nhập mật khẩu";
    }

    if (formData.companyID === 0 || formData.companyID.trim() === "") {
      validationErrors.companyID = "Vui lòng nhập mã công ty";
    }

    if (formData.Lag.trim() === "") {
      validationErrors.Lag = "Vui lòng nhập ngôn ngữ";
    }

    setFormErrors(validationErrors);
    // Kiểm tra nếu có lỗi
    if (Object.keys(validationErrors).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    // Nếu không có lỗi mới xóa hoặc cập nhật
    if (validateAllHeritageInput() === false) {
      setShowLoading(true);
      Login(formData).then((data) => {
        console.log(data);

        if (data) {
          setAcessToken(data.access_token);
          sessionStorage.setItem("accessToken", data.access_token);

          setLoggedInUsername(formData.username);
          sessionStorage.setItem("loggedInUsername", formData.username);

          sessionStorage.setItem("lag", formData.Lag);

          dispatch(loginSuccess(data.access_token));

          setShowLoading(false);
          navigate("/dashboard");
        } else {
          setShowLoading(false);
          alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
      });
    }
  };

  return (
    <AnimationRevealPage>
      <div className="flex justify-center items-center h-screen w-full bg-[#f7f7f7]">
        <div className="container mx-auto">
          <div className="flex justify-center px-6 my-12">
            <div className="overflow-hidden rounded-lg w-full xl:w-3/4 lg:w-11/12 flex shadow-lg">
              <div
                className="relative w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover"
                style={{
                  backgroundImage:
                    "url('https://mir-s3-cdn-cf.behance.net/project_modules/fs/78c4af118001599.608076cf95739.jpg')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <img src={Logo} className="h-10 absolute bottom-4 left-4" />
              </div>
              <div className="w-full lg:w-1/2 bg-white p-5">
                <h3 className="pt-4 text-2xl font-bold text-center text-red-500">
                  ĐĂNG NHẬP
                </h3>
                <div className="px-8 pt-6 pb-8 bg-white rounded">
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-semibold text-gray-600"
                      for="username"
                    >
                      Tên đăng nhập
                    </label>
                    <input
                      className="text-black placeholder-gray-600 w-full px-4 py-2.5 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                      id="username"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          username: e.target.value,
                        }))
                      }
                    />
                    {formErrors.username && (
                      <p className="text-red-500 text-sm font-semibold mt-2">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faXmarkCircle}
                        />
                        {formErrors.username}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-semibold text-gray-600"
                      for="password"
                    >
                      Mật khẩu
                    </label>
                    <input
                      className="text-black placeholder-gray-600 w-full px-4 py-2.5 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          password: e.target.value,
                        }))
                      }
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm font-semibold mt-2">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faXmarkCircle}
                        />
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-semibold text-gray-600"
                      for="password"
                    >
                      ID Công ty
                    </label>
                    <input
                      className="text-black placeholder-gray-600 w-full px-4 py-2.5 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                      id="companyID"
                      type="number"
                      placeholder="Nhập id công ty"
                      value={formData.companyID}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          companyID: e.target.value,
                        }))
                      }
                    />
                    {formErrors.companyID && (
                      <p className="text-red-500 text-sm font-semibold mt-2">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faXmarkCircle}
                        />
                        {formErrors.companyID}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-semibold text-gray-600"
                      for="password"
                    >
                      Ngôn ngữ
                    </label>
                    <select
                      className="appearance-none text-black placeholder-gray-600 w-full px-4 py-2.5 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                      id="Lag"
                      value={formData.Lag}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          Lag: e.target.value,
                        }))
                      }
                    >
                      <option value="">--- Chọn ngôn ngữ ---</option>
                      <option value="VIET">VIET</option>
                      <option value="KOR">KOR</option>
                      <option value="ENG">ENG</option>
                    </select>
                    {formErrors.Lag && (
                      <p className="text-red-500 text-sm font-semibold mt-2">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faXmarkCircle}
                        />
                        {formErrors.Lag}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4 ">
                    <div className="text-sm ml-auto">
                      <a
                        href="#"
                        className="text-teal-500 font-semibold hover:text-teal-600"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <div className="mb-4 text-center">
                    <button
                      onClick={handleSubmit}
                      className="w-full flex justify-center px-4 font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-300 focus:outline-none focus:shadow-outline"
                    >
                      {showLoading ? (
                        <img src={LoadingApiGif} className="h-10" />
                      ) : (
                        <p className="py-2">Đăng nhập</p>
                      )}
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() =>
                        setFormData({
                          username: "admin",
                          password: "123456",
                          companyID: "1483",
                          Lag: "VIET",
                        })
                      }
                      className="w-full flex justify-center px-4 font-semibold text-white bg-gray-300 rounded-full hover:bg-gray-600 transition duration-300 focus:outline-none focus:shadow-outline"
                    >
                      <p className="py-2">Dùng tài khoản mặc định</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationRevealPage>
  );
};
