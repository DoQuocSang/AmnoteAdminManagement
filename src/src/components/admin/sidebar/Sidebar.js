import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBank, faBook, faCalendar, faChartColumn, faCoins, faComment, faCube, faMountainSun, faTags, faTicket, faToolbox } from "@fortawesome/free-solid-svg-icons";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import DesignIllustration from "images/stats-illustration.svg";


export default () => {
   const [activeBtn, setActiveBtn] = useState(1);

   const location = useLocation().pathname; // React Hook
   //console.log();

   useEffect(() => {
      if (location.includes('customer')) {
         setActiveBtn(2)
      }
      if (location.includes('bank')) {
         setActiveBtn(3)
      }
      if (location.includes('unit-code')) {
         setActiveBtn(4)
      }
      if (location.includes('material-code')) {
         setActiveBtn(5)
      }
   }, [])

   return (
      <>
         <aside id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75" aria-label="Sidebar">
            <div className="relative flex-1 flex flex-col min-h-0 bg-white pt-0 border border-l border-gray-200">
               <div className="flex-1 flex flex-col pt-0 pb-0 px-0 overflow-y-auto">
                  <div className="flex-1 px-3 py-6 bg-white divide-y space-y-1 rounded-lg">
                     <ul className="space-y-2 pb-3 px-3">
                        <li>
                           <form action="#" method="GET" className="lg:hidden">
                              <label for="mobile-search" className="sr-only">Tìm kiếm</label>
                              <div className="relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                    </svg>
                                 </div>
                                 <input type="text" name="email" id="mobile-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:ring-cyan-600 block w-full pl-10 p-2.5" placeholder="Tìm kiếm" />
                              </div>
                           </form>
                        </li>
                        <li>
                           <Link to="/dashboard" onClick={() => setActiveBtn(1)}>
                              <p className={activeBtn === 1 ? "text-sm text-white font-semibold rounded-lg bg-red-400 hover:bg-red-500 flex items-center p-2 group transition duration-75" : "text-sm text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group transition duration-75"}>
                                 <svg className={activeBtn === 1 ? "w-5 h-5 text-white flex-shrink-0 transition duration-75" : "w-5 h-5 text-red-500 flex-shrink-0 group-hover:text-red-600 transition duration-75"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                 </svg>
                                 <span className="ml-3">
                                    Quản lý chung
                                 </span>
                              </p>
                           </Link>
                        </li>
                        <li>
                           <Link to="/dashboard/all-customer" onClick={() => setActiveBtn(2)}>
                              <p target="_blank" className={activeBtn === 2 ? "text-sm text-white font-semibold rounded-lg bg-red-400 hover:bg-red-500 flex items-center p-2 group transition duration-75" : "text-sm text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group transition duration-75"}>
                                 <svg className={activeBtn === 2 ? "w-5 h-5 text-white flex-shrink-0 transition duration-75" : "w-5 h-5 text-amber-500 flex-shrink-0 group-hover:text-amber-600 transition duration-75"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <FontAwesomeIcon icon={faUser} />
                                 </svg>
                                 <span className="ml-3 flex-1 whitespace-nowrap">
                                    Khách hàng
                                 </span>
                                 {/* <span className="bg-gray-200 text-gray-800 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">Pro</span> */}
                              </p>
                           </Link>
                        </li>
                        <li>
                           <Link to="/dashboard/all-bank" onClick={() => setActiveBtn(3)}>
                              <p className={activeBtn === 3 ? "text-sm text-white font-semibold rounded-lg bg-red-400 hover:bg-red-500 flex items-center p-2 group transition duration-75" : "text-sm text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group transition duration-75"}>
                                 <svg className={activeBtn === 3 ? "w-5 h-5 text-white flex-shrink-0 transition duration-75" : "w-5 h-5 text-emerald-400 flex-shrink-0 group-hover:text-emerald-500 transition duration-75"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <FontAwesomeIcon icon={faBank} />
                                 </svg>
                                 <span className="ml-3 flex-1 whitespace-nowrap">Ngân hàng</span>
                              </p>
                           </Link>
                        </li>
                        <li>
                           <Link to="/dashboard/all-unit-code" onClick={() => setActiveBtn(4)}>
                              <p className={activeBtn === 4 ? "text-sm text-white font-semibold rounded-lg bg-red-400 hover:bg-red-500 flex items-center p-2 group transition duration-75" : "text-sm text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group transition duration-75"}>
                                 <svg className={activeBtn === 4 ? "w-5 h-5 text-white flex-shrink-0 transition duration-75" : "w-5 h-5 text-cyan-400 flex-shrink-0 group-hover:text-cyan-500 transition duration-75"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <FontAwesomeIcon icon={faCoins} />
                                 </svg>
                                 <span className="ml-3 flex-1 whitespace-nowrap">Mã đơn vị tính</span>
                              </p>
                           </Link>
                        </li>
                        <li>
                           <Link to="/dashboard/all-material-code" onClick={() => setActiveBtn(5)}>
                              <p className={activeBtn === 5 ? "text-sm text-white font-semibold rounded-lg bg-red-400 hover:bg-red-500 flex items-center p-2 group transition duration-75" : "text-sm text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group transition duration-75"}>
                                 <svg className={activeBtn === 5 ? "w-5 h-5 text-white flex-shrink-0 transition duration-75" : "w-5 h-5 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition duration-75"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <FontAwesomeIcon icon={faToolbox} />
                                 </svg>
                                 <span className="ml-3 flex-1 whitespace-nowrap">Mã nhóm vật tư</span>
                              </p>
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </aside>
         <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
      </>
   );
}