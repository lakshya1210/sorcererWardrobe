import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUser, signOut, updateUser } from "../../redux/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [formdata, setFormdata] = useState({});
  const fileRef = useRef();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(false);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      return toast.error("Selected file must be an image");
    }
    if (file.size >= 2 * 1024 * 1024) {
      return toast.error("Image size must be less than 2mb");
    }
    setProfileImage(file);
    setProfileImageUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (profileImage) {
      uploadImage();
    }
  }, [profileImage]);


  const uploadImage = async (e) => {
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = `user_images/${new Date().getTime()}` + profileImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, profileImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadProgress(null);
        setProfileImage(null);
        setProfileImageUrl(null);
        setImageUploading(null);
        return toast.error(
          "Failed to upload image. File must be less than 2mb"
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setProfileImageUrl(downloadUrl);
          setImageUploadProgress(null);
          setFormdata({ ...formdata, profilePicture: downloadUrl });
          setImageUploading(null);
        });
      }
    );
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOut());
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleDeleteUser = async (e) => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteUser());
        toast.success(data);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(Object.keys(formdata).length === 0){
      return toast.error('No changes made!')
    }
    if(imageUploading){
      return toast.warning('Please wait for image to upload')
    }
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formdata)
      })
      const data = await res.json()
      if(res.ok){
        dispatch(updateUser(data))
        return toast.success("Profile updated successfully!")
      }
      else{
        return toast.error(data.msg)
      }
    } catch (error) {
      return toast.error(error.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full relative">
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(52, 147, 220, ${imageUploadProgress/100})`
                },
              }}
            />
          )}
          <img
            src={profileImageUrl || currentUser.profilePicture}
            alt={currentUser.username}
            className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-50"
            } `}
            onClick={() => fileRef.current.click()}
          />
        </div>

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          disabled={imageUploading}
        >
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5 font-semibold">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>

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
              Are you sure you want to delete this account?
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
  );
}

export default DashProfile;
