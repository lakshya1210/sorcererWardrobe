import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddToCartButton from "../components/AddToCartButton";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function Product() {
  const { prodId } = useParams();
  const navigate = useNavigate()
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/product/${prodId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return toast.error(error.message);
      }
    };
    fetchProduct();
  }, [prodId]);

  const handleIncrement = () => {
    if (cartQuantity < 10) {
      setCartQuantity(cartQuantity + 1);
    } else {
      return toast.warning("You can only select up to 10 items.");
    }
  };

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    } else {
      return toast.warning("You must select at least 1 item.");
    }
  };

  const handleProceed = (price, prod, productId) => {
    navigate('/address', {
      state: {
        amount: `${cartQuantity*price}`,
        products: [{prod, productId, quantity: cartQuantity}],
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <p className="mb-2 text-2xl">No product found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mx-auto p-4 max-w-lg sm:max-w-3xl md:max-w-4xl lg:max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-start items-center gap-8 md:gap-12">
        <Slider
          {...settings}
          className="border border-gray-400 rounded-lg overflow-hidden sm:w-1/2 w-full "
        >
          {product &&
            product.images.map((imageUrl, index) => (
              <div
                key={index}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all ease-linear duration-300"
                />
              </div>
            ))}
        </Slider>
        <div className=" sm:w-1/2 w-full ">
          <div className="p-4">
            <h2 className="sm:text-3xl text-2xl border-b-2 py-2">
              {product.name}
            </h2>
            {product && product.quantity > 0 ? (
              <div className="border-b-2 py-2">
                <div className="flex">
                  <span>₹</span>
                  <h2 className="sm:text-3xl text-2xl">{product.price}</h2>
                </div>
                <p className="font-light">Inclusive of all taxes</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mt-2 px-3">
                  <div className="flex sm:w-1/2 w-full items-center mt-4 ">
                    <button
                      onClick={handleDecrement}
                      className="p-3 border border-gray-400 rounded-l-lg"
                    >
                      <FaMinus />
                    </button>
                    <span className="px-5 py-2 border-t border-b border-gray-400">
                      {cartQuantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-3 border border-gray-400 rounded-r-lg"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="sm:w-1/2 w-full flex flex-col gap-4 py-2 sm:p-2">
                    <AddToCartButton
                      productId={product._id}
                      quantity={cartQuantity}
                      className="bg-black px-4 py-2 sm:w-full flex justify-center items-center text-white rounded-lg hover:bg-blue-600 transition-all duration-100"
                    />
                    <button
                    onClick={()=> handleProceed(product.price, product, product._id)}
                      className="bg-black px-4 py-2 flex justify-center items-center text-white rounded-lg hover:bg-blue-600 transition-all duration-100">
                        Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-b-2 py-2">
                <p className="text-red-500 text-xl sm:text-2xl">
                  Out of stock !
                </p>
              </div>
            )}
            <div className="my-2 border-b-2 py-2 flex items-center">
              <h5 className="sm:text-xl text-lg mr-3">Brand:</h5>
              <p className="sm:text-lg text-base">{product.brand}</p>
            </div>
            <div className="my-2 border-b-2 py-2">
              <h5 className="sm:text-xl text-lg">Categories:</h5>
              <div className="flex flex-auto gap-2 py-2">
                {product &&
                  product.categories.map((cat, index) => (
                    <Link
                      key={index}
                      to={`/collections/${cat}`}
                      className="bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {cat}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="my-2 border-b-2 py-2">
              <h5 className="sm:text-xl text-lg mb-1">Description:</h5>
              <p className="sm:text-lg text-base font-light">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
