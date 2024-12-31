import React, { useEffect, useState } from "react";
import { Footer } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiOutlineLocationMarker, HiPhone } from "react-icons/hi";

function Footerr() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/getCategories?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          console.log(data.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [navigate]);

  return (
    <Footer className="bg-[#f9f9f9] py-10">
  <div className="w-full grid grid-cols-4 gap-10 px-10">
    {/* Information Section */}
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Information</h2>
      <ul className="gap-3 flex flex-col text-[#878787]">
        <li className="text-base cursor-pointer hover:text-teal-400">About Us</li>
        <li className="text-base cursor-pointer hover:text-teal-400">Contact Us</li>
        <li className="text-base cursor-pointer hover:text-teal-400">Privacy Policy</li>
        <li className="text-base cursor-pointer hover:text-teal-400">Terms & Conditions</li>
      </ul>
    </div>

    {/* Useful Links Section */}
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Useful Links</h2>
      <ul className="gap-3 flex flex-col text-[#878787]">
        <Link to={"/dashboard?tab=profile"} className="text-base cursor-pointer hover:text-teal-400">
          My Account
        </Link>
        <Link to={'/orders'} className="text-base cursor-pointer hover:text-teal-400">
          My Orders
        </Link>
        <li className="text-base cursor-pointer hover:text-teal-400">FAQs</li>
        <li className="text-base cursor-pointer hover:text-teal-400">FAQs 2</li>
      </ul>
    </div>

    {/* Categories Section
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Categories</h2>
      <ul className="gap-3 flex flex-col text-[#878787]">
        {categories &&
          categories.length > 0 &&
          categories.map((cat) => (
            <li key={cat._id} className="text-base cursor-pointer hover:text-teal-400">
              <Link to={`/collections/${cat.name}`}>{cat.name}</Link>
            </li>
          ))}
      </ul>
    </div> */}

    {/* Shoppers Section */}
    <div className="flex flex-col gap-5 items-end">
      <Link to={"/"} className="text-2xl font-semibold pr-5">Shoppers</Link>
      <div className="flex flex-col gap-6 text-[#878787] text-sm">
        <p className="flex items-center gap-1">
          <HiOutlineLocationMarker size={"35"} />
          <span>India</span>
        </p>
        <p className="flex items-center gap-1">
          <HiMail size={"25"} />
          <span>contact@me.com</span>
        </p>
        <p className="flex items-center gap-1">
          <HiPhone size={"25"} />
          <span>+999 8887776</span>
        </p>
      </div>
    </div>
  </div>
</Footer>


  );
}

export default Footerr;
