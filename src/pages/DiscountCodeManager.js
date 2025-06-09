// DiscountCodeManager.jsx
import { useEffect, useState } from "react";
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';
import './DiscountCodeManager.css';
import { FaEdit, FaTrash,FaStore, FaBarcode, FaCoins } from "react-icons/fa";

const API_BASE = "http://localhost:5000/admin/discount-codes";

const token = localStorage.getItem("userToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export default function DiscountCodeManager() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    store_name: "",
    code: "",
    points_required: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadDiscounts = async () => {
    const res = await fetch(`${API_BASE}/get`, { headers });
    const data = await res.json();
    setDiscounts(data);
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      editingId !== null ? `${API_BASE}/${editingId}` : `${API_BASE}/creat`;
    const method = editingId !== null ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    });

    setForm({ store_name: "", code: "", points_required: "" });
    setEditingId(null);
    loadDiscounts();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers,
    });
    loadDiscounts();
  };

  const startEdit = (item) => {
    setForm({
      store_name: item.store_name,
      code: item.code,
      points_required: item.points_required,
    });
    setEditingId(item.id);
  };

  return (
    <>
          <Navbar />
          <Sidebar />
  <div className="container">

  <form onSubmit={handleSubmit} className="form-container">
    <h2 className="form-title">{editingId ? "Edit Discount" : "Create New Discount"}</h2>
    <div className="input-group">
      <div className="input-with-icon">
  <FaStore className="input-icon" />
  <input
    type="text"
    name="store_name"
    placeholder="Store Name"
    className="input-field"
    value={form.store_name}
    onChange={handleChange}
    required
  />
</div>

<div className="input-with-icon">
  <FaBarcode className="input-icon" />
  <input
    type="text"
    name="code"
    placeholder="Discount Code"
    className="input-field"
    value={form.code}
    onChange={handleChange}
    required
  />
</div>

<div className="input-with-icon">
  <FaCoins className="input-icon" />
  <input
    type="number"
    name="points_required"
    placeholder="Points Required"
    className="input-field"
    value={form.points_required}
    onChange={handleChange}
    required
  />
</div>

    </div>
    <button type="submit" className="submit-btn">
      {editingId ? "Update" : "Create"}
    </button>
  </form>

 <h2 className="section-title">All Discount Codes</h2>
{discounts.length === 0 ? (
  <p className="empty-text">No discount codes available.</p>
) : (
  <div className="code-list">
    {discounts.map((item) => (
     <div key={item.id} className="code-card">
  <p><FaStore style={{ marginRight: "8px" }} /><strong>Store:</strong> {item.store_name}</p>
  <p><FaBarcode style={{ marginRight: "8px" }} /><strong>Code:</strong> {item.code}</p>
  <p><FaCoins style={{ marginRight: "8px" }} /><strong>Points:</strong> {item.points_required}</p>
  <div className="btn-group">
    <button className="edit-btn" onClick={() => startEdit(item)}>Edit</button>
    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
  </div>



      </div>
    ))}
  </div>
)}

</div>
  </>
  );
}
