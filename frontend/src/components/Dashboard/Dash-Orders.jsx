import { Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function DashOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentUser._id, deliveryStatus]);

  const fetchOrders = async (query = "", start = 0) => {
    setLoading(true);
    try {
      const statusQuery =
        deliveryStatus !== "all" ? `&dStatus=${deliveryStatus}` : "";
      const res = await fetch(
        `/api/order/?q=${query.trim()}&start=${start}${statusQuery}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => (start === 0 ? data : [...prev, ...data]));
        setLoading(false);
        if (data.length < 8) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleShowMore = () => {
    fetchOrders(searchQuery, orders.length);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchOrders(query);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setDeliveryStatus(status);
  };

  const handleDeliveryStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchOrders(searchQuery, 0);
        return toast.success("Delivery status updated successfully");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(null);
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
    <div className="w-full p-4 min-h-screen flex justify-center items-center">
      <Spinner />
      <p className="ml-2 text-2xl">Loading...</p>
    </div>;
  }

  if (!loading && orders.length === 0) {
    <div className="w-full p-4 min-h-screen flex justify-center items-center">
      <p className="ml-2 text-2xl">You have 0 orders!!</p>
    </div>;
  }

  return (
    <div className="flex flex-col gap-3 my-4 w-full">
      <div className="flex flex-col sm:flex-row w-full sm:items-center sm:justify-between p-3">
        <h2 className="text-2xl sm:px-4">All Orders</h2>
        <div className="py-4 sm:py-0 sm:px-4 w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search using Order Id"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="py-4 sm:py-0 sm:px-4 ">
          <select
            value={deliveryStatus}
            onChange={handleStatusChange}
            className="w-full p-2 border rounded cursor-pointer"
          >
            <option value="all">All</option>
            <option value="failed">Failed</option>
            <option value="ordered">Ordered</option>
            <option value="shipped">Shipped</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
      {currentUser.isAdmin && !loading && orders.length > 0 && (
        <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
          <>
            <Table hoverable className="mt-4">
              <Table.Head>
                <Table.HeadCell>Order Date</Table.HeadCell>
                <Table.HeadCell>Order Id</Table.HeadCell>
                <Table.HeadCell>Ordered by</Table.HeadCell>
                <Table.HeadCell>Shipping Address</Table.HeadCell>
                <Table.HeadCell>Items</Table.HeadCell>
                <Table.HeadCell>Amount (in ₹)</Table.HeadCell>
                <Table.HeadCell>Delivery Status</Table.HeadCell>
                <Table.HeadCell>Payment Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {orders.map((order) => (
                  <Table.Row key={order._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap  text-gray-900 ">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                      {order.order_id}
                    </Table.Cell>
                    <Table.Cell className=" text-gray-900">
                    {order.userId ? order.userId.email : "Deleted User"}
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
                      <select
                        value={order.deliveryStatus}
                        onChange={(e) =>
                          handleDeliveryStatusUpdate(order._id, e.target.value)
                        }
                        disabled={updatingStatus === order._id}
                        className="border rounded p-2 cursor-pointer"
                      >
                        <option value="failed" className="text-red-500">
                          Failed
                        </option>
                        <option value="ordered" className="text-blue-500">
                          Ordered
                        </option>
                        <option value="shipped" className="text-yellow-300">
                          Shipped
                        </option>
                        <option
                          value="out for delivery"
                          className="text-green-300"
                        >
                          Out for Delivery
                        </option>
                        <option value="delivered" className="text-green-500">
                          Delivered
                        </option>
                      </select>
                    </Table.Cell>
                    <Table.Cell className=" text-green-500">
                      {order.status}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showMore && (
              <button
                className="mt-4 self-center w-full text-teal-400"
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </>
        </div>
      )}
    </div>
  );
}

export default DashOrders;
