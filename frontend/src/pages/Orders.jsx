import { Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/order?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
        setLoading(false);
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 my-10">
        <h1 className="text-2xl py-4">Your Orders</h1>
        <h3 className="text-center my-10 text-2xl">No orders yet !</h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 my-10">
      <h1 className="text-2xl py-4">Your Orders</h1>

      <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        <>
          <Table hoverable className="mt-4">
            <Table.Head>
              <Table.HeadCell>Order Date</Table.HeadCell>
              <Table.HeadCell>Order Id</Table.HeadCell>
              <Table.HeadCell>Shipping Address</Table.HeadCell>
              <Table.HeadCell>Items</Table.HeadCell>
              <Table.HeadCell>Amount (in ₹)</Table.HeadCell>
              <Table.HeadCell>Delivery Status</Table.HeadCell>
              <Table.HeadCell>Payment Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {!loading &&
                orders &&
                orders.length > 0 &&
                orders.map((order) => (
                  <Table.Row key={order._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap  text-gray-900 ">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {order.order_id}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {`${order.address.addressLine1}, ${order.address.addressLine2}, ${order.address.addressLine3}, ${order.address.pincode}`}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {order.products
                        .map((prod) => truncateText(prod.productId.name, 5))
                        .join(", ")}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {order.total_amount}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {order.deliveryStatus}
                    </Table.Cell>
                    <Table.Cell className=" text-green-500">
                      {order.status}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </>
      </div>
    </div>
  );
};

export default Orders;
