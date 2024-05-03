import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Book1 from "images/book1.png";
import Book2 from "images/book2.jpg";
import Book3 from "images/book3.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faDizzy,
  faLaughBeam,
  faPenToSquare,
  faShield,
  faTired,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toVND } from "../../../components/utils/Utils";
import { isEmptyOrSpaces } from "../../../components/utils/Utils";
import DefaultImage from "images/post-default.png";
import Error404 from "../../../components/admin/other/Error404";
import { getHeritages } from "services/HeritageRepository";
import DeleteModal from "../../../components/admin/modal/DeleteModal";
import { getHeritageById } from "../../../services/HeritageRepository";
import { checkImageArray } from "../../../components/utils/Utils";
import SearchInput from "../../../components/admin/other/SearchInput";
import { getHeritagesByQuerySearch } from "../../../services/HeritageRepository";
import { getAllCustomer } from "services/CustomerRepository";
import Pagination from "../../../components/admin/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import LoadingApiGif from "../../../images/loading-api-color.gif";

export default () => {
  document.title = "Quản lý khách hàng";

  const navigate = useNavigate();

  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showLoading, setShowLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(0);
  const [toggleDelete, setToggleDelete] = useState(false);

  //Xử lý khi bấm xóa bên component con DeleteModal
  const childToParent = (isDelete) => {
    if (isDelete === true && deleteId !== 0) {
      setCustomerList(customerList.filter((item) => item.id !== deleteId));
    }
    console.log(customerList.length);
  };

  const handleRowClick = () => {
    navigate("/admin/dashboard/update-customer");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Xử lý logic
    getAllCustomer().then((data) => {
      if (data) {
        setCustomerList(data.result);
      } else {
        setCustomerList([]);
      }
      setShowLoading(false);
      console.log(data.result);
    });
  }, []);

  // Logic to calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customerList.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleTogleDelete = () => {
    setToggleDelete(!toggleDelete);
  };

  return (
    <>
      <main>
        <div className="pt-6 px-4">
          <div className="w-full mb-8">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Quản lý khách hàng
                  </h3>
                  <span className="text-base font-normal text-gray-500">
                    Các khách hàng hiện có trong database
                  </span>
                </div>
                <div className="flex-shrink-0"></div>
                <div className="flex-shrink-0">
                  <div className="flex justify-center items-center gap-2">
                    
                    {toggleDelete ? (
                      <>
                      <a
                        onClick={() => alert("click")}
                        className="cursor-pointer hidden transition duration-300 sm:inline-flex text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-base mr-3"
                        />
                        Xoá
                      </a>
                       <a
                        onClick={handleTogleDelete}
                        className="cursor-pointer hidden transition duration-300 sm:inline-flex text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
                      >
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-base mr-3"
                        />
                        Hủy
                      </a>
                      </>
                    ) : (
                      <>
                       <Link to="/admin/dashboard/add-heritage">
                      <a className="hidden transition duration-300 sm:inline-flex text-white bg-teal-400 hover:bg-teal-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-base mr-3"
                        />
                        Thêm
                      </a>
                    </Link>
                      <a
                        onClick={handleTogleDelete}
                        className="cursor-pointer hidden transition duration-300 sm:inline-flex text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-base mr-3"
                        />
                        Xoá
                      </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {showLoading ? (
                  <div className="flex flex-col justify-center items-center gap-2 my-10">
                    <img src={LoadingApiGif} className="h-32 w-auto" />
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h2 className="font-semibold text-2xl text-gray-500">
                        Đang lấy dữ liệu
                      </h2>
                      <h2 className="text-sm text-gray-500">
                        Vui lòng chờ trong giây lát
                      </h2>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg my-4">
                      <div className="align-middle inline-block min-w-full">
                        <div className="shadow sm:rounded-lg">
                          <table className="table-fixed min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-200">
                              <tr>
                                {toggleDelete && (
                                  <th className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"></th>
                                )}
                                <th className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider">
                                  Mã số khách hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Mã khách hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Phân loại khách hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Loại khách hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên khách hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên khách hàng (ENG)
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên khách hàng (KOR)
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên người mua
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Mã số thuế
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên ngân hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tài khoản ngân hàng
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Số điện thoại
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Fax
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên giám đốc
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Số đăng ký kinh doanh
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Hình thức kinh doanh
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Loại hình kinh doanh
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Chú ý
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Địa chỉ
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Tên
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Địa chỉ
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Mã số thuế
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Thời hạn thanh toán
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {currentItems.map((item, index) => (
                                <tr
                                  onClick={
                                    toggleDelete ? () => {} : handleRowClick
                                  }
                                  className={
                                    index % 2 !== 0
                                      ? "bg-gray-100 cursor-pointer text-gray-500 hover:bg-red-400 hover:text-white transition"
                                      : "cursor-pointer text-gray-500 hover:bg-red-400 hover:text-white transition"
                                  }
                                >
                                  {toggleDelete && (
                                    <td className="p-4 whitespace-nowrap text-sm font-bold">
                                      <div class="inline-flex items-center">
                                        <label
                                          class="relative flex cursor-pointer items-center rounded-full p-3"
                                          data-ripple-dark="true"
                                        >
                                          <input
                                            type="checkbox"
                                            class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-red-500 checked:bg-red-500 checked:before:bg-red-500 hover:before:opacity-10"
                                          />
                                          <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              class="h-3.5 w-3.5"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              stroke="currentColor"
                                              stroke-width="1"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                              ></path>
                                            </svg>
                                          </div>
                                        </label>
                                      </div>
                                    </td>
                                  )}
                                  <td className="p-4 whitespace-nowrap text-sm font-bold">
                                    {item.CUSTOMER_CD}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_USER_CD}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CATEGORY_NAME_VIET}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_TYPE_NAME_VIET}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_NM}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_NM_ENG}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_NM_KOR}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.BUYER_NM}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.TAX_CD}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.EMAIL}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.BANK_NM}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.ACCOUNT_NUM}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.TEL}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.FAX}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.OWNER_NM}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.BRN}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.BUSINESS_TYPE}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.KIND_BUSINESS}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.NOTE}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.ADDRESS}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.CUSTOMER_RECEIVE}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.ADDRESS_RECEIVE}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.TAX_CD_RECEIVE}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-right">
                                    {item.PAYMENT_TERM}
                                  </td>

                                  {/* <th
                                      scope="col"
                                      onClick={() => handleDelete(item.id)}
                                      className="delete_buttonmodal cursor-pointer p-4 text-left text-xl font-semibold text-red-400 tracking-wider hover:text-red-600 transition duration-75"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </th> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {customerList.length === 0 ? (
                      <Error404 />
                    ) : (
                      <>
                        <Pagination
                          currentPage={currentPage}
                          totalItems={customerList.length}
                          handlePageChange={paginate}
                          itemsPerPage={itemsPerPage}
                        />
                        <DeleteModal
                          deleteId={deleteId}
                          isDelete={childToParent}
                          type="heritage"
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
