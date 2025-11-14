import React from "react";
import { assets } from "../../assets/assets";
const NotFound = () => {
  return (
      <div className="row">
        <div className="col-md-12">
          <img
            src={assets?.notFound}
            alt="not found"
            className="img-fluid object-fit-cover"
            style={{width: "100vw", height: "100vh"}}
          />
        </div>
      </div>
  );
};

export default NotFound;
