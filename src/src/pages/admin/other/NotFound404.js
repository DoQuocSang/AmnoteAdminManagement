import React, { useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import CatDefault from "images/cat-404-full-2.png";

export default () => {
  document.title = 'Không tìm thấy trang';

  return (
    <AnimationRevealPage>
      <div className="w-screen h-screen flex items-center justify-center">
        <img src={CatDefault}  className="max-w-screen-lg h-auto rounded-lg pt-4 mx-auto mb-10"/>
      </div>
    </AnimationRevealPage>
  );
};
