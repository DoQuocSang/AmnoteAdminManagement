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
import { addUnitCode, getSelectTypeUnitCode, updateUnitCode } from "services/UnitCodeRepository";
import { getAllBank } from "services/BankRepository";
import { useSelector } from "react-redux";

export default ({ type = "" }) => {
  document.title = "Thêm/Cập nhật mã đơn vị tính";

  let mainText = AddOrUpdateText(type, "mã đơn vị tính");

  let storedEditItem = null;

  let { id } = useParams();
  id = id ?? 0;

  let maintAction = "";
  if (id === 0) {
    maintAction = "thêm";
    sessionStorage.removeItem('editItem')
  } else {
    maintAction = "cập nhật";
    storedEditItem = JSON.parse(sessionStorage.getItem('editItem'));
  }


  const initialState = {
      Lag: sessionStorage.getItem("lag"),
      // ----------------------------
      productUnitCD: storedEditItem?.UNIT_CD || "",
      productUnitName: storedEditItem?.UNIT_NM || "",
    },
    [unitCode, setUnitCode] = useState(initialState);

  const [successFlag, SetSuccessFlag] = useState(false);
  const [unitCodeErrors, setUnitCodeErrors] = useState({});
  const [messageAPI, setMessageAPI] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    document.title = "Thêm/ cập nhật mã đơn vị tính";
    
    if (id !== 0) {

    } 
  }, []);


  //validate lỗi bổ trống
  const validateAllUnitCodeInput = () => {
    //console.log(heritageData)
    const validationErrors = {};

    if (unitCode.productUnitName.trim() === "") {
      validationErrors.productUnitName = "Vui lòng nhập tên đơn vị tính";
    }

    setUnitCodeErrors(validationErrors);
    // Kiểm tra nếu có lỗi
    if (Object.keys(validationErrors).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    unitCode.Lag = sessionStorage.getItem("lag");
    console.log(unitCode);

    setMessageAPI("");
    setShowLoading(true);

    // Nếu không có lỗi mới xóa hoặc cập nhật
    if (validateAllUnitCodeInput() === false) {
      if (id === 0) {
        addUnitCode(unitCode).then(data => {
            // SetSuccessFlag(true);
            if(data.status === "success"){
              SetSuccessFlag(true);
              setMessageAPI(data.messages[0])
              setShowLoading(false);
              // console.log(data.result);
            } else if (data.status === "error"){
              SetSuccessFlag(false);
              setMessageAPI(data.messages[0]);
              setShowLoading(false);
            }
        });
      } else {
        updateUnitCode(unitCode).then(data => {
          // SetSuccessFlag(true);
          if(data.status === "success"){
            SetSuccessFlag(true);
            setMessageAPI(data.messages[0])
            setShowLoading(false);
            // console.log(data.result);
          } else if (data.status === "error"){
            SetSuccessFlag(false);
            setMessageAPI(data.messages[0]);
            setShowLoading(false);
          }
      });
      }
    }else{
      setMessageAPI("Vui lòng kiểm tra lại các ô nhập liệu");
      setShowLoading(false);
    }
  };

  //Xử lý khi bấm xóa bên component con NotificationModal
  const childToParent = (isContinue) => {
    if (isContinue === true && id === 0) {
      setUnitCode(initialState);
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
            Mã đơn vị tính
          </h2>
          <input
            name="productUnitCD"
            type="text"
            value={unitCode.productUnitCD || "Mã sẽ được tạo sau khi thêm"}
            disabled
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-300  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên đơn vị tính
          </h2>
          <input
            name="productUnitName"
            required
            type="text"
            value={unitCode.productUnitName || ""}
            maxLength={10} 
            onChange={(e) =>
              setUnitCode((prevData) => ({
                ...prevData,
                productUnitName: e.target.value,
              }))
            }
            placeholder="Nhập tên đơn vị tính"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {unitCodeErrors.productUnitName && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {unitCodeErrors.productUnitName}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}

          <div className="buttons flex mt-8">
            <hr className="mt-4" />
            <Link
              to="/dashboard/all-unit-code"
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
            type="unit-code"
          />
        </div>
      </div>
    </main>
  );
};
