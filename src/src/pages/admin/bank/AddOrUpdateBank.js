import React, { useEffect, useState, useRef, createRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AddOrUpdateText } from "../../../components/utils/Utils";
import { isEmptyOrSpaces } from "../../../components/utils/Utils";
import { generateSlug } from "../../../components/utils/Utils";
import NotificationModal from "../../../components/admin/modal/NotificationModal";
import DefaultImage from "images/post-default-full.png";
import {
  addBank,
  getSelectTypeBank,
  updateBank,
} from "services/BankRepository";
import {
  getAllBank,
  getBankBranch,
  getBankCodeName,
  getBankRegion,
} from "services/BankRepository";
import LoadingApiGif from "../../../images/loading-api-gray-600.gif";

export default ({ type = "" }) => {
  document.title = "Thêm/Cập nhật ngân hàng";

  let mainText = AddOrUpdateText(type, "ngân hàng");

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
      BANK_CD: storedEditItem?.BANK_CD || "",
      BANK_NM: storedEditItem?.BANK_NM || "",
      BANK_NAME: storedEditItem?.BANK_NAME || "",
      ACC_CD: storedEditItem?.ACC_CD || "",
      ACCOUNT_NUM: storedEditItem?.ACCOUNT_NUM || "",
      PASSBOOK_NM: storedEditItem?.PASSBOOK_NM || "",
      REMARK: storedEditItem?.REMARK || "",
      CITAD_CODE: storedEditItem?.CITAD_CODE || "",
      ABBREVIATED_NAME: storedEditItem?.ABBREVIATED_NAME || "",
      BANK_REGION_NAME: storedEditItem?.BANK_REGION_NAME || "",
    },
    [bank, setBank] = useState(initialState);

  const [successFlag, SetSuccessFlag] = useState(false);
  const [bankErrors, setBankErrors] = useState({});
  const [messageAPI, setMessageAPI] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [bankCodeNameList, setBankCodeNameList] = useState([]);
  const [bankRegionList, setBankRegionList] = useState([]);
  const [bankBranchList, setBankBranchList] = useState([]);
  const [loadingApiRegion, setLoadingApiRegion] = useState(false);
  const [loadingApiBranch, setLoadingApiBranch] = useState(false);
  const [remarkList, setRemarkList] = useState([
    "VND",
    "USD",
    "KRW",
    "EUR",
    "HKD",
    "JPY",
    "SGD",
    "CNY",
    "GBP",
    "MYR",
    "AUD",
    "TWD",
  ]);

  useEffect(() => {
    document.title = "Thêm/ cập nhật ngân hàng";

    if (id !== 0) {
        handleChangeBankRegion(bank.ABBREVIATED_NAME);
        handleChangeBankBranch(bank.BANK_REGION_NAME);
    }

    getBankCodeName().then((data) => {
      if (data) {
        setBankCodeNameList(data.result);
      } else {
        setBankCodeNameList([]);
      }
      // console.log(data.result);
    });
  }, []);

  const handleChangeBankRegion = (BANK_CODE_NAME) => {
    setLoadingApiRegion(true);
    getBankRegion({
      Lag: sessionStorage.getItem("lag"),
      BANK_CODE_NAME: BANK_CODE_NAME,
    }).then((data) => {
      if (data) {
        setBankRegionList(data.result);
      } else {
        setBankRegionList([]);
      }
      setLoadingApiRegion(false);
    });
  };

  const handleChangeBankBranch = (REGION_NAME) => {
    setLoadingApiBranch(true);
    getBankBranch({
      Lag: sessionStorage.getItem("lag"),
      REGION_NAME: REGION_NAME,
      BANK_CODE_NAME: bank.ABBREVIATED_NAME,
    }).then((data) => {
      if (data) {
        setBankBranchList(data.result);
      } else {
        setBankBranchList([]);
      }
      setLoadingApiBranch(false);
    });
  };

  const getCidtadCodeByCitadBankName = (VIETNAM_CITAD_BANK_NAME) => {
    const selectedBank = bankBranchList.find(item => item.VIETNAM_CITAD_BANK_NAME === VIETNAM_CITAD_BANK_NAME);
    return selectedBank.CITAD_CODE;
  };

  //validate lỗi bổ trống
  const validateAllBankInput = () => {
    //console.log(heritageData)
    const validationErrors = {};

    if (bank.BANK_NM.trim() === "") {
      validationErrors.BANK_NM = "Vui lòng nhập tên ngân hàng";
    }

    if (bank.ABBREVIATED_NAME.trim() === "") {
      validationErrors.ABBREVIATED_NAME = "Vui lòng chọn mã ngân hàng";
    }

    if (bank.BANK_REGION_NAME.trim() === "") {
      validationErrors.BANK_REGION_NAME = "Vui lòng chọn tỉnh";
    }

    if (bank.BANK_NAME.trim() === "") {
      validationErrors.BANK_NAME = "Vui lòng chọn chi nhánh";
    }

    setBankErrors(validationErrors);
    // Kiểm tra nếu có lỗi
    if (Object.keys(validationErrors).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    bank.Lag = sessionStorage.getItem("lag");
    console.log(bank);

    setMessageAPI("");
    setShowLoading(true);

    // Nếu không có lỗi mới xóa hoặc cập nhật
    if (validateAllBankInput() === false) {
      if (id === 0) {
        addBank(bank).then((data) => {
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
        updateBank(bank).then((data) => {
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
      setBank(initialState);
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
          <h2 className="font-semibold text-sm text-teal-500">Mã ngân hàng</h2>
          <input
            name="BANK_CD"
            type="text"
            value={bank.BANK_CD || "Mã sẽ được tạo sau khi thêm"}
            disabled
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-300  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Tên ngân hàng</h2>
          <input
            name="BANK_NM"
            required
            type="text"
            value={bank.BANK_NM || ""}
            maxLength={10}
            onChange={(e) =>
              setBank((prevData) => ({
                ...prevData,
                BANK_NM: e.target.value,
              }))
            }
            placeholder="Nhập tên ngân hàng"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {bankErrors.BANK_NM && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {bankErrors.BANK_NM}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Mã ngân hàng</h2>
          <select
            name="ABBREVIATED_NAME"
            value={bank.ABBREVIATED_NAME}
            required
            onChange={(e) => {
              setBank((prevData) => ({
                ...prevData,
                ABBREVIATED_NAME: e.target.value,
              }));

              handleChangeBankRegion(e.target.value);
            }}
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none"
          >
            <option value={""}>--- Chọn mã ngân hàng ---</option>
            {bankCodeNameList.map((item, index) => (
              <option key={index} value={item.Abbreviated_Name}>
                {item.Abbreviated_Name}
              </option>
            ))}
          </select>
          {bankErrors.ABBREVIATED_NAME && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {bankErrors.ABBREVIATED_NAME}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Tỉnh</h2>
          <div
            className={
              loadingApiRegion
                ? "flex items-center gap-4 mb-4 w-full px-4 py-1 mt-2 rounded-lg bg-gray-200"
                : "hidden"
            }
          >
            <img src={LoadingApiGif} className="h-10" />
            <p className="text-gray-600">Đang lấy thông tin</p>
          </div>

          <select
            name="BANK_REGION_NAME"
            value={bank.BANK_REGION_NAME}
            required
            onChange={(e) => {
              setBank((prevData) => ({
                ...prevData,
                BANK_REGION_NAME: e.target.value,
              }));

              handleChangeBankBranch(e.target.value);
            }}
            className={
              loadingApiRegion
                ? "hidden"
                : "text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none"
            }
          >
            <option value={""}>--- Chọn tỉnh ---</option>
            {bankRegionList.map((item, index) => (
              <option key={index} value={item.Jurisdiction_Region_Name}>
                {item.Jurisdiction_Region_Name}
              </option>
            ))}
          </select>
          {bankErrors.BANK_REGION_NAME && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {bankErrors.BANK_REGION_NAME}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Chi nhánh</h2>
          <div
            className={
              loadingApiBranch
                ? "flex items-center gap-4 mb-4 w-full px-4 py-1 mt-2 rounded-lg bg-gray-200"
                : "hidden"
            }
          >
            <img src={LoadingApiGif} className="h-10" />
            <p className="text-gray-600">Đang lấy thông tin</p>
          </div>

          <select
            name="BANK_NAME"
            value={bank.BANK_NAME}
            required
            onChange={(e) => {
              setBank((prevData) => ({
                ...prevData,
                BANK_NAME: e.target.value,
                CITAD_CODE: getCidtadCodeByCitadBankName(e.target.value),
              }));
            }}
            className={
              loadingApiBranch
                ? "hidden"
                : "text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none"
            }
          >
            <option value={""}>--- Chọn chi nhánh ---</option>
            {bankBranchList.map((item, index) => (
              <option key={index} value={item.VIETNAM_CITAD_BANK_NAME}>
                {item.VIETNAM_CITAD_BANK_NAME}
              </option>
            ))}
          </select>
          {bankErrors.BANK_NAME && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {bankErrors.BANK_NAME}
            </p>
          )}
          {/* --------------------------------------------------------------------------------- */}
          <div className="flex items-center justify-center my-4">
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
            <h2 className="px-5 font-semibold text-base text-red-500 text-center">
              Phần nhập bổ sung
            </h2>
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Số tài khoản</h2>
          <input
            name="ACCOUNT_NUM"
            required
            type="text"
            value={bank.ACCOUNT_NUM || ""}
            maxLength={10}
            onChange={(e) =>
              setBank((prevData) => ({
                ...prevData,
                ACCOUNT_NUM: e.target.value,
              }))
            }
            placeholder="Nhập số tài khoản"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên tài khoản ngân hàng
          </h2>
          <input
            name="PASSBOOK_NM"
            required
            type="text"
            value={bank.PASSBOOK_NM || ""}
            maxLength={10}
            onChange={(e) =>
              setBank((prevData) => ({
                ...prevData,
                PASSBOOK_NM: e.target.value,
              }))
            }
            placeholder="Nhập tên tài khoản ngân hàng"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Loại tiền</h2>
          <select
            name="REMARK"
            value={bank.REMARK}
            required
            onChange={(e) => {
              setBank((prevData) => ({
                ...prevData,
                REMARK: e.target.value,
              }));
            }}
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none"
          >
            <option value={""}>--- Chọn loại tiền ---</option>
            {remarkList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          {/* --------------------------------------------------------------------------------- */}

          <div className="buttons flex mt-8">
            <hr className="mt-4" />
            <Link
              to="/dashboard/all-bank"
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
            type="bank"
          />
        </div>
      </div>
    </main>
  );
};
