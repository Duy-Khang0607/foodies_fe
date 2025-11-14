import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import Loading from "../components/Loading/Loading";

const Authentication = ({ children }) => {
  const { user, token, isTokenLoading } = useContext(StoreContext);
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  useEffect(() => {
    // Đợi token loading hoàn tất
    if (isTokenLoading) {
      hasRedirected.current = false;
      return;
    }

    // Nếu thiếu token hoặc user (bất kỳ cái nào), redirect về login ngay lập tức
    // Giống như chức năng logout
    if ((!token || !user) && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/login", { replace: true });
      return;
    }
  }, [token, user, isTokenLoading, navigate]);

  // Hiển thị loading chỉ khi đang token loading
  if (isTokenLoading) {
    return <Loading />;
  }

  // Nếu không có token hoặc không có user, return null ngay (đã redirect)
  if (!token || !user) {
    return null;
  }

  // Render children khi đã authenticated
  return <>{children}</>;
};

export default Authentication;
