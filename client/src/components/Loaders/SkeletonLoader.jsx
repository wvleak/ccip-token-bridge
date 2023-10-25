import React from "react";

const SkeletonLoader = ({ style }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${style}`}></div>
  );
};

export default SkeletonLoader;
