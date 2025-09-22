import { motion } from "framer-motion";
const Loader = ({ message = "Loading..." }) => {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center  bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="w-4 h-4 bg-blue-500 rounded-full"
              animate={{ y: [-5, 5, -5] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-lg text-white font-semibold">{message}</p>
      </div>
    );
  };
  export default Loader