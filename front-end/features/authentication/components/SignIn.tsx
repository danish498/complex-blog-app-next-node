import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, TLoginSchema } from "@/schema/authSchema";
import { existedUserData } from "../authSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [iconVisible, setIconVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (data: TLoginSchema) => {
    dispatch(existedUserData(data)).then((response) => {
      if (response.payload.success === false) {
        if (response.payload.errors.username) {
          setError("username", {
            type: "server",
            message: response.payload.errors.username,
          });
        }

        if (response.payload.errors.password) {
          setError("password", {
            type: "server",
            message: response.payload.errors.password,
          });
        }
      }
      if (response.payload.success === true) {
        router.push("/");
      }
    });
  };

  return (
    <div className="flex justify-center">
      <div className="container md:w-[600px] mt-9 p-4 mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-medium ">Sign in</h1>
          <Link
            href="/register"
            className="text-sm font-medium leading-7 text-steel-blue-600 hover:underline"
          >
            Need an account?
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div>
              <Input
                className=""
                placeholder="Username"
                {...register("username")}
                autoComplete="off"
              />
              {errors.username && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <div className="relative">
                <Input
                  placeholder="Password"
                  {...register("password")}
                  type={!iconVisible ? "password" : "text"}
                  autoComplete="false"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2"
                  onClick={() => setIconVisible(!iconVisible)}
                >
                  {iconVisible ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            disabled={isSubmitting}
            className="flex mt-4 ml-auto text-xl bg-steel-blue-800 hover:bg-steel-blue-700 dark:text-white "
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
