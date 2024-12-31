import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import MenImage from "../assets/Men.jpg";
import WomenImage from "../assets/Women.jpg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    fetchProducts();
  }, []);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/category/getCategories`);
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data);
        setLoading(false);
      } else {
        setLoading(false);
        console.log(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const fetchProducts = async (start = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/product/search?start=${start}`);
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          (start = 0) ? data.products : [...prev, ...data.products]
        );
        if (
          data.products.length < 8 ||
          start + data.products.length >= data.totalProducts
        ) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    fetchProducts(products.length);
  };

  const settings = {
    dots: false,
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

  const settings2 = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full sm:px-3 px-2 m-0 mx-auto ">
      <div>
        <Slider {...settings}>
          <Link to={"/collections/Men"} className="w-full h-full ">
            <img src={MenImage} alt="" className="w-full h-full object-cover" />
          </Link>
          <Link to={"/collections/Women"} className="w-full h-full">
            <img
              src={WomenImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </Link>
        </Slider>
      </div>
      <div className="mt-10 sm:px-4">
        <h2 className="text-2xl">Shop by Categories</h2>
        <div className="mt-8 px-2">
          <Slider {...settings2} className="">
            {allCategories &&
              allCategories.length > 0 &&
              allCategories.map((cat, index) => (
                <Link
                  to={`/collections/${cat.name}`}
                  key={index}
                  className="bg-white border-2 hover:bg-blue-500 hover:text-white transition-all  border-blue-500 custom-circle rounded-full"
                >
                  <h2 className="text-center  text-lg">{cat.name}</h2>
                </Link>
              ))}
          </Slider>
        </div>
      </div>
      <div className="mt-10 sm:px-4 mb-8">
        <h2 className="text-2xl">Recently added</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod, index) => (
            <ProductCard key={index} prod={prod} />
          ))}
          
        </div>
        {showMore && (
            <button
              className="mt-4 text-xl self-center w-full text-teal-500 hover:text-teal-400"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
      </div>
    </div>
  );
}

export default Home;
