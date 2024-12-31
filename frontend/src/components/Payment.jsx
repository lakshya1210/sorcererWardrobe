import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = ({ amount, products, address, className='' }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const loadRazorpay = async (e) => {
    e.preventDefault()
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const productDetails = products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const res2 = await fetch("/api/order/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: `${currentUser._id}`,
        products: productDetails,
        address: address,
        total_amount: amount,
        currency: "INR",
      }),
    });
    const data = await res2.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount.toString(),
      currency: data.currency,
      name: "Sorcerer's Wardrobe",
      order_id: data.orderId,
      handler: async (response) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;
          const verifyRes = await fetch("/api/order/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          }),
        }); 
        
        if (verifyRes.ok) {
          navigate("/orders");
        } else {
          const errorData = await verifyRes.json();
          return toast.error('Payment verification failed:', errorData);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  return (
    <button className={`px-6 py-2 bg-yellow-300 rounded-md ${className}`} onClick={loadRazorpay}>
      Pay with Razorpay
    </button>
  );
};

export default Payment;
