import React, { useEffect, useState, useRef, createRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
  faCircleInfo,
  faCircleNotch,
  faCirclePlus,
  faMinus,
  faPenToSquare,
  faPencil,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AddOrUpdateText } from "../../../components/utils/Utils";
import { isEmptyOrSpaces } from "../../../components/utils/Utils";
import { generateSlug } from "../../../components/utils/Utils";

import { getHeritageById } from "services/HeritageRepository";
import { getHeritageTypes } from "services/HeritageTypeRepository";
import { getLocations } from "../../../services/LocationRepository";
import { getManagementUnits } from "../../../services/ManagementUnitRepository";
import { addHeritage } from "../../../services/HeritageRepository";
import { putHeritage } from "../../../services/HeritageRepository";
import NotificationModal from "../../../components/admin/modal/NotificationModal";

import DefaultImage from "images/post-default-full.png";
import { getHeritageCategories } from "../../../services/HeritageCategoryRepository";
import { getHeritageWithDetailById } from "../../../services/HeritageRepository";
import { addHeritageWithParagraphs } from "../../../services/HeritageRepository";
import { putHeritageWithParagraphs } from "../../../services/HeritageRepository";
import { splitImageUrls } from "../../../components/utils/Utils";
import {
  addMaterialCode,
  getSelectTypeMaterialCode,
  updateMaterialCode,
} from "services/MaterialCodeRepository";
import { getAllBank } from "services/BankRepository";
import { useSelector } from "react-redux";

