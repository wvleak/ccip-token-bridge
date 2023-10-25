import Loader from "./Loader";

const LoadingScreen = ({ text }) => {
  return (
    <div className="fixed inset-0 z-20 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <Loader styles="w-[100px] h-[100px] object-contain" />
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">
        {text} <br /> Please wait...
      </p>
    </div>
  );
};

export default LoadingScreen;
