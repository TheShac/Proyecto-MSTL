import React, { useState } from "react";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const CustomerOrdersRouter = () => {
  const [step, setStep] = useState("cart"); // cart | checkout | success
  const [result, setResult] = useState(null);

  if (step === "checkout") {
    return (
      <CheckoutPage
        onSuccess={(data) => {
          setResult(data);
          setStep("success");
        }}
      />
    );
  }

  if (step === "success") {
    return (
      <OrderSuccessPage
        result={result}
        onGoHome={() => setStep("cart")}
      />
    );
  }

  return <CartPage onGoCheckout={() => setStep("checkout")} />;
};

export default CustomerOrdersRouter;