export default ({ type = "" }) => {
  document.title = "Thêm/Cập nhật mã nhóm vật tư";

  let mainText = AddOrUpdateText(type, "mã nhóm vật tư");

  let storedEditItem = null;

  let { id } = useParams();
  id = id ?? 0;

  let maintAction = "";
  if (id === 0) {
    maintAction = "thêm";
    sessionStorage.removeItem("editItem");
  } else {
    maintAction = "cập nhật";
    storedEditItem = JSON.parse(sessionStorage.getItem("editItem"));
  }

  const initialState = {
      Lag: sessionStorage.getItem("lag"),
      // ----------------------------
      PRODUCTKIND_CD: storedEditItem?.PRODUCTKIND_CD || "",
      PRODUCTKIND_NM: storedEditItem?.PRODUCTKIND_NM || "",
      PRODUCTKIND_NM_ENG: storedEditItem?.PRODUCTKIND_NM_ENG || "",
      PRODUCTKIND_NM_KOR: storedEditItem?.PRODUCTKIND_NM_KOR || "",
      REMARK: storedEditItem?.REMARK || "",
    },
    [materialCode, setMaterialCode] = useState(initialState);

  const [successFlag, SetSuccessFlag] = useState(false);
  const [materialCodeErrors, setMaterialCodeErrors] = useState({});
  const [messageAPI, setMessageAPI] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    document.title = "Thêm/ cập nhật mã nhóm vật tư";

    if (id !== 0) {
    }
  }, []);

  //validate lỗi bổ trống
  const validateAllMaterialCodeInput = () => {
    //console.log(heritageData)
    const validationErrors = {};

    if (materialCode.PRODUCTKIND_NM.trim() === "") {
      validationErrors.PRODUCTKIND_NM =
        "Vui lòng nhập tên nhóm vật tư (tiếng Việt)";
    }

    if (materialCode.PRODUCTKIND_NM_ENG.trim() === "") {
      validationErrors.PRODUCTKIND_NM_ENG =
        "Vui lòng nhập tên nhóm vật tư (tiếng Anh)";
    }

    if (materialCode.PRODUCTKIND_NM_KOR.trim() === "") {
      validationErrors.PRODUCTKIND_NM_KOR =
        "Vui lòng nhập tên nhóm vật tư (tiếng Hàn)";
    }

    setMaterialCodeErrors(validationErrors);
    // Kiểm tra nếu có lỗi
    if (Object.keys(validationErrors).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    materialCode.Lag = sessionStorage.getItem("lag");
    console.log(materialCode);

    setMessageAPI("");
    setShowLoading(true);

    // Nếu không có lỗi mới xóa hoặc cập nhật
    if (validateAllMaterialCodeInput() === false) {
      if (id === 0) {
        addMaterialCode(materialCode).then((data) => {
          // SetSuccessFlag(true);
          if (data.status === "success") {
            SetSuccessFlag(true);
            setMessageAPI(data.messages[0]);
            setShowLoading(false);
            // console.log(data.result);
          } else if (data.status === "error") {
            SetSuccessFlag(false);
            setMessageAPI(data.messages[0]);
            setShowLoading(false);
          }
        });
      } else {
        updateMaterialCode(materialCode).then((data) => {
          // SetSuccessFlag(true);
          if (data.status === "success") {
            SetSuccessFlag(true);
            setMessageAPI(data.messages[0]);
            setShowLoading(false);
            // console.log(data.result);
          } else if (data.status === "error") {
            SetSuccessFlag(false);
            setMessageAPI(data.messages[0]);
            setShowLoading(false);
          }
        });
      }
    } else {
      setMessageAPI("Vui lòng kiểm tra lại các ô nhập liệu");
      setShowLoading(false);
    }
  };

  //Xử lý khi bấm xóa bên component con NotificationModal
  const childToParent = (isContinue) => {
    if (isContinue === true && id === 0) {
      setMaterialCode(initialState);
      // Reset flag sau khi thêm thành công
      setTimeout(() => {
        SetSuccessFlag(false);
      }, 1000);
    }
  };

  return (
    <main>
      <div className="mt-12 px-4">
        <div className="bg-white editor mx-auto flex w-10/12 max-w-2xl flex-col p-6 text-gray-800 shadow-lg mb-12 rounded-lg border-t-4 border-purple-400">
          <div className="flex mb-4 items-center space-x-5">
            <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
              i
            </div>
            <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
              <h2 className="leading-relaxed">{mainText.headingText}</h2>
              <p className="text-sm text-gray-500 font-normal leading-relaxed">
                Vui lòng điền vào các ô bên dưới
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
            <h2 className="px-5 font-semibold text-base text-red-500 text-center">
              Phần nhập bắt buộc
            </h2>
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Mã nhóm vật tư
          </h2>
          <input
            name="PRODUCTKIND_CD"
            type="text"
            value={materialCode.PRODUCTKIND_CD || "Mã sẽ được tạo sau khi thêm"}
            disabled
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-300  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên nhóm vật tư (tiếng Việt)
          </h2>
          <input
            name="PRODUCTKIND_NM"
            required
            type="text"
            value={materialCode.PRODUCTKIND_NM || ""}
            onChange={(e) =>
              setMaterialCode((prevData) => ({
                ...prevData,
                PRODUCTKIND_NM: e.target.value,
              }))
            }
            placeholder="Nhập tên nhóm vật tư (tiếng Việt)"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {materialCodeErrors.PRODUCTKIND_NM && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {materialCodeErrors.PRODUCTKIND_NM}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên nhóm vật tư (tiếng Anh)
          </h2>
          <input
            name="PRODUCTKIND_NM_ENG"
            required
            type="text"
            value={materialCode.PRODUCTKIND_NM_ENG || ""}
            onChange={(e) =>
              setMaterialCode((prevData) => ({
                ...prevData,
                PRODUCTKIND_NM_ENG: e.target.value,
              }))
            }
            placeholder="Nhập tên nhóm vật tư (tiếng Anh)"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {materialCodeErrors.PRODUCTKIND_NM_ENG && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {materialCodeErrors.PRODUCTKIND_NM_ENG}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên nhóm vật tư (tiếng Hàn)
          </h2>
          <input
            name="PRODUCTKIND_NM_KOR"
            required
            type="text"
            value={materialCode.PRODUCTKIND_NM_KOR || ""}
            onChange={(e) =>
              setMaterialCode((prevData) => ({
                ...prevData,
                PRODUCTKIND_NM_KOR: e.target.value,
              }))
            }
            placeholder="Nhập tên nhóm vật tư (tiếng Hàn)"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {materialCodeErrors.PRODUCTKIND_NM_KOR && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {materialCodeErrors.PRODUCTKIND_NM_KOR}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
           Ghi chú
          </h2>
          <input
            name="REMARK"
            required
            type="text"
            value={materialCode.REMARK || ""}
            onChange={(e) =>
              setMaterialCode((prevData) => ({
                ...prevData,
                REMARK: e.target.value,
              }))
            }
            placeholder="Nhập ghi chú"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {/* --------------------------------------------------------------------------------- */}

          <div className="buttons flex mt-8">
            <hr className="mt-4" />
            <Link
              to="/dashboard/all-material-code"
              className="btn ml-auto rounded-md transition duration-300 ease-in-out cursor-pointer hover:bg-gray-500 p-2 px-5 font-semibold hover:text-white text-gray-500"
            >
              Hủy
            </Link>
            <button
              id="notification_buttonmodal"
              onClick={() => {
                handleSubmit();
              }}
              type="submit"
              className="btn ml-2 rounded-md transition duration-300 ease-in-out cursor-pointer !hover:bg-indigo-700 !bg-indigo-500 p-2 px-5 font-semibold text-white"
            >
              {mainText.buttonText}
            </button>
          </div>

          <NotificationModal
            mainAction={maintAction}
            isSuccess={successFlag}
            message={messageAPI}
            showLoading={showLoading}
            isContinue={childToParent}
            type="material-code"
          />
        </div>
      </div>
    </main>
  );
};
