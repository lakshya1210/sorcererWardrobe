import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [firebaseImageUrls, setFirebaseImageUrls] = useState([]);
  const navigate = useNavigate();
  const { prodId } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/category/getCategories`);
        const data = await res.json();
        if (res.ok) {
          setAllCategories(data);
          setLoading(false);
        } else {
          setLoading(false);
          console.log(data.msg);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${prodId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setSelectedCategories([...selectedCategories, ...data.categories]);
          setFirebaseImageUrls([...firebaseImageUrls, ...data.images]);
          setLoading(false);
        } else {
          setLoading(false);
          console.log(data.msg);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchAllCategories();
    fetchProduct();
  }, [prodId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleCategoryChange = (cat) => {
    const index = selectedCategories.indexOf(cat);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, cat]);
    } else {
      const updatedCategories = [...selectedCategories];
      updatedCategories.splice(index, 1);
      setSelectedCategories(updatedCategories);
    }
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    const imageArr = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (!file.type.startsWith("image/")) {
        return toast.error("Selected file must be an image");
      }
      if (file.size >= 2 * 1024 * 1024) {
        return toast.error("Image size must be less than 2mb");
      }
      imageArr.push(file);
    }
    setImages([...images, ...imageArr]);
  };

  useEffect(() => {
    if (images.length > 0) {
      uploadImages();
    }
  }, [images]);

  const uploadImages = async () => {
    setImageUploading(true);
    const storage = getStorage(app);
    const uploadedImageUrls = [];
    const promises = [];

    for (let i = 0; i < images.length; i++) {
      let imageFile = images[i];
      let fileName = `product_images/${new Date().getTime()}` + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
              setImageUploadProgress(null);
              setImages([]);
              setFirebaseImageUrls([...firebaseImageUrls]);
              setImageUploading(false);
              reject(
                toast.error(
                  "Failed to upload image. Image must be less than 2mb."
                )
              );
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadUrl) => {
                  uploadedImageUrls.push(downloadUrl);
                  resolve();
                })
                .catch((error) => {
                  setImageUploadProgress(null);
                  setImages([]);
                  setFirebaseImageUrls([...firebaseImageUrls]);
                  setImageUploading(false);
                  reject(
                    toast.error("Failed to get download URL for the image.")
                  );
                });
            }
          );
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        setImageUploadProgress(null);
        setImageUploading(false);
        setImages([]);
        setFirebaseImageUrls((prev) => [...prev, ...uploadedImageUrls]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          images: [
            ...(prevFormData.images || [...firebaseImageUrls]),
            ...uploadedImageUrls,
          ],
        }));
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      return toast.error("Please select atleast 1 category!");
    }
    if (imageUploading) {
      return toast.warning("Please wait for image to upload");
    }
    try {
      const res = await fetch(`/api/product/update/${prodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, categories: selectedCategories }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product added successfully!");
        navigate(`/product/${data._id}`);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spinner size={"xl"} />
        <span className="ml-2">Loading</span>
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <span className="ml-2 text-red-500">No product found!</span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-red-100 flex items-center flex-col">
      <h2 className="text-xl md:text-3xl mb-4 p-2 ">Edit product</h2>
      <form className="w-full max-w-2xl" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-2 ">
            <Label>Name</Label>
            <TextInput
              id="name"
              defaultValue={product.name}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="p-2 ">
            <Label>Price (in ₹)</Label>
            <TextInput
              id="price"
              defaultValue={product.price}
              required
              type="number"
              onChange={handleInputChange}
            />
          </div>
          <div className="p-2 ">
            <Label>Brand</Label>
            <TextInput
              id="brand"
              defaultValue={product.brand}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="p-2 ">
            <Label>Quantity in Stock</Label>
            <TextInput
              type="number"
              defaultValue={product.quantity}
              required
              id="quantity"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="p-2 col-span-2">
          <Label>Description</Label>
          <Textarea
            id="description"
            defaultValue={product.description}
            required
            rows={4}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-2 col-span-2">
          <Label>Select Categories</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {allCategories &&
              allCategories.length > 0 &&
              allCategories.map((cat) => (
                <div key={cat._id} className="mb-2">
                  <Checkbox
                    id={`category_${cat._id}`}
                    value={cat.name}
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  <Label
                    htmlFor={`category_${cat._id}`}
                    className="ml-2 cursor-pointer"
                  >
                    {cat.name}
                  </Label>
                </div>
              ))}
          </div>
        </div>
        <div className="p-2 col-span-2 flex flex-col gap-3">
          <Label>Upload images</Label>
          <input type="file" multiple onChange={handleImageChange} />
          <div className=" grid w-full grid-cols-2 sm:grid-cols-3 ">
            {firebaseImageUrls &&
              firebaseImageUrls.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`image_${index}`}
                  className="w-40 h-40 object-contain mr-2 mb-2 mx-auto"
                />
              ))}
            {imageUploading && <Spinner size={"sm"} />}
          </div>
        </div>
        <Button
          type="submit"
          className="mx-auto w-full max-w-min px-8 tracking-wider col-span-2"
          gradientDuoTone={"purpleToBlue"}
          disabled={imageUploading}
        >
          {imageUploading ? "Uploading.." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default EditProduct;
