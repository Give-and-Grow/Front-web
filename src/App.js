import React from 'react';
import LoginPage from './pages/LoginPage';
import SignupScreen from './pages/SignupScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Signuporganization from './pages/Signuporganization';
import SelectUserType from './pages/SelectUserType';
import SignupFlow from './pages/SignupFlow';
import ChangePasswordProfile from './pages/ChangePasswordProfile';
import ProfileOrganizationScreen from './pages/ProfileOrganizationScreen'
import Navbar from './pages/Navbar'
import CreatePostWeb from './pages/CreatePostWeb';
import EditPostScreen from './pages/EditPostScreen';
import FollowingScreen from './pages/FollowingScreen';
import FollowScreenOrganization from './pages/FollowScreenOrganization';
import FriendsPost from './pages/FriendsPost';
import AllOppertinitesUser from './pages/AllOppertinitesUser';
import NearbyOpportunitiesUser from './pages/NearbyOpportunitiesUser';
import JobOpportunities  from './pages/JobOpportunities';
import VolunteerOpportunities from './pages/VolunteerOpportunities';
import ApplicationsScreen from './pages/ApplicationsScreen';
import OpportunityFilters from './pages/OpportunityFilters';
import OrganizationFilters from './pages/OrganizationFilters'
import CreatevolunterOpportunity from './pages/CreatevolunterOpportunity';
import OpportunityList from './pages/OpportunityList';
import OrganizationRejectAcceptUser from  './pages/OrganizationRejectAcceptUser';
import CreateJobOpportunity from './pages/CreateJobOpportunity';
import AttendanceScreen from './pages/AttendanceScreen';
import RateParticipantsScreen from './pages/RateParticipantsScreen';
import OppertinetisPublicUser from './pages/OppertinetisPublicUser';
import About from './pages/About';
import Contact from './pages/Contact';
import UserEvaluationCard from './pages/UserEvaluationCard';
import UserEvaluationCardWrapper from './pages/UserEvaluationCardWrapper';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EvaluateScreen from './pages/EvaluateScreen';
import SkillsSection from './pages/SkillsSection';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './pages/Sidebar';
import AdminSkills from './pages/AdminSkills';
import AdminIndustries from './pages/AdminIndustries';
import AdminOpportunities from './pages/AdminOpportunities';
import AccountsDashboard from './pages/AccountsDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignupScreen" element={<SignupScreen />} />
        <Route path="/ResetPasswordScreen" element={<ResetPasswordScreen />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Signuporganization" element={<Signuporganization />} />
        <Route path="/SelectUserType" element={<SelectUserType />} />
        <Route path="/SignupFlow" element={<SignupFlow />} />
        <Route path="/ChangePasswordProfile" element={<ChangePasswordProfile />} />

        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/ProfileOrganizationScreen" element={<ProfileOrganizationScreen />} />
        <Route path="/CreatePostWeb" element={<CreatePostWeb />} />
        <Route path="/EditPostScreen/:postId" element={<EditPostScreen />} />
        <Route path="/FollowScreenOrganization" element={<FollowScreenOrganization />} />
        <Route path="/FollowingScreen" element={<FollowingScreen />} />
        <Route path="/FriendsPost" element={<FriendsPost />} />
        <Route path="/AllOppertinitesUser" element={<AllOppertinitesUser />} />
        <Route path="/NearbyOpportunitiesUser" element={<NearbyOpportunitiesUser />} />
        <Route path="/JobOpportunities" element={<JobOpportunities />} />
        <Route path="/VolunteerOpportunities" element={<VolunteerOpportunities />} />
        <Route path="/ApplicationsScreen" element={<ApplicationsScreen />} />
        <Route path="/EvaluateScreen/:participantId" element={<EvaluateScreen />} />
        <Route path="/OpportunityFilters" element={<OpportunityFilters />} />
        <Route path="/OrganizationFilters" element={<OrganizationFilters />} />
         <Route path="/CreatevolunterOpportunity" element={<CreatevolunterOpportunity />} />
        <Route path="/OpportunityList" element={<OpportunityList />} />
        <Route path="/OrganizationRejectAcceptUser" element={<OrganizationRejectAcceptUser />} />
          <Route path="/AttendanceScreen" element={<AttendanceScreen />} />
           <Route path="/RateParticipantsScreen" element={<RateParticipantsScreen />} />
             <Route path="/CreateJobOpportunity" element={<CreateJobOpportunity />} />
             <Route path="/OppertinetisPublicUser" element={<OppertinetisPublicUser />} />
                <Route path="/About" element={<About />} />
               <Route path="/Contact" element={<Contact />} />
              <Route path="/UserEvaluationCard/:userId" element={<UserEvaluationCardWrapper />} />
           <Route path="/SkillsSection" element={<SkillsSection />} />
           <Route path="/AdminDashboard" element={<AdminDashboard />} />
             <Route path="/Sidebar" element={<Sidebar />} />
             <Route path="/AdminSkills" element={<AdminSkills />} />
             <Route path="/AdminIndustries" element={<AdminIndustries />} />
                  <Route path="/AdminOpportunities" element={<AdminOpportunities />} />
                      <Route path="/AccountsDashboard" element={<AccountsDashboard />} />
        {/* Add any additional routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
