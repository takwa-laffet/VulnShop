import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      if (res.data.success) {
        toast.success("Login successful (⚠️ vulnerable)");
        setLogged(true);
      } else {
        toast.error("Invalid credentials");
      }
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">

      {/* Navbar */}
      <nav className="flex justify-between px-8 py-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-green-400">
          VulnShop 🔐
        </h1>
        <span className="text-slate-400 text-sm">
          Dev • Pentest • Lab
        </span>
      </nav>

      {!logged ? (
        /* LOGIN */
        <div className="flex justify-center items-center h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 p-8 rounded-xl shadow-xl w-96"
          >
            <h2 className="text-xl font-bold text-sky-400 mb-4">
              Login (Vulnerable)
            </h2>

            <input
              className="w-full mb-3 px-4 py-2 bg-slate-900 border border-slate-700 rounded"
              placeholder="Username"
              onChange={e => setUsername(e.target.value)}
            />

            <input
              className="w-full mb-4 px-4 py-2 bg-slate-900 border border-slate-700 rounded"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />

            <button
              onClick={login}
              className="w-full bg-green-500 text-black py-2 rounded font-bold hover:bg-green-400 transition"
            >
              Login
            </button>
          </motion.div>
        </div>
      ) : (
        /* DASHBOARD */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8"
        >
          <h2 className="text-2xl font-bold text-green-400 mb-6">
            User Dashboard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products.map(p => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={p.id}
                className="bg-slate-800 p-5 rounded-xl shadow"
              >
                <h3
                  className="text-lg font-bold text-green-400"
                  dangerouslySetInnerHTML={{ __html: p.name }}
                ></h3>

                <p className="text-slate-400 text-sm mt-2">
                  {p.description}
                </p>

                <p className="mt-4 text-sky-400 font-semibold">
                  {p.price} DT
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
