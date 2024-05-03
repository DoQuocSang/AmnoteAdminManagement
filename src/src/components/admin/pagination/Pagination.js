import { faAngleLeft, faAngleRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 6;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = currentPage - halfMaxPages;
    let endPage = currentPage + halfMaxPages;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxPagesToShow;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li>
          <a
            key={i}
            class={
              i === currentPage
                ? "mx-1 flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-500 p-0 text-sm shadow-md transition duration-150 ease-in-out hover:bg-gray-100"
                : "mx-1 flex h-9 w-9 items-center justify-center rounded-md border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-gray-100"
            }
            onClick={() => handlePageChange(i)}
          >
            {i}
          </a>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-500">
          Trang <span className="text-teal-500">{currentPage}</span>/
          {totalPages}
        </p>
      </div>

      <div class="grid place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
        <nav>
          <ul class="flex">
          <li>
              <a
                class="mx-1 flex h-9 px-2 items-center justify-center rounded-md border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => handlePageChange(1)}
              >
                <span class="text-sm whitespace-nowrap">
                  Trang đầu
                </span>
              </a>
            </li>
            <li>
              <a
                class="mx-1 flex h-9 w-9 items-center justify-center rounded-md border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <span class="material-icons text-sm">
                  <FontAwesomeIcon icon={faAngleLeft} />
                </span>
              </a>
            </li>
            {renderPageNumbers()}
            <li>
              <a
                class="mx-1 flex h-9 w-9 items-center justify-center rounded-md border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              >
                <span class="material-icons text-sm">
                  <FontAwesomeIcon icon={faAngleRight} />
                </span>
              </a>
            </li>
            <li>
              <a
                class="mx-1 flex h-9 px-2 items-center justify-center rounded-md border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => handlePageChange(totalPages)}
              >
                <span class="text-sm whitespace-nowrap">
                  Trang cuối
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
