import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Header from "components/admin/header/Header"
import Sidebar from "components/admin/sidebar/Sidebar"
import Footer from "../footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Admin(props) {
   const [showScroll, setShowScroll] = useState(false);

   useEffect(() => {
       const handleScroll = () => {
           if (window.pageYOffset > 300) { 
               setShowScroll(true);
           } else {
               setShowScroll(false);
           }
       };

       window.addEventListener('scroll', handleScroll);

       return () => {
           window.removeEventListener('scroll', handleScroll);
       };
   }, []);

   const scrollToTop = () => {
       window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const scrollToEnd = () => {
       window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
   };

   return (
      <div>
         <Header />
         <div className="flex overflow-hidden bg-white pt-16">
            <Sidebar />
            <div id="main-content" className="h-full w-full bg-gray-100 relative overflow-y-auto lg:ml-64">
               <Outlet />
               <Footer />
            </div>
         </div>

         <div className="z-50 fixed bottom-4 right-4 flex flex-col items-center justify-center gap-2">
            {showScroll && (
                <button className="scroll-to-top bg-red-500 w-10 h-10 text-white rounded-lg" onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            )}
            <button className="scroll-to-end bg-red-500 w-10 h-10 text-white rounded-lg" onClick={scrollToEnd}>
            <FontAwesomeIcon icon={faArrowDown} />
            </button>
        </div>

         <script async defer src="https://buttons.github.io/buttons.js"></script>
         <script src="https://demo.themesberg.com/windster/app.bundle.js"></script>
      </div>
   );
}
