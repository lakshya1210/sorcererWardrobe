import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
import { useSelector } from "react-redux";

function SignUp() {
  const [formdata, setFormdata] = useState({});
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formdata.username ||
      !formdata.email ||
      !formdata.password ||
      !cpassword
    ) {
      return toast.error("Please fill out all fields");
    }
    if (formdata.password.length < 6) {
      return toast.error("Password must be atleast 6 characters long");
    }
    if (formdata.password !== cpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registered successfully!')
        navigate("/signin");
        setLoading(false);
      } else {
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
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row items-center justify-center">
        <div className="flex-1 flex flex-col items-center border border-gray-300 p-4 max-w-xl rounded-lg">
          <h2 className="text-center mb-8 text-2xl sm:text-3xl md:text-4xl font-bold">
            Create Account
          </h2>
          <form
            className="flex max-w-md flex-col gap-4 w-full p-3"
            onSubmit={handleSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Your username" />
              </div>
              <TextInput
                id="username"
                type="text"
                required
                shadow
                onChange={handleChange}
              />
            </div>
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cpassword" value="Confirm password" />
              </div>
              <TextInput
                id="cpassword"
                type="password"
                required
                shadow
                onChange={(e) => setCpassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                color={"blue"}
                id="agree"
                onClick={(e) => setCheckbox(!checkbox)}
              />
              <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <Link
                  href=""
                  className="text-blue-600 hover:underline dark:text-cyan-500"
                >
                  terms and conditions
                </Link>
              </Label>
            </div>
            <Button type="submit" disabled={!checkbox} color={"blue"}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Loading..</span>
                </>
              ) : (
                "Create New Account"
              )}
            </Button>
            <OAuth />
          </form>
          <div>
            <span>Already have an account?</span>
            <Link to={"/signin"} className="text-blue-500 ml-2 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
