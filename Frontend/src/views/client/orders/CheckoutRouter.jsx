import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const CheckoutRouter = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  if (result) {
    return <OrderSuccessPage result={result} onGoHome={() => navigate("/")} />;
  }

  return <CheckoutPage onSuccess={(data) => setResult(data)} />;
};

export default CheckoutRouter;
