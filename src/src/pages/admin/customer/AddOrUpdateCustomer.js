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
  addCustomer,
  getSelectTypeCustomer,
  updateCustomer,
} from "services/CustomerRepository";
import { getAllBank } from "services/BankRepository";
import { useSelector } from "react-redux";

export default ({ type = "" }) => {
  document.title = "Thêm/Cập nhật khách hàng";

  let mainText = AddOrUpdateText(type, "khách hàng");

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
    console.log(storedEditItem);
  }

  const initialState = {
      Lag: sessionStorage.getItem("lag"),
      CustomerCD: storedEditItem?.CUSTOMER_CD || "",
      // ----------------------------
      Address: storedEditItem?.ADDRESS || "",
      CategoryCD: storedEditItem?.CATEGORY_CD || "",
      CustomerType: storedEditItem?.CUSTOMER_TYPE || "",
      CustomerNM: storedEditItem?.CUSTOMER_NM || "",
      CustomerNM_EN: storedEditItem?.CUSTOMER_NM_EN || "",
      CustomerNM_KOR: storedEditItem?.CUSTOMER_NM_KOR || "",
      Note: storedEditItem?.NOTE || "",
      Individual: storedEditItem?.INDIVIDUAL || "",
      Nationality: storedEditItem?.NATIONALITY || "",
      Email: storedEditItem?.EMAIL || "",
      BuyerNM: storedEditItem?.BUYER_NM || "",
      CustomerUserCD: storedEditItem?.CUSTOMER_USER_CD || "",
      TaxCD: storedEditItem?.TAX_CD || "",
      BankCD: storedEditItem?.BANK_CD || "",
      OwnerNM: storedEditItem?.OWNER_NM || "",
      BusinessType: storedEditItem?.BUSINESS_TYPE || "",
      KindBusiness: storedEditItem?.KIND_BUSINESS || "",
      Fax: storedEditItem?.FAX || "",
      Tel: storedEditItem?.TEL || "",
      CustomerIDNumber: storedEditItem?.IDNUMBER || "",
      CustomerPlaceIssue: storedEditItem?.PLACE_ISSUE || "",
      CustomerDateIssue: storedEditItem?.DATE_ISSUE || "",
      InquiryIn: storedEditItem?.INQUIRY_IN || "",
      PaymentTerm: storedEditItem?.PAYMENT_TERM || 0,
      CustomerReceive: storedEditItem?.CUSTOMER_RECEIVE || "",
      AddressReceive: storedEditItem?.ADDRESS_RECEIVE || "",
      TaxCDReceive: storedEditItem?.TAX_CD_RECEIVE || "",
      BankNM: "",
    },
    [customer, setCustomer] = useState(initialState);

  const [customerTypeList, SetCustomerTypeList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [successFlag, SetSuccessFlag] = useState(false);
  const [customerErrors, setCustomerErrors] = useState({});
  const [hasTaxCode, setHasTaxCode] = useState(true);
  const [messageAPI, setMessageAPI] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  // const data = useSelector(state => state.data);
  // console.log(data)

  //console.log(id);
  useEffect(() => {
    document.title = "Thêm/ cập nhật khách hàng";

    if (id !== 0) {
      console.log(storedEditItem);
      console.log(customer);
      if (customer.Email.trim() !== "") {
        setEmailList(customer.Email.split(";"));
      }
      CheckTaxCode(customer.CategoryCD);
    }

    getSelectTypeCustomer().then((data) => {
      if (data) {
        SetCustomerTypeList(data.result);
      } else {
        SetCustomerTypeList([]);
      }
      // console.log(data.result);
    });

    getAllBank().then((data) => {
      if (data) {
        setBankList(data.result);
      } else {
        setBankList(data.result);
      }
    });
  }, []);

  //validate lỗi bổ trống
  const validateAllCustomerInput = () => {
    //console.log(heritageData)
    const validationErrors = {};

    if (customer.CustomerType.trim() === "") {
      validationErrors.CustomerType = "Vui lòng chọn loại khách hàng";
    }

    if (customer.CategoryCD.trim() === "") {
      validationErrors.CategoryCD = "Vui lòng chọn phân loại khách hàng";
    }

    if (customer.CustomerNM.trim() === "") {
      validationErrors.CustomerNM = "Vui lòng nhập tên khách hàng (tiếng Việt)";
    }

    // if (customer.CustomerNM_EN.trim() === "") {
    //   validationErrors.CustomerNM_EN = "Vui lòng nhập tên khách hàng (tiếng Hàn)";
    // }

    // if (customer.CustomerNM_KOR.trim() === "") {
    //   validationErrors.CustomerNM_KOR = "Vui lòng nhập tên khách hàng (tiếng Anh)";
    // }

    if (hasTaxCode) {
      if (customer.TaxCD.trim() === "") {
        validationErrors.TaxCD = "Vui lòng nhập mã số thuế";
      } else if (customer.TaxCD.trim().length !== 10) {
        validationErrors.TaxCD = "Vui lòng nhập đủ 10 chữ số";
      }
    }

    if (customer.Address.trim() === "") {
      validationErrors.Address = "Vui lòng nhập địa chỉ";
    }

    // if (customer.Note.trim() === "") {
    //   validationErrors.Note = "Vui lòng nhập lưu ý khách hàng";
    // }

    // if (customer.Individual.trim() === "") {
    //   validationErrors.Individual = "Vui lòng chọn cá nhân cư trú";
    // }

    // if (customer.Nationality.trim() === "") {
    //   validationErrors.Nationality = "Vui lòng nhập quốc tịch";
    // }

    // if (customer.IDNumber.trim() === "") {
    //   validationErrors.IDNumber = "Vui lòng nhập CMND/CCCD";
    // }

    // if (customer.PlaceIssue.trim() === "") {
    //   validationErrors.PlaceIssue = "Vui lòng nhập nơi cấp";
    // }

    // if (customer.DateIssue.trim() === "") {
    //   validationErrors.DateIssue = "Vui lòng nhập ngày cấp";
    // }

    setCustomerErrors(validationErrors);
    // Kiểm tra nếu có lỗi
    if (Object.keys(validationErrors).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const CheckTaxCode = (eventValue) => {
    if (eventValue === "4" || eventValue === "5") {
      setHasTaxCode(false);
      setCustomer((prevData) => ({
        ...prevData,
        TaxCD: "",
      }));
    } else {
      setHasTaxCode(true);
    }
  };

  // const CheckTypeName = (eventValue) => {
  //   if (parseInt(eventValue) === 2) {
  //     setCustomer((prevData) => ({
  //       ...prevData,
  //       custome: "Nước ngoài",
  //       CUSTOMER_TYPE_NAME_ENG: "Overseas",
  //       CUSTOMER_TYPE_NAME_KOR: "해외",
  //       CUSTOMER_TYPE_NAME_JAPAN: "",
  //       CUSTOMER_TYPE_NAME_CHINA: "",
  //     }));
  //   } else if (parseInt(eventValue) === 1) {
  //     setCustomer((prevData) => ({
  //       ...prevData,
  //       CUSTOMER_TYPE_NAME_VIET: "Nội địa",
  //       CUSTOMER_TYPE_NAME_ENG: "Domestic",
  //       CUSTOMER_TYPE_NAME_KOR: "국내",
  //       CUSTOMER_TYPE_NAME_JAPAN: "",
  //       CUSTOMER_TYPE_NAME_CHINA: "",
  //     }));
  //   }

  //   // console.log(customer);
  // };

  const searchByBankCode = (BankCD) => {
    const bank = bankList.find((bank) => bank.BANK_CD === BankCD);
    setCustomer((prevData) => ({
      ...prevData,
      BankNM: bank ? bank.BANK_NM : "Không tìm thấy ngân hàng",
    }));
    // bankList.map((item, index) => (
    //   console.log(item.)
    // ))
  };

  const handleAddEmail = (email) => {
    if (email) {
      setEmailList((prevEmailList) => [...prevEmailList, email]);
      setCurrentEmail("");
    }
  };

  const handleUpdateEmail = (email, index) => {
    const updatedEmailList = [...emailList];
    updatedEmailList[index] = email;
    setEmailList(updatedEmailList);
  };

  const handleRemoveEmail = (index) => {
    const updatedEmailList = [...emailList];
    updatedEmailList.splice(index, 1);
    setEmailList(updatedEmailList);
  };

  const handleSubmit = () => {
    let emailString = emailList.join(";");

    if (emailString.endsWith(";")) {
      emailString = emailString.slice(0, -1);
    }

    customer.Email = emailString;
    customer.Lag = sessionStorage.getItem("lag");
    console.log(customer);

    setMessageAPI("");
    setShowLoading(true);

    // Nếu không có lỗi mới xóa hoặc cập nhật
    if (validateAllCustomerInput() === false) {
      if (id === 0) {
        addCustomer(customer).then((data) => {
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
        updateCustomer(customer).then((data) => {
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

    // sessionStorage.removeItem("editItem");
    // sessionStorage.setItem("editItem", JSON.stringify(customer));
  };

  //Xử lý khi bấm xóa bên component con NotificationModal
  const childToParent = (isContinue) => {
    if (isContinue === true && id === 0) {
      setCustomer(initialState);
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
            Loại khách hàng
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2 mb-4 mt-2">
            <label>
              <input
                type="radio"
                value={"1"}
                checked={customer.CustomerType === "1"}
                onChange={(e) =>
                  setCustomer((prevData) => ({
                    ...prevData,
                    CustomerType: e.target.value,
                  }))
                }
                class="peer hidden"
                name="CUSTOMER_TYPE_NAME_VIET"
              />

              <div class="hover:bg-gray-50 flex items-center justify-between px-4 py-2.5 border-2 rounded-lg cursor-pointer border-gray-200 group peer-checked:border-blue-500">
                <h2 class="font-medium text-gray-700 group-[.peer:checked+&]:text-blue-500">
                  Nội địa
                </h2>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lg text-blue-600 invisible group-[.peer:checked+&]:visible"
                />
              </div>
            </label>

            <label>
              <input
                type="radio"
                value={"2"}
                checked={customer.CustomerType === "2"}
                onChange={(e) =>
                  setCustomer((prevData) => ({
                    ...prevData,
                    CustomerType: e.target.value,
                  }))
                }
                class="peer hidden"
                name="CUSTOMER_TYPE_NAME_VIET"
              />

              <div class="hover:bg-gray-50 flex items-center justify-between px-4 py-2.5 border-2 rounded-lg cursor-pointer border-gray-200 group peer-checked:border-blue-500">
                <h2 class="font-medium text-gray-700 group-[.peer:checked+&]:text-blue-500">
                  Nước ngoài
                </h2>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lg text-blue-600 invisible group-[.peer:checked+&]:visible"
                />
              </div>
            </label>
          </div>
          {customerErrors.CustomerType && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CustomerType}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Phân loại khách hàng
          </h2>
          <select
            name="CategoryCD"
            value={customer.CategoryCD}
            required
            onChange={(e) => {
              setCustomer((prevData) => ({
                ...prevData,
                CategoryCD: e.target.value,
              }));

              CheckTaxCode(e.target.value);
            }}
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none"
          >
            <option value={0}>--- Chọn phân loại khách hàng ---</option>
            {customerTypeList.map((item, index) => (
              <option key={index} value={item.FIELD_VALUE}>
                {item.DESCFIELD}
              </option>
            ))}
          </select>
          {customerErrors.CategoryCD && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CategoryCD}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên khách hàng
          </h2>
          <input
            name="CustomerNM"
            required
            type="text"
            value={customer.CustomerNM || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                CustomerNM: e.target.value,
              }))
            }
            placeholder="Nhập tên khách hàng"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.CustomerNM && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CustomerNM}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên khách hàng (KOR/Tiếng Hàn)
          </h2>
          <input
            name="CustomerNM"
            required
            type="text"
            value={customer.CustomerNM_KOR || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                CustomerNM_KOR: e.target.value,
              }))
            }
            placeholder="Nhập tên khách hàng (KOR/Tiếng Hàn)"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.CustomerNM_KOR && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CustomerNM_KOR}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Tên khách hàng (ENG/Tiếng Anh)
          </h2>
          <input
            name="CustomerNM_EN"
            required
            type="text"
            value={customer.CustomerNM_EN || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                CustomerNM_EN: e.target.value,
              }))
            }
            placeholder="Nhập tên khách hàng (ENG/Tiếng Anh)"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.CustomerNM_EN && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CustomerNM_EN}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          {hasTaxCode === true && (
            <>
              <h2 className="font-semibold text-sm text-teal-500">
                Mã số thuế
              </h2>
              <input
                name="TaxCD"
                required
                type="text"
                value={customer.TaxCD || ""}
                onChange={(e) =>
                  setCustomer((prevData) => ({
                    ...prevData,
                    TaxCD: e.target.value,
                  }))
                }
                maxLength={10}
                placeholder="Nhập mã số thuế"
                className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
              />
              {customerErrors.TaxCD && (
                <p className="text-red-500 mb-6 text-sm font-semibold">
                  <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                  {customerErrors.TaxCD}
                </p>
              )}
            </>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Địa chỉ</h2>
          <input
            name="Address"
            required
            type="text"
            value={customer.Address || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                Address: e.target.value,
              }))
            }
            placeholder="Nhập địa chỉ"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.Address && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Address}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Lưu ý khách hàng
          </h2>
          <input
            name="Note"
            required
            type="text"
            value={customer.Note || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                Note: e.target.value,
              }))
            }
            placeholder="Nhập lưu ý"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.Note && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Note}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Cá nhân cư trú
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2 mb-4 mt-2">
            <label>
              <input
                type="radio"
                value={"1"}
                checked={customer.Individual === "1"}
                onChange={(e) =>
                  setCustomer((prevData) => ({
                    ...prevData,
                    Individual: e.target.value,
                  }))
                }
                class="peer hidden"
                name="Individual"
              />

              <div class="hover:bg-gray-50 flex items-center justify-between px-4 py-2.5 border-2 rounded-lg cursor-pointer border-gray-200 group peer-checked:border-blue-500">
                <h2 class="font-medium text-gray-700 group-[.peer:checked+&]:text-blue-500">
                  Có
                </h2>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lg text-blue-600 invisible group-[.peer:checked+&]:visible"
                />
              </div>
            </label>

            <label>
              <input
                type="radio"
                value={"0"}
                checked={customer.Individual === "0"}
                onChange={(e) =>
                  setCustomer((prevData) => ({
                    ...prevData,
                    Individual: e.target.value,
                  }))
                }
                class="peer hidden"
                name="Individual"
              />

              <div class="hover:bg-gray-50 flex items-center justify-between px-4 py-2.5 border-2 rounded-lg cursor-pointer border-gray-200 group peer-checked:border-blue-500">
                <h2 class="font-medium text-gray-700 group-[.peer:checked+&]:text-blue-500">
                  Không
                </h2>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lg text-blue-600 invisible group-[.peer:checked+&]:visible"
                />
              </div>
            </label>
          </div>
          {customerErrors.Individual && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Individual}
            </p>
          )}

          <div className=" rounded-lg py-6 px-8 bg-gray-100 mb-4">
            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500">Quốc tịch</h2>
            <input
              name="Nationality"
              required
              type="text"
              value={customer.Nationality || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  Nationality: e.target.value,
                }))
              }
              placeholder="Nhập quốc tịch"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.Nationality && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.Nationality}
              </p>
            )}

            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500">
              CMND/CCCD
            </h2>
            <input
              name="IDNumber"
              required
              type="text"
              value={customer.IDNumber || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  IDNumber: e.target.value,
                }))
              }
              placeholder="Nhập CMND/CCCD"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.IDNumber && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.IDNumber}
              </p>
            )}

            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500 flex items-center gap-2">
              Nơi cấp
              <FontAwesomeIcon
                icon={faCircle}
                className="w-2 h-2 text-red-500"
              />
            </h2>
            <input
              name="PlaceIssue"
              required
              type="text"
              value={customer.PlaceIssue || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  PlaceIssue: e.target.value,
                }))
              }
              placeholder="Nhập nơi cấp"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.PlaceIssue && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.PlaceIssue}
              </p>
            )}

            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500 flex items-center gap-2">
              Ngày cấp
              <FontAwesomeIcon
                icon={faCircle}
                className="w-2 h-2 text-red-500"
              />
            </h2>
            <input
              name="DateIssue"
              required
              type="text"
              value={customer.DateIssue || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  DateIssue: e.target.value,
                }))
              }
              placeholder="Nhập ngày cấp"
              className="mb-4 text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.DateIssue && (
              <p className="text-red-500 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.DateIssue}
              </p>
            )}
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <div className="flex items-center justify-center my-4">
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
            <h2 className="px-5 font-semibold text-base text-red-500 text-center">
              Phần nhập bổ sung
            </h2>
            <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Mã khách hàng</h2>
          <input
            name="CustomerUserCD"
            required
            type="text"
            value={customer.CustomerUserCD || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                CustomerUserCD: e.target.value,
              }))
            }
            placeholder="Nhập mã khách hàng"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.CustomerUserCD && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.CustomerUserCD}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Ngân hàng
            <span className="font-semibold text-xs text-gray-500 ml-2">
              {bankList.length > 0
                ? `(Các mã có thể nhập: ${bankList[0].BANK_CD || 0}-${
                    bankList[bankList.length - 1].BANK_CD || 0
                  })`
                : "(Đang lấy dữ liệu...)"}
            </span>
          </h2>

          <div className="sm:block md:flex lg:flex items-center justify-between w-full gap-4">
            <input
              name="BankCD"
              required
              type="text"
              maxLength={5}
              value={customer.BankCD || ""}
              onChange={(e) => {
                setCustomer((prevData) => ({
                  ...prevData,
                  BankCD: e.target.value,
                }));

                searchByBankCode(e.target.value);
              }}
              placeholder="Nhập mã ngân hàng"
              className="text-black mb-4 placeholder-gray-600 px-4 py-2.5 mt-2 text-base sm:w-full md:max-w-56 lg:max-w-56 transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />

            <input
              name="BankNM"
              required
              type="text"
              value={customer.BankNM || "(Vui lòng nhập mã ngân hàng)"}
              disabled
              className="text-black mb-4 placeholder-gray-600 px-4 py-2.5 mt-2 text-base flex-1 sm:w-full md:max-w-full lg:max-w-full transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500 flex items-center gap-2">
            Số điện thoại
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-red-500" />
          </h2>
          <input
            name="Tel"
            required
            type="text"
            value={customer.Tel || ""}
            maxLength={10}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                Tel: e.target.value,
              }))
            }
            placeholder="Nhập số điện thoại"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.Tel && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Tel}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Email</h2>

          <div className="flex items-center w-full bg-gray-200 rounded-lg mt-2 mb-4">
            <div className="w-full">
              <input
                type="text"
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 text-base transition duration-500 ease-in-out transform border-transparent rounded-l-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                placeholder="Nhập email"
                value={currentEmail || ""}
                onChange={(e) => {
                  setCurrentEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                onClick={() => handleAddEmail(currentEmail)}
                className="bg-teal-500 w-12 h-12 text-white rounded-r-lg hover:bg-teal-400 transition duration-75"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {emailList.map((email, index) => (
            <div
              key={index}
              className="flex items-center w-full bg-gray-200 rounded-lg mt-2 mb-4"
            >
              <div className="w-full">
                <input
                  id={`iput_${index}`}
                  type="text"
                  className="text-black placeholder-gray-600 w-full px-4 py-2.5 text-base transition duration-500 ease-in-out transform border-transparent rounded-l-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
                  placeholder="Nhập email"
                  value={email || ""}
                  onChange={(e) => {
                    handleUpdateEmail(e.target.value, index);
                  }}
                />
              </div>
              <div>
                <button
                  onClick={() => handleRemoveEmail(index)}
                  className="bg-red-500 w-12 h-12 text-white rounded-r-lg hover:bg-red-400 transition duration-75"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </div>
            </div>
          ))}

          {customerErrors.Email && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Email}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Fax</h2>
          <input
            name="Fax"
            required
            type="text"
            value={customer.Fax || ""}
            maxLength={10}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                Fax: e.target.value,
              }))
            }
            placeholder="Nhập fax"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.Fax && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.Fax}
            </p>
          )}

          <div className="border-t-2 border-gray-200 mt-4 my-8"></div>
          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Tên giám đốc</h2>
          <input
            name="OwnerNM"
            required
            type="text"
            value={customer.OwnerNM || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                OwnerNM: e.target.value,
              }))
            }
            placeholder="Nhập tên giám đốc"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.OwnerNM && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.OwnerNM}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500 flex items-center gap-2">
            Số đăng ký kinh doanh
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-red-500" />
          </h2>
          <input
            name="BRN"
            required
            type="text"
            value={customer.BRN || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                BRN: e.target.value,
              }))
            }
            placeholder="Nhập số đăng ký kinh doanh"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.BRN && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.BRN}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            HÌnh thức kinh doanh
          </h2>
          <input
            name="BusinessType"
            required
            type="text"
            value={customer.BusinessType || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                BusinessType: e.target.value,
              }))
            }
            placeholder="Nhập hình thức kinh doanh"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.BusinessType && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.BusinessType}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">
            Loại hình kinh doanh
          </h2>
          <input
            name="KindBusiness"
            required
            type="text"
            value={customer.KindBusiness || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                KindBusiness: e.target.value,
              }))
            }
            placeholder="Nhập loại hình kinh doanh"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.KindBusiness && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.KindBusiness}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Tên người mua</h2>
          <input
            name="BuyerNM"
            required
            type="text"
            value={customer.BuyerNM || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                BuyerNM: e.target.value,
              }))
            }
            placeholder="Nhập tên người mua"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.BuyerNM && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.BuyerNM}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500">Tra cứu tại</h2>
          <input
            name="InquiryIn"
            required
            type="text"
            value={customer.InquiryIn || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                InquiryIn: e.target.value,
              }))
            }
            placeholder="Nhập địa chỉ tra cứu"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.InquiryIn && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.InquiryIn}
            </p>
          )}

          {/* --------------------------------------------------------------------------------- */}
          <h2 className="font-semibold text-sm text-teal-500 flex items-center gap-2">
            Thời hạn thanh toán
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-red-500" />
          </h2>
          <input
            name="PaymentTerm"
            required
            type="text"
            value={customer.PaymentTerm || ""}
            onChange={(e) =>
              setCustomer((prevData) => ({
                ...prevData,
                PaymentTerm: parseInt(e.target.value, 10),
              }))
            }
            placeholder="Nhập thời hạn thanh toán"
            className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
          />
          {customerErrors.PaymentTerm && (
            <p className="text-red-500 mb-6 text-sm font-semibold">
              <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
              {customerErrors.PaymentTerm}
            </p>
          )}

          <h2 className="font-semibold text-sm text-teal-500">
            Thông tin nhận hàng
          </h2>
          {/* --------------------------------------------------------------------------------- */}
          <div className="bg-gray-100 mt-2 rounded-lg py-6 px-8 mb-4">
            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500">Tên</h2>
            <input
              name="CustomerReceive"
              required
              type="text"
              value={customer.CustomerReceive || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  CustomerReceive: e.target.value,
                }))
              }
              placeholder="Nhập tên"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.CustomerReceive && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.CustomerReceive}
              </p>
            )}

            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500">Địa chỉ</h2>
            <input
              name="AddressReceive"
              required
              type="text"
              value={customer.AddressReceive || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  AddressReceive: e.target.value,
                }))
              }
              placeholder="Nhập địa chỉ"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.AddressReceive && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.AddressReceive}
              </p>
            )}

            {/* --------------------------------------------------------------------------------- */}
            <h2 className="font-semibold text-sm text-teal-500">Mã số thuế</h2>
            <input
              name="TaxCDReceive"
              required
              type="text"
              value={customer.TaxCDReceive || ""}
              onChange={(e) =>
                setCustomer((prevData) => ({
                  ...prevData,
                  TaxCDReceive: e.target.value,
                }))
              }
              maxLength={10}
              placeholder="Nhập mã số thuế"
              className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400"
            />
            {customerErrors.TaxCDReceive && (
              <p className="text-red-500 mb-6 text-sm font-semibold">
                <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                {customerErrors.TaxCDReceive}
              </p>
            )}
          </div>

          <div className="buttons flex mt-8">
            <hr className="mt-4" />
            <Link
              to="/dashboard/all-customer"
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
            type="customer"
          />
        </div>
      </div>
    </main>
  );
};
