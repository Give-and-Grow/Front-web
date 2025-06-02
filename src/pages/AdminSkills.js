import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminSkills.css';
import Navbar from '../pages/Navbar';
import Sidebar from './Sidebar';
import { Trash2, Edit2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'top', 'unused', 'user-count'
  const perPage = 10;
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    fetchData();
  }, [page, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (filter === 'all') {
        const response = await axios.get(`http://localhost:5000/admin/skills/?page=${page}&per_page=${perPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(response.data.skills);
        setTotalPages(response.data.pages);
      } else if (filter === 'top') {
        // هنا نجيب التوب 10 فقط، ثابت ما في pagination
        const response = await axios.get('http://localhost:5000/admin/skills/top-used?limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(response.data.top_used_skills);
        setTotalPages(1);
        setPage(1);
      } else if (filter === 'unused') {
        const response = await axios.get(`http://localhost:5000/admin/skills/unused?page=${page}&per_page=${perPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(response.data.skills);
        setTotalPages(response.data.pages);
      } else if (filter === 'user-count') {
  const response = await axios.get('http://localhost:5000/admin/skills/user-counts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  setSkills(response.data.user_counts_per_skill); // ✅ نأخذ فقط المصفوفة
  setTotalPages(1);
  setPage(1);
}
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error fetching skills.');
    }
    setLoading(false);
  };

  const deleteSkill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Skill deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete skill.");
      console.error('Error deleting skill:', error);
    }
  };

  const startEditing = (id, name) => {
    setEditingSkillId(id);
    setEditedName(name);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/skills/${editingSkillId}`,
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Skill updated successfully!");
      setEditingSkillId(null);
      setEditedName('');
      fetchData();
    } catch (error) {
      toast.error("Failed to update skill.");
      console.error('Error updating skill:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkillName.trim()) {
      toast.error('Please enter a skill name.');
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        'http://localhost:5000/admin/skills/',
        { name: newSkillName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Skill created successfully!');
      setNewSkillName('');
      fetchData();
    } catch (error) {
      toast.error('Failed to add skill.');
      console.error('Error adding skill:', error);
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
        <h2 className="header-text">✨ Manage Skills</h2>

        {/* إضافة مهارة جديدة */}
        {filter === 'all' && (
          <div className="add-skill-container">
            <input
              type="text"
              placeholder="Enter new skill name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              disabled={adding}
              className="add-skill-input"
            />
            <button onClick={addSkill} disabled={adding} className="btn btn-add">
              {adding ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        )}

        {/* منيو الفلتر */}
        <div className="filter-menu">
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === 'all'}
              onChange={() => { setPage(1); setFilter('all'); }}
            />
            All Skills
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="top"
              checked={filter === 'top'}
              onChange={() => setFilter('top')}
            />
            Top Used Skills
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="unused"
              checked={filter === 'unused'}
              onChange={() => { setPage(1); setFilter('unused'); }}
            />
            Unused Skills
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="user-count"
              checked={filter === 'user-count'}
              onChange={() => setFilter('user-count')}
            />
            Skills with User Count
          </label>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="skills-table">
              <thead>
                <tr>
                  {/* الأعمدة تختلف حسب الفلتر */}
                  {(filter === 'all' || filter === 'unused') && (
                    <>
                      <th>ID</th>
                      <th>Skill Name</th>
                      <th>Actions</th>
                    </>
                  )}
                  {filter === 'top' && (
                    <>
                      <th>Skill</th>
                      <th>Opportunity Count</th>
                    </>
                  )}
                  {filter === 'user-count' && (
                    <>
                      <th>Skill</th>
                      <th>User Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {skills.length === 0 ? (
                  <tr>
                    <td colSpan={filter === 'all' || filter === 'unused' ? 3 : 2} style={{ textAlign: 'center' }}>
                      No skills found.
                    </td>
                  </tr>
                ) : (
                  skills.map(skill => {
                    if (filter === 'all' || filter === 'unused') {
                      return (
                        <tr key={skill.id}>
                          <td>{skill.id}</td>
                          <td>
                            {editingSkillId === skill.id ? (
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              skill.name
                            )}
                          </td>
                          <td>
                            {editingSkillId === skill.id ? (
                              <>
                                <button onClick={saveEdit} className="btn btn-save">💾 Save</button>
                                <button onClick={() => setEditingSkillId(null)} className="btn btn-cancel">❌ Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => deleteSkill(skill.id)} className="btn btn-delete">
                                  <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => startEditing(skill.id, skill.name)} className="btn btn-edit">
                                  <Edit2 size={16} /> Edit
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    } else if (filter === 'top') {
                      return (
                        <tr key={skill.skill}>
                          <td>{skill.skill}</td>
                          <td>{skill.opportunity_count}</td>
                        </tr>
                      );
                    } else if (filter === 'user-count') {
                      return (
                        <tr key={skill.skill}>
                          <td>{skill.skill}</td>
                          <td>{skill.user_count}</td>
                        </tr>
                      );
                    }
                    return null;
                  })
                )}
              </tbody>
            </table>

            {/* Pagination فقط يظهر للفلترات التي تدعمها */}
            {(filter === 'all' || filter === 'unused') && (
              <div className="pagination-controls">
                <span className="page-indicator">Page {page} of {totalPages}</span>
                <div className="pagination-buttons">
                  <button onClick={handlePrev} disabled={page === 1} className="btn">
                    <span>⬅</span> Previous
                  </button>
                  <button onClick={handleNext} disabled={page === totalPages} className="btn">
                    Next <span>➡</span>
                  </button>
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
