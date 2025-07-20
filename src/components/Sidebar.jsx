import { useNavigate } from "react-router-dom";
import { Home, Tag, LogOut, MapPin, Box, Users, DollarSign, Utensils, Layout, Settings, Receipt, Gift } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  // const type = localStorage.getItem("type");
 const type ="admin";
  const branchId = localStorage.getItem("branch_id");

  return (
    <div className="bg-gradient-to-b from-red-800 to-red-500 text-white w-40 min-h-screen flex flex-col items-center py-20 space-y-10 rounded-tr-2xl rounded-2xl m-8">
      <Utensils size={28} />
      <button onClick={() => navigate("/")}>
        <Home size={24} />
      </button>

      {type === "admin" && (
        <>
          <button onClick={() => navigate("/branch")}>
            <MapPin size={24} />
          </button>
          <button onClick={() => navigate("/categories")}>
            <Layout size={24} />
          </button>
          <button onClick={() => navigate("/descount")}>
            <Gift size={24} />
          </button>
          <button onClick={() => navigate("/tax")}>
            <Receipt size={24} />
          </button>
        </>
      )}

      {type === "subadmin" && (
        <>
          <button onClick={() => navigate(`/branches/${branchId}/table`)}>
            <Layout size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/user`)}>
            <Users size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/invoice`)}>
            <DollarSign size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/rate`)}>
            <Tag size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/warehouse`)}>
            <Box size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/categories`)}>
            <Layout size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/descount`)}>
            <Gift size={24} />
          </button>
          <button onClick={() => navigate(`/branches/${branchId}/tax`)}>
            <Receipt size={24} />
          </button>
        </>
      )}

      <button onClick={() => navigate("/settings")}>
        <Settings size={24} />
      </button>
      <button onClick={() => {
        localStorage.clear();
        navigate('/login');
      }}>
        <LogOut size={24} />
      </button>
    </div>
  );
};

export default Sidebar;
