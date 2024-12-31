import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function DashAllProducts() {
  const [products, setProducts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentUser._id]);

  const fetchProducts = async (query = "", start = 0) => {
    try {
      const res = await fetch(
        `/api/product/search?q=${query.trim()}&start=${start}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          start === 0 ? data.products : [...prev, ...data.products]
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
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShowMore = () => {
    fetchProducts(searchQuery, products.length);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchProducts(query);
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/product/delete/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((prod) => prod._id !== deleteId));
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-3 my-4 w-full">
      <div className="px-4">
        <input
          type="text"
          placeholder="Search products by name or brand"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {
        searchQuery && (
          <p className="px-4 text-xl">{products.length} results!</p>)
      }
      <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && products.length > 0 ? (
          <>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date Added</Table.HeadCell>
                <Table.HeadCell>Cover Image</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Brand</Table.HeadCell>
                <Table.HeadCell>Stock</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {products.map((prod) => (
                  <Table.Row
                    key={prod._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {new Date(prod.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="md:w-14 md:h-14 w-12 h-12 rounded-md object- bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white truncate">
                      <Link to={`/product/${prod._id}`}>
                        {truncateText(prod.name, 6)}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {prod.brand}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {prod.quantity}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      <Link to={`/product/edit/${prod._id}`}>
                        <span>
                          <MdEdit
                            className="cursor-pointer"
                            color="blue"
                            size={"1.5em"}
                          />
                        </span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setDeleteId(prod._id);
                        }}
                      >
                        <MdDelete
                          className="cursor-pointer"
                          color="red"
                          size={"1.5em"}
                        />
                      </span>
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
        ) : (
          <h2 className="text-center py-16 text-xl sm:text-3xl md:text-4xl">
            You have 0 products!!
          </h2>
        )}
        <Modal
          show={showModal}
          size="md"
          onClose={() => setShowModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this user?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteProduct}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default DashAllProducts;
