import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashCard from "../DashCard";
import { HiUserGroup } from "react-icons/hi";
import { IoReceipt } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";
import SalesChart from "../SalesChart";

function DashDashboard() {
  const [users, setUsers] = useState();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState();
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [view, setView] = useState("monthly");

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getAllUsers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.totalUsers);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/order?limit=0`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
        calculateSales(data);
        calculateMonthlySales(data);
        calculateDailySales(data);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSales = (orders) => {
    const totalSales = orders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    setSales(totalSales);
  };

  const calculateMonthlySales = (orders) => {
    const monthlySales = {};
    
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = `${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }
      monthlySales[month] += order.total_amount;
    });

    const salesDataArray = Object.keys(monthlySales)
      .map((month) => ({
        date: month,
        totalSales: monthlySales[month],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setSalesData(salesDataArray);
  };

  const calculateDailySales = (orders) => {
    const dailySalesData = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Filter orders for the current month
    const ordersForCurrentMonth = orders.filter((order) => {
      const date = new Date(order.createdAt);
      return (date.getFullYear() === currentYear && date.getMonth() === currentMonth);
    });

    // Calculate sales for each day in the current month
    ordersForCurrentMonth.forEach((order) => {
      const date = new Date(order.createdAt);
      const day = `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;

      if (!dailySalesData[day]) {
        dailySalesData[day] = 0;
      }
      dailySalesData[day] += order.total_amount;
    });

    // Convert dailySalesData object to array
    const dailySalesArray = Object.keys(dailySalesData).map((day) => ({
      date: day,
      totalSales: dailySalesData[day],
    }));

    // Sort array by date
    dailySalesArray.sort((a, b) => {
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateA - dateB;
    });

    setDailySales(dailySalesArray);
  };

  return (
    <div className="container my-8 px-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashCard
          title="Total Users"
          value={users}
          icon={<HiUserGroup size={"30"} />}
          linkk={"/dashboard?tab=users"}
        />
        <DashCard
          title="Total Orders"
          value={orders.length}
          icon={<IoReceipt size={"25"} />}
          linkk={"/dashboard?tab=orders"}
        />
        <DashCard
          title="Total Sales"
          value={`₹${sales}`}
          icon={<GrMoney size={"25"} />}
        />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <SalesChart salesData={dailySales} title={"Daily Sales"} />
        <SalesChart salesData={salesData} title={"Monthly Sales"} />
      </div>
    </div>
  );
}

export default DashDashboard;
