import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { LuShieldCheck, LuShieldClose } from 'react-icons/lu'
import {MdDelete} from 'react-icons/md'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function DashUsers() {
    const [users, setUsers] = useState([])
    const {currentUser} = useSelector((state) => state.user)
    const [showModal, setShowModal] = useState(false)
    const [showMore, setShowMore] = useState(true)
    const [deleteId, setDeleteId] = useState(null)

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const res = await fetch(`/api/user/getAllUsers`)
                const data = await res.json()
                if(res.ok){
                    setUsers(data.userRes)
                    if(data.userRes.length<9){
                        setShowMore(false)
                    }
                }
                else{
                    return toast.error(data.msg)
                }
            } catch (error) {
                return toast.error(error.message)
            }
        }
        fetchUsers()
    }, [])

    const handleShowMore = async() => {
        const start = users.length
        try {
            const res = await fetch(`/api/user/getAllUsers?start=${start}`)
            const data = await res.json()
            if(res.ok){
                setUsers((prev) => [...prev, ...data.userRes])
                if(data.userRes.length<9 || users.length+data.userRes.length >= data.totalUsers){
                    setShowMore(false)
                }
            }
            else{
                return toast.error(data.msg)
            }
        } catch (error) {
            return toast.error(error.message)
        }
    }


    const handleDeleteUser = async() => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/user/delete/${deleteId}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if(res.ok){
                setUsers((prev) => prev.filter((user) => user._id !== deleteId))
            }
            else{
                return toast.error(data.msg)
            }
        } catch (error) {
            return toast.error(error.message)
        }
    }


  return (
    <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Avatar</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin Rights</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="md:w-12 md:h-12 w-10 h-10 rounded-full object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      @{user.username}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {user.isAdmin ? (<LuShieldCheck color="green" size={'1.5em'} />) : (<LuShieldClose color="red" size={'1.5em'} />)}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setDeleteId(user._id);
                      }}
                    >
                      <MdDelete className="cursor-pointer"  color="red" size={'1.5em'} />
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
          You have 0 active users!!
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
              <Button color="failure" onClick={handleDeleteUser}>
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
  )
}

export default DashUsers