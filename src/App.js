import React from "react";
import './App.css';
import {
  Route,
  Routes,
} from "react-router-dom";

import HomePage from './components/HomePage';
import PreLoginPage from './components/PreLoginPage';

import MayRenderNavbar from './components/General/MayRenderNavbar';
import Navbar from './components/General/Navbar';
import RequireAuth from './components/General/RequireAuth';

import LoginPageCandidate from './components/Authorization/LoginPageCandidate';
import LoginPageCompany from './components/Authorization/LoginPageCompany';

import CompanyDashboard from './components/Company/CompanyDashboard';
import CompanyCreateRequest from './components/Company/CompanyCreateRequest';
import CompanyProfile from './components/Company/CompanyProfile';
import CompanyProfileEdit from './components/Company/CompanyProfileEdit';
import CompanyRequestDetails from './components/Company/CompanyRequestDetails';
import CompanyEditRequest from './components/Company/CompanyEditRequest';

import CandidateDashboard from './components/Candidate/CandidateDashboard';
import CandidateProfile from './components/Candidate/CandidateProfile';

import AdminDashboard from './components/Admin/AdminDashboard';
import AdminViewRequestDetails from './components/Admin/AdminViewRequestDetails';
import LoginPageAdmin from "./components/Authorization/LoginPageAdmin";

const ROLES = {
  'Company': 'company',
  'Candidate': 'candidate',
  'Admin': 'admin'
}

function App() {
  return (
    <>
      <MayRenderNavbar>
        <Navbar />
      </MayRenderNavbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/PreLogin" element={<PreLoginPage />} />
        <Route path="/LoginCandidate" element={<LoginPageCandidate />} />
        <Route path="/LoginCompany" element={<LoginPageCompany />} />
        <Route path="/LoginAdmin" element={<LoginPageAdmin />} />
        <Route element={<RequireAuth allowedRoles={[ROLES.Company]} />}>
          <Route path='/Company/Dashboard' element={<CompanyDashboard />} />
          <Route path='/Company/CreateRequest' element={<CompanyCreateRequest />} />
          <Route path='/Company/Profile' element={<CompanyProfile />} />
          <Route path='/Company/Profile/Edit' element={<CompanyProfileEdit />} />
          <Route path='/Company/RequestDetails' element={<CompanyRequestDetails />} />
          <Route path='/Company/RequestDetails/EditRequest' element={<CompanyEditRequest />} />
          <Route path='/Company/Dashboard/CandidateProfile' element={<CandidateProfile />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Candidate]} />}>
          <Route path='/Candidate/Dashboard' element={<CandidateDashboard />} />
          <Route path='/Candidate/Profile' element={<CandidateProfile />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='/Admin/Dashboard' element={<AdminDashboard />} />
          <Route path='/Admin/RequestDetails' element={<AdminViewRequestDetails />} />
          <Route path='/Admin/Dashboard/CompanyProfile' element={<CompanyProfile />} />
          <Route path='/Admin/Dashboard/CandidateProfile' element={<CandidateProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;