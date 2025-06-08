import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import './SkillsSection.css'
import Navbar from '../pages/Navbar';

const SkillsSection = () => {
  const [mySkills, setMySkills] = useState([]);           // المهارات المضافة
  const [availableSkills, setAvailableSkills] = useState([]); // المهارات المتاحة للإضافة
  const [profile, setProfile] = useState({ skills: "" });  // ملف المستخدم مع مهارات كسلسلة نص
  const token = localStorage.getItem("userToken");

  // جلب المهارات المضافة للمستخدم
  const fetchMySkills = async (t) => {
    try {
      const res = await axios.get(`http://localhost:5000/user-skills/`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setMySkills(res.data.skills);
      
      // مزامنة المهارات كسلسلة نص مع profile.skills
      const skillsString = res.data.skills.map(s => s.name).join("\n");
      setProfile((prev) => ({ ...prev, skills: skillsString }));

    } catch (err) {
      alert("Failed to load my skills");
    }
  };

  // جلب المهارات المتاحة للإضافة
  const fetchAvailableSkills = async (t) => {
    try {
      const res = await axios.get(`http://localhost:5000/user-skills/available`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAvailableSkills(res.data.available_skills);
    } catch (err) {
      alert("Failed to load available skills");
    }
  };

  useEffect(() => {
    if (token) {
      fetchMySkills(token);
      fetchAvailableSkills(token);
    }
  }, [token]);

  // إضافة مهارة
  const addSkill = async (skillId, skillName) => {
    try {
      await axios.post(
        `http://localhost:5000/user-skills/add/${skillId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile((prevProfile) => ({
        ...prevProfile,
        skills: prevProfile.skills
          ? `${prevProfile.skills}\n${skillName}`
          : skillName,
      }));

      fetchMySkills(token);
      fetchAvailableSkills(token);
    } catch {
      alert("Could not add skill");
    }
  };

  // حذف مهارة
  const removeSkill = async (skillId, skillName) => {
    try {
      await axios.delete(`http://localhost:5000/user-skills/remove/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile((prevProfile) => ({
        ...prevProfile,
        skills: prevProfile.skills
          .split("\n")
          .filter((skill) => skill !== skillName)
          .join("\n"),
      }));

      fetchMySkills(token);
      fetchAvailableSkills(token);
    } catch {
      alert("Could not remove skill");
    }
  };

  // إعداد خيارات react-select من المهارات المتاحة
  const skillOptions = availableSkills.map(skill => ({
    value: skill.id,
    label: skill.name,
  }));

  return (
    <>
      <Navbar />  
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Skills</h2>

        {/* عرض المهارات المضافة */}
        <div className="flex flex-wrap gap-2 mb-6">
          {mySkills.map((skill) => (
            <span
              key={skill.id}
              className="bg-green-200 text-green-900 px-3 py-1 rounded-full flex items-center"
            >
              {skill.name}
              <button
                onClick={() => removeSkill(skill.id, skill.name)}
                className="ml-2 text-red-600 hover:text-red-800 font-bold"
                aria-label={`Remove ${skill.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2">Add a New Skill</h3>

        {/* استخدام react-select مع خاصية البحث */}
        <Select
          options={skillOptions}
          isSearchable={true}
          placeholder="Select or search a skill"
          onChange={(selectedOption) => {
            if (selectedOption) addSkill(selectedOption.value, selectedOption.label);
          }}
          className="mb-4"
        />

        {/* نص عرض المهارات كسلسلة نص (اختياري) */}
        <pre className="mt-6 p-3 bg-gray-100 rounded whitespace-pre-wrap">
          {profile.skills || "No skills selected"}
        </pre>
      </div>
    </>
  );
};

export default SkillsSection;
