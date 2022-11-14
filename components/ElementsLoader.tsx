import React from "react";
import FancyRender from "./UI/FancyRender";

const ElementsLoader = (props) => (
  <FancyRender>
    <div style={{ textAlign: "center", color: "gray" }}>
      <h2>Loading...</h2>
    </div>
    <img src="/img/imgnotfound.png"></img>
  </FancyRender>
);

export default ElementsLoader;
