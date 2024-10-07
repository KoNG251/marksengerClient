"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import Link from "next/link";
import axios from "axios";
import {PeopleAltRounded} from "@mui/icons-material";
import { Box,TextField } from "@mui/material"

export default function login() {
  const router = useRouter();

  const clickButton = () => {
    router.push("/auth/register");
  };

  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        Notiflix.Report.success(
          "SUCCESS",
          response.data.message,
          "Okay",
          () => {
            document.cookie = `jwt=${response.data.token}; path=/; max-age=43200; Secure; SameSite=Lax`;
            window.location.href = "/home";
          }
        );
      })
      .catch((error) => {
        Notiflix.Report.failure("Faile", error.response.data.message, "Okay");
      });
  };

  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const validateLoginExist = () => {
    const tokenExist = getCookieValue('jwt');
    
    if(tokenExist){
      window.location.href = '/home'
    }
  }

  useEffect(() => {
    validateLoginExist()
  },[])

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="items-center flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-[30rem] h-[40rem] bg-white rounded-md shadow-2xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <PeopleAltRounded style={{ fontSize: 50 }}  />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ">
              Welcome
            </h2>
            <p className="text-center">
                Please enter your details
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
            <form
              action="#"
              method="POST"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="mt-2">
                    <TextField 
                    label="Email Address" 
                    variant="standard" 
                    type="email"
                    className="w-full bg-none" 
                    color="secondary" 
                    onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
              </div>

              <div>
                <div className="mt-2">
                    <TextField 
                    label="Password" 
                    variant="standard" 
                    type="password"
                    className="w-full bg-none" 
                    color="secondary" 
                    onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  id="btn-submit"
                  className="flex w-full justify-center rounded-full bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-300 ease-in-out"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/auth/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
