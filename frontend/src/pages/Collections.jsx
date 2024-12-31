import { Button, Drawer, Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import ReactSlider from "react-slider";
import { CgCloseR } from "react-icons/cg";

function Collections() {
  const { collectionName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/product/search?categories=${collectionName}&limit=0`
        );
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setLoading(false);
          const allCategories = data.products.flatMap(
            (prod) => prod.categories
          );
          const uniqueCategories = [
            ...new Set(allCategories.filter((cat) => cat !== collectionName)),
          ];
          const uniqueBrands = [
            ...new Set(data.products.map((prod) => prod.brand)),
          ];
          setCategories(uniqueCategories);
          setBrands(uniqueBrands);
          const prices = data.products.map((prod) => prod.price);
          const min = Math.floor(Math.min(...prices) / 100) * 100;
          const max = Math.ceil(Math.max(...prices) / 100) * 100;
          setMinPrice(min);
          setMaxPrice(max);
          setSelectedMaxPrice(max);
        } else {
          setLoading(false);
          return toast.error(data.msg);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchProducts();
  }, [collectionName]);

  const applyFilters = () => {
    let filteredProducts = products;

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((prod) =>
        prod.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((prod) =>
        selectedBrands.includes(prod.brand)
      );
    }

    filteredProducts = filteredProducts.filter(
      (prod) => prod.price >= minPrice && prod.price <= selectedMaxPrice
    );

    return filteredProducts;
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMaxPriceChange = (value) => {
    setSelectedMaxPrice(value);
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <p className="mb-2 text-2xl">No products found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto my-10 mb-20 p-2 md:p-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl">Collections</h2>
          <p className="mt-3 md:text-lg lg:text-xl">{collectionName}</p>
        </div>
        <p
          className="mt-3 md:text-lg lg:text-xl self-end cursor-pointer hover:text-blue-600"
          onClick={() => setIsOpen(true)}
        >
          Filters
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {applyFilters().map((prod, index) => (
          <ProductCard key={index} prod={prod} />
        ))}
      </div>

      <Drawer open={isOpen} onClose={handleClose}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-medium my-5">Filters</h2>
          <span className="text-2xl cursor-pointer"  onClick={handleClose}><CgCloseR /></span>
        </div>
        <Drawer.Items>
          <form>
            <div className="mb-6 mt-3">
              {categories.length > 0 && (
                <Label htmlFor="categories" className="mb-2 block">
                  Categories
                </Label>
              )}
              {categories.map((category, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    name={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${index}`}>{category}</label>
                </div>
              ))}
            </div>
            <div className="mb-6">
              {brands.length > 0 && (
                <Label htmlFor="brands" className="mb-2 block">
                  Brands
                </Label>
              )}
              {brands.map((brand, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`brand-${index}`}
                    name={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="mr-2"
                  />
                  <label htmlFor={`brand-${index}`}>{brand}</label>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <Label htmlFor="price-range" className="mb-2 block">
                Price Range
              </Label>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                min={minPrice}
                max={maxPrice}
                defaultValue={maxPrice}
                onChange={handleMaxPriceChange}
                renderThumb={(props, state) => (
                  <div {...props}>{state.valueNow}</div>
                )}
              />
              <div className="flex justify-between mt-2">
                <span>{minPrice}</span>
                <span>{maxPrice}</span>
              </div>
            </div>
            <div className="mb-6">
              <Button
                color={"blue"}
                type="button"
                className="w-full"
                onClick={handleClose}
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </Drawer.Items>
      </Drawer>
    </div>
  );
}

export default Collections;
