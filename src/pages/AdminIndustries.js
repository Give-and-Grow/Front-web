import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminSkills.css';
import Navbar from '../pages/Navbar';
import Sidebar from './Sidebar';
import { Trash2, Edit2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminIndustries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [newIndustryName, setNewIndustryName] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all'); // all, top, unused, user-count
  const perPage = 10;
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    fetchIndustries();
  }, [page, filter]);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      let url = '';
      if (filter === 'all') {
        url = `http://localhost:5000/admin/industries/?page=${page}&per_page=${perPage}`;
      } else if (filter === 'top') {
        url = 'http://localhost:5000/admin/industries/top-used?limit=10';
      } else if (filter === 'unused') {
        url = `http://localhost:5000/admin/industries/unused?page=${page}&per_page=${perPage}`;
      } else if (filter === 'user-count') {
        url = 'http://localhost:5000/admin/industries/org-counts';
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filter === 'top') {
        setIndustries(response.data.top_used_industries);
        setTotalPages(1);
        setPage(1);
      } else if (filter === 'user-count') {
  setIndustries(response.data.organization_counts_per_industry);
  setTotalPages(1);
  setPage(1);
}else {
        setIndustries(response.data.industries);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      toast.error('Error fetching industries');
      console.error(error);
    }
    setLoading(false);
  };

  const deleteIndustry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/industries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Industry deleted successfully!");
      fetchIndustries();
    } catch (error) {
      toast.error("Failed to delete industry.");
    }
  };

  const startEditing = (id, name) => {
    setEditingIndustryId(id);
    setEditedName(name);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/industries/${editingIndustryId}`,
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Industry updated successfully!");
      setEditingIndustryId(null);
      setEditedName('');
      fetchIndustries();
    } catch (error) {
      toast.error("Failed to update industry.");
    }
  };

  const addIndustry = async () => {
    if (!newIndustryName.trim()) {
      toast.error('Please enter an industry name.');
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        'http://localhost:5000/admin/industries/',
        { name: newIndustryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Industry added successfully!");
      setNewIndustryName('');
      fetchIndustries();
    } catch (error) {
      toast.error("Failed to add industry.");
    }
    setAdding(false);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h2 className="header-text">🏭 Manage Industries</h2>

        {filter === 'all' && (
          <div className="add-skill-container">
            <input
              type="text"
              placeholder="Enter new industry name"
              value={newIndustryName}
              onChange={(e) => setNewIndustryName(e.target.value)}
              disabled={adding}
              className="add-skill-input"
            />
            <button onClick={addIndustry} disabled={adding} className="btn btn-add">
              {adding ? 'Adding...' : 'Add Industry'}
            </button>
          </div>
        )}

        <div className="filter-menu">
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === 'all'}
              onChange={() => { setPage(1); setFilter('all'); }}
            />
            All Industries
          </label>
         
          <label>
            <input
              type="radio"
              name="filter"
              value="unused"
              checked={filter === 'unused'}
              onChange={() => { setPage(1); setFilter('unused'); }}
            />
            Unused
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="user-count"
              checked={filter === 'user-count'}
              onChange={() => setFilter('user-count')}
            />
            User Count
          </label>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="skills-table">
              <thead>
                <tr>
                  {(filter === 'all' || filter === 'unused') && (
                    <>
                      <th>ID</th>
                      <th>Industry Name</th>
                      <th>Actions</th>
                    </>
                  )}
                 
                  {filter === 'user-count' && (
                    <>
                      <th>Industry</th>
                      <th>User Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {industries.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center' }}>No industries found.</td>
                  </tr>
                ) : (
                  industries.map((industry) => {
                    if (filter === 'all' || filter === 'unused') {
                      return (
                        <tr key={industry.id}>
                          <td>{industry.id}</td>
                          <td>
                            {editingIndustryId === industry.id ? (
                              <input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              industry.name
                            )}
                          </td>
                          <td>
                            {editingIndustryId === industry.id ? (
                              <>
                                <button onClick={saveEdit} className="btn btn-save">💾 Save</button>
                                <button onClick={() => setEditingIndustryId(null)} className="btn btn-cancel">❌ Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => deleteIndustry(industry.id)} className="btn btn-delete"><Trash2 size={16} /> Delete</button>
                                <button onClick={() => startEditing(industry.id, industry.name)} className="btn btn-edit"><Edit2 size={16} /> Edit</button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    }  else if (filter === 'user-count') {
                      return (
                        <tr key={industry.industry}>
                          <td>{industry.industry}</td>
                         <td>{industry.organization_count}</td>

                        </tr>
                      );
                    }
                    return null;
                  })
                )}
              </tbody>
            </table>

            {(filter === 'all' || filter === 'unused') && (
              <div className="pagination-controls">
                <span className="page-indicator">Page {page} of {totalPages}</span>
                <div className="pagination-buttons">
                  <button onClick={handlePrev} disabled={page === 1} className="btn">⬅ Previous</button>
                  <button onClick={handleNext} disabled={page === totalPages} className="btn">Next ➡</button>
                </div>
              </div>
            )}
          </>
        )}
        <ToastContainer position="bottom-right" autoClose={2000} />
      </main>
    </div>
  );
}
