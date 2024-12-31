import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Payment from "../components/Payment";
import { Button, Spinner, TextInput } from "flowbite-react";
import { updateUser } from "../redux/userSlice";


const ShippingAddress = () => {
  const location = useLocation();
  const { amount, products } = location.state || {};
  const { currentUser } = useSelector((state) => state.user);
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser && currentUser.address) {
      setAddress(currentUser.address);
      setAddressConfirmed(true)
    }
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddressConfirm = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
        const trimmedAddress = {
            addressLine1: address.addressLine1.trim(),
            addressLine2: address.addressLine2.trim(),
            addressLine3: address.addressLine3.trim(),
            pincode: address.pincode,
          };
      
          const isAddressComplete = Object.values(trimmedAddress).every(
            (value) => value !== ""
          );
      
          if (!isAddressComplete) {
            return toast.error("Please fill in all fields.");
          }
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmedAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        setAddressConfirmed(true)
        dispatch(updateUser(data))
        return toast.success("Saved shipping address");
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  };

  return (
    <div className="w-full max-w-2xl py-6 sm:py-10 p-4 mx-auto">
      <h1 className="text-2xl py-4 mb-4">Your shipping address</h1>
      <form className="bg-white p-2">
        <div className="flex flex-col gap-2 mt-1 px-1 p-3">
          <label htmlFor="addressLine1" className="text-lg">
            Flat, House No., Building, Apartment:
          </label>
          <TextInput
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-1 px-1 md:p-3">
          <label htmlFor="addressLine2" className="text-lg">
            Area, Street, Sector :
          </label>
          <TextInput
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-1 px-1 md:p-3">
          <label htmlFor="addressLine3" className="text-lg">
            City, State:
          </label>
          <TextInput
            type="text"
            id="addressLine3"
            name="addressLine3"
            value={address.addressLine3}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="mt-1 px-1 md:p-3">
          <label htmlFor="pincode" className="text-lg">
            Pincode:
          </label>
          <TextInput
            className="sm:w-1/4 w-1/2 mt-1"
            type="number"
            id="pincode"
            name="pincode"
            value={address.pincode}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="mt-2 flex flex-col sm:flex-row gap-4  items-center justify-between w-full sm:w-2/3 p-2 sm:p-5">
          <Button color={'blue'} className="w-full" type="button" onClick={handleAddressConfirm} disabled={loading}>
            {loading ? <Spinner /> : "Confirm Address"}
          </Button>
          {/* {addressConfirmed && !loading && <Payment amount={amount} products={products} address={address} className="w-full" />} */}
          {amount && address && !loading && addressConfirmed && (
            <Payment amount={amount} products={products} address={address} className="w-full" />
          )}
        </div>
      </form>
    </div>
  );
};

export default ShippingAddress;
