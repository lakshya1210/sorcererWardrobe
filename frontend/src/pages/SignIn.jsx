import React, { useEffect, useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formdata, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {currentUser} = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.email || !formdata.password) {
      return toast.error("Please provide all fields");
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        dispatch(signIn(data));
        navigate('/')
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      return toast.error(error.message);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 px-5 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1 flex flex-col items-center w-full mx-auto border border-gray-300 p-4 rounded-lg">
          <h2 className="text-center mb-8 text-3xl sm:text-4xl font-bold">
            Sign In
          </h2>
          <form
            className="flex max-w-md flex-col gap-4 w-full p-3"
            onSubmit={handleSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                type="email"
                required
                shadow
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                shadow
                onChange={handleChange}
              />
            </div>
            <Button type="submit" disabled={loading} color={"blue"}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Loading..</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div>
            <span>Don't have an account?</span>
            <Link to={"/signup"} className="text-blue-500 ml-2 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
