import React, { useContext } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";

const Explore = () => {

  const {categories} = useContext(AppContext);

  return (
    <div className="explore-container text-light">
      <div className="left-column">
        <div className="first-row" style={{ overflow: "auto" }}>
          category
        </div>

        <hr className="horizontal-line" />

        <div className="second-row" style={{ overflow: "auto" }}>
          items
        </div>
      </div>

      <div className="right-column d-flex flex-column">
        <div className="customer-form-container" style={{ height: "15%" }}>
          Customer form
        </div>

        <hr className="my-3 text-light  " />

        <div
          className="cart-items-container"
          style={{ height: "55%", overflowY: "auto" }}
        >
          cart items
        </div>

        <div className="cart-summary-container" style={{ height: "30%" }}>
          cart summary
        </div>
      </div>
    </div>
  );
};

export default Explore;
