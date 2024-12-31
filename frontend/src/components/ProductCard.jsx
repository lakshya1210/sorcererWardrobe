import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";

function ProductCard({ prod }) {
  return (
    <div className="flex flex-col">
      <Link to={`/product/${prod._id}`} className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div
          className="w-full h-80 flex items-center"
        >
          <img
            src={prod.images[0]}
            className="object-cover w-full h-full rounded-t-lg"
            alt={prod.name}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
          <AddToCartButton productId={prod._id} 
            className="bg-black px-4 py-2 flex justify-center items-center text-white rounded-full hover:bg-blue-600 transition-all duration-200"
           />
        </div>
      </Link>
      <h3 className="mt-2 text-lg font-medium line-clamp-2">{prod.name}</h3>
      <h5 className="text-base truncate">{prod.brand}</h5>
      <p className="text-lg font-medium truncate"> <span>₹</span>{prod.price}</p>
    </div>
  );
}

export default ProductCard;
