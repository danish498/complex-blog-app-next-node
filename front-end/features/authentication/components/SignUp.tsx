import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupSchema, TSignUpSchema } from "@/schema/authSchema";
import { checkUsername } from "../services/signup";
import { createdUser } from "../authSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(SignupSchema),
  });

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [suggestUserName, setSuggestUserName] = useState([]);
  const [iconVisible, setIconVisible] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (data: TSignUpSchema) => {
    dispatch(createdUser(data)).then((response) => {
      if (response.payload.success === false) {
        if (response.payload.errors.email) {
          setError("email", {
            type: "server",
            message: response.payload.errors.email,
          });
        }
      }

      if (response.payload.success === true) {
        router.push("/");
      }
    });
  };

  console.log("check teh error over here", errors);

  const handleUserChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    try {
      const response = await checkUsername(username);
      setIsUsernameAvailable(true);
      setSuggestUserName([]);
    } catch (error) {
      console.log("Error", error);
      setSuggestUserName(error.data.data.suggestedUser);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="container md:w-[600px] mt-9 p-4 mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-medium ">Sign Up</h1>
          <Link
            href="/login"
            className="text-sm font-medium leading-7 text-steel-blue-600 hover:underline"
          >
            Have an account?
          </Link>
        </div>
        <form
          autoComplete="off"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              className=""
              placeholder="Username"
              {...register("username", {
                onChange: handleUserChange,
              })}
              autoComplete="off"
            />
            {errors.username && (
              <p className="text-xs text-red-600 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>

          {suggestUserName.length > 0 && isUsernameAvailable && (
            <div>
              <p className="text-red-500">Username already existed</p>
              <div className="flex flex-row gap-3 ">
                <p>Suggested Username:</p>
                {suggestUserName.map((user, index) => (
                  <p
                    className="text-steel-blue-700 underline underline-offset-2 hover:no-underline hover:cursor-pointer"
                    key={index}
                  >
                    {user}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div>
            <Input
              className=""
              placeholder="Email"
              {...register("email")}
              autoComplete="off"
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">
                {errors.email.message}
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
          <Button
            disabled={isSubmitting || suggestUserName.length > 0}
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

export default SignUp;
