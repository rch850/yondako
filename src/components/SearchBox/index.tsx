import IconSearch from "@/assets/icons/search.svg";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Input from "../Input";

export default forwardRef<HTMLInputElement, ComponentPropsWithRef<"input">>(
  function SearchBox({ className, ...props }, ref) {
    return (
      <div className={twMerge("relative text-primary-text", className)}>
        <IconSearch className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 text-primary-text" />
        <Input {...props} ref={ref} className="pl-10" />
      </div>
    );
  },
);
