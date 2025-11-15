import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Schemes from "./pages/Schemes";
import Scholarships from "./pages/Scholarships";
import Loans from "./pages/Loans";
import Stories from "./pages/Stories";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import SlideOne from "./components/slideone";
export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/help" element={<Help />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/results" element={<Results />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
