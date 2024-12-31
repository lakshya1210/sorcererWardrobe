import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Label,
  Modal,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashCategory() {
  const [addCategory, setAddCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const nameRef = useRef(null);
  const [editName, setEditName] = useState("");
  const [oldName, setOldName] = useState("")

  const addCategoryFunc = async () => {
    try {
      if (!addCategory) {
        return toast.error("Please add category name");
      }
      const res = await fetch(`/api/category/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addCategory }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddCategory("");
        setAllCategories([...allCategories, data]);
        return toast.success("New category added");
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/category/getCategories`);
        const data = await res.json();
        if (res.ok) {
          setAllCategories(data);
          setLoading(false);
        } else {
          setLoading(false);
          return toast.error(data.msg);
        }
      } catch (error) {
        setLoading(false);
        return toast.error(error.message);
      }
    };
    fetchAll();
  }, [currentUser._id]);

  const handleDeleteCategory = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/category/delete/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setAllCategories((prev) => prev.filter((cat) => cat._id !== deleteId));
        return toast.success(data);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleUpdateCategory = async () => {
    setUpdateModal(false);
    try {
      if (!editName) {
        return toast.error("Please provide category name");
      }
      const res = await fetch(`/api/category/update/${updateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: editName, oldName: oldName }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditName("");
        setOldName("")
        setAllCategories((prev) =>
          prev.map((cat) => (cat._id === updateId ? data : cat))
        );
        return toast.success("Category updated successfully");
      } else {
        return data.msg;
      }
    } catch (error) {
      setEditName("");
      setOldName("")
      return toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-3xl mx-auto p-1 md:p-3">
      <h1 className="text-4xl my-7">Categories</h1>
      <div className="flex flex-col gap-8">
        <div className="p-3 border border-gray-200 bg-white rounded-lg">
          <h3 className="text-xl mb-4 p-2">Add new category</h3>
          <div className="flex mb-2">
            <input
              type="text"
              className="w-full rounded-e-none rounded-s-lg border-none bg-gray-100"
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value.trim())}
            />
            <Button
              className="rounded-r-lg rounded-l-none"
              gradientDuoTone={"purpleToBlue"}
              onClick={addCategoryFunc}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="p-3 rounded-lg">
          <h3 className="text-2xl md:text-3xl text-center mb-4 p-2">
            All categories
          </h3>
          <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && allCategories.length > 0 && (
              <>
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Date Created</Table.HeadCell>
                    <Table.HeadCell>Category Name</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {allCategories.map((cat) => (
                      <Table.Row key={cat._id}>
                        <Table.Cell>
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>{cat.name}</Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setUpdateModal(true);
                              setOldName(cat.name)
                              setUpdateId(cat._id);
                            }}
                          >
                            <MdEdit
                              className="cursor-pointer"
                              color="blue"
                              size={"1.5em"}
                            />
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setDeleteId(cat._id);
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
              </>
            )}
            {allCategories.length === 0 && loading && (
              <div className="text-center py-8 text-xl sm:text-3xl md:text-4xl">
                <Spinner />
                Loading...
              </div>
            )}
            {allCategories.length === 0 && !loading && (
              <div className="text-center py-8 text-xl sm:text-3xl md:text-4xl">
                No categories added
              </div>
            )}
          </div>
        </div>
      </div>

      {/* delete modal */}
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
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCategory}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* update modal */}
      <Modal
        show={updateModal}
        size="md"
        popup
        onClose={() => setUpdateModal(false)}
        initialFocus={nameRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Please enter the new name
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Category name" />
              </div>
              <TextInput
                id="name"
                ref={nameRef}
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value.trim())}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={handleUpdateCategory}>
                {"Update"}
              </Button>
              <Button color="gray" onClick={() => setUpdateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashCategory;
