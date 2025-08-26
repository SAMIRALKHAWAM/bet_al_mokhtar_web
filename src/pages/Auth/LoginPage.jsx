// src/pages/Auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();


    // const user = {
    //   type: 'admin',
    //   branchId: 1
    // };

    // localStorage.setItem('user', JSON.stringify(user));
    // localStorage.setItem("branch_id", user.branchId); // ✅ هي ضرورية

    // setLoading(true);

    // setTimeout(() => {
    //   setLoading(false);
    //   navigate('/admin');
    // }, 1000); // تأخير ثانية واحدة

    
    
    // setError("");

    try {
      const user = await login(username, password);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("type", user.type);
      if (user.branchId) localStorage.setItem("branch_id", user.branchId);

      switch (user.type) {
        case "admin":
        case "subadmin":
          navigate("/admin");
          break;
        case "cashier":
          navigate("/cashier");
          break;
        case "warehouseman":
          navigate("/warehouse-manager");
          break;
        case "accountant":
          navigate("/dashboard/accounting");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-1">اسم المستخدم</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">كلمة المرور</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
}
