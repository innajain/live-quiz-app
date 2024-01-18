import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
  AllHTMLAttributes,
} from "react";

export const Button = forwardRef(
  (
    props: ButtonHTMLAttributes<HTMLButtonElement>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button
        {...props}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 disabled:text-gray-300 disabled:hover:bg-blue-500"
        ref={ref}
      />
    );
  }
);

export const Background = forwardRef(
  (
    props: AllHTMLAttributes<HTMLDivElement>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        className="bg-slate-900 flex flex-col h-full min-h-[100vh] items-center text-white relative"
        ref={ref}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);

export const Input = forwardRef(
  (
    props: InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        {...props}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:text-gray-400 disabled:hover:bg-gray-500"
        type="text"
        ref={ref}
      />
    );
  }
);
