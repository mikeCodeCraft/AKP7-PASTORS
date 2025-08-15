

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PMSNavbar from './components/PMSNavbar';
import PastorManagementSystem from './components/PastorManagementSystem';
import AuthForm from './components/AuthForm';
import AddPastorForm from './components/AddPastorForm';
import PastorProfile from './components/PastorProfile';
import ZoneAreaParish from './components/ZoneAreaParish';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // State and handlers for PMS and children
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPastor, setSelectedPastor] = React.useState(null);
  const [pastors, setPastors] = React.useState([]);

  // Removed local newPastor construction; dashboard fetches from backend instead.

  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <PMSNavbar />
        <Routes>
          <Route path="/" element={
            <PastorManagementSystem
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedPastor={selectedPastor}
              setSelectedPastor={setSelectedPastor}
              pastors={pastors}
              setPastors={setPastors}
            />
          } />
          <Route path="/zones-areas-parishes" element={
            <PrivateRoute>
              <ZoneAreaParish />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PastorManagementSystem
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedPastor={selectedPastor}
                setSelectedPastor={setSelectedPastor}
                pastors={pastors}
                setPastors={setPastors}
                page="dashboard"
              />
            </PrivateRoute>
          } />
          <Route path="/pastors/new" element={
            <PrivateRoute>
              <AddPastorForm
                onCancel={() => window.location.assign('/dashboard')}
                onSubmit={() => { window.location.assign('/dashboard'); }}
              />
            </PrivateRoute>
          } />
          <Route path="/pastors/:id" element={
            <PrivateRoute>
              <PastorProfile onBack={() => window.location.assign('/dashboard')} />
            </PrivateRoute>
          } />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="*" element={<PastorManagementSystem
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedPastor={selectedPastor}
            setSelectedPastor={setSelectedPastor}
            pastors={pastors}
            setPastors={setPastors}
          />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;