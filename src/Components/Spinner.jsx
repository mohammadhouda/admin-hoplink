import React from "react";

function Spinner() {
  return (
    <div className=" absolute top-1/2 right-1/2">
      <div className="w-10 h-10 border-4 border-transparent text-cyan-700 text-4xl animate-spin flex items-center justify-center border-t-cyan-500 rounded-full">
        <div className="w-8 h-8 border-4 border-transparent text-cyan-500 text-2xl animate-spin flex items-center justify-center border-t-cyan-700 rounded-full"></div>
      </div>
    </div>
  );
}

export default Spinner;
