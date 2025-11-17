import React from "react";

const Loading = () => {
  return (
    <main className="vh-100 d-flex justify-content-center align-items-center gap-2">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <p>Verifying your session...</p>
    </main>
  );
};

export default Loading;
