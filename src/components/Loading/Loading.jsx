import React from "react";

const Loading = () => {
  return (
    <main className="container py-5 mt-5">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Verifying your session...</p>
        </div>
      </div>
    </main>
  );
};

export default Loading;
