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
import DeleteModal from "../../../components/admin/modal/DeleteModal";
import Pagination from "../../../components/admin/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import LoadingApiGif from "../../../images/loading-api-color.gif";
import { useDispatch } from "react-redux";
import { getAllUnitCode } from "services/UnitCodeRepository";

export default () => {
  document.title = "Quản lý mã đơn vị tính";

  const navigate = useNavigate();

  const [unitCodeList, setUnitCodeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showLoading, setShowLoading] = useState(true);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [unitCodesToDelete, setUnitCodesToDelete] = useState([]);

  // Tính thông số phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = unitCodeList.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Xử lý khi bấm xóa bên component con DeleteModal
  const childToParent = (isDelete) => {
    if (isDelete === true && unitCodesToDelete.length > 0) {
      const filteredUnitCodes = unitCodeList.filter(
        (unitCode) => !checkedItems[unitCode.UNIT_CD]
      );
      setUnitCodeList(filteredUnitCodes);
      const resetCheckedItems = {};
      filteredUnitCodes.forEach((unitCode) => {
        resetCheckedItems[unitCode.UNIT_CD] = false;
      });
      setCheckedItems(resetCheckedItems);
    }
    // console.log(unitCodeList.length);
  };

  const handleRowClick = (data) => {
    // dispatch(setData(data));
    sessionStorage.setItem('editItem', JSON.stringify(data));
    navigate(`/dashboard/update-unit-code/${data.UNIT_CD}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Xử lý logic
    getAllUnitCode().then((data) => {
      if (data) {
        setUnitCodeList(data.result.slice().reverse());

        // Checkbox
        const initialCheckedItems = {};
        data.result.slice().reverse().forEach((unitCode) => {
          initialCheckedItems[unitCode.UNIT_CD] = false;
        });
        setCheckedItems(initialCheckedItems);
        // console.log(initialCheckedItems);
      } else {
        setUnitCodeList([]);
      }
      setShowLoading(false);
      // console.log(data.result);
    });
  }, []);

  const handleCheckboxChange = (UNIT_CD) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [UNIT_CD]: !prevCheckedItems[UNIT_CD],
    }));
  };

  const handleDelete = () => {
    const unitCodes = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    setUnitCodesToDelete(unitCodes);
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
                    Quản lý mã đơn vị tính
                  </h3>
                  <span className="text-base font-normal text-gray-500">
                    Các mã đơn vị tính hiện có trong database
                  </span>
                </div>
                <div className="flex-shrink-0"></div>
                <div className="flex-shrink-0">
                  {/* section xóa */}
                  <div
                    className={
                      toggleDelete
                        ? "flex justify-center items-center gap-2"
                        : "hidden flex justify-center items-center gap-2"
                    }
                  >
                    <a
                      onClick={handleDelete}
                      className="delete_buttonmodal cursor-pointer hidden transition duration-300 sm:inline-flex text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
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
                  </div>

                  {/* Section thêm + toggle xóa */}
                  <div
                    className={
                      toggleDelete
                        ? "hidden flex justify-center items-center gap-2"
                        : "flex justify-center items-center gap-2"
                    }
                  >
                    <Link to="/dashboard/add-unit-code">
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
                                  Mã đơn vị
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 whitespace-nowrap text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                  Đơn vị
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {currentItems.map((item, index) => (
                                <tr
                                  onClick={
                                    toggleDelete ? () => {} : () => handleRowClick(item)
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
                                          class="relative flex cursor-pointer items-center rounded-full"
                                          data-ripple-dark="true"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={
                                              checkedItems[item.UNIT_CD]
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                item.UNIT_CD
                                              )
                                            }
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
                                    {item.UNIT_CD}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm">
                                    {item.UNIT_NM}
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
                    {unitCodeList.length === 0 ? (
                      <Error404 />
                    ) : (
                      <>
                        <Pagination
                          currentPage={currentPage}
                          totalItems={unitCodeList.length}
                          handlePageChange={paginate}
                          itemsPerPage={itemsPerPage}
                        />
                        <DeleteModal
                          isDelete={childToParent}
                          deleteItems={unitCodesToDelete}
                          type="unit-code"
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