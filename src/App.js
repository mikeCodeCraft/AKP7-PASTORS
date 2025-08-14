

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PastorManagementSystem from './components/PastorManagementSystem';
import AuthForm from './components/AuthForm';
import AddPastorForm from './components/AddPastorForm';
import PastorProfile from './components/PastorProfile';
import UserProfile from './components/UserProfile';
import ZoneAreaParish from './components/ZoneAreaParish';

  // Example user data for UserProfile
  const user = {
    fullName: 'Jane Doe',
    title: 'Church Administrator',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    birthdate: '1990-04-12',
    phone: '(555) 987-6543',
    email: 'jane.doe@church.org',
    address: '321 Unity Lane, Springfield, IL 62704',
    employmentStatus: 'Full-time',
    spouse: 'John Doe',
    children: ['Emily Doe', 'Chris Doe'],
    skills: ['Organization', 'Communication', 'Event Planning'],
    education: ['B.A. Administration - State University', 'Certificate in Church Management']
  };
          <Route path="/user/profile" element={
            <PrivateRoute>
              <UserProfile user={user} onBack={() => window.location.assign('/dashboard')} />
            </PrivateRoute>
          } />
import PrivateRoute from './components/PrivateRoute';

function App() {
  // State and handlers for PMS and children
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPastor, setSelectedPastor] = React.useState(null);
  const [pastors, setPastors] = React.useState([
    {
      id: 1,
      fullName: "Rev. John Michael Smith",
      title: "Senior Pastor",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      birthdate: "1975-06-15",
      phone: "(555) 123-4567",
      email: "pastor.john@church.org",
      address: "123 Faith Street, Springfield, IL 62701",
      ordinationDate: "2005-08-20",
      employmentStatus: "Full-time",
      spouse: "Sarah Smith",
      children: ["David Smith", "Rachel Smith"],
      anniversary: "2000-09-15",
      spiritualGifts: ["Leadership", "Teaching", "Evangelism"],
      education: ["M.Div - Trinity Seminary", "B.A. Theology - Bible College"],
      appointments: [
        { church: "Springfield Community Church", date: "2015-01-01", role: "Senior Pastor" },
        { church: "Grace Methodist Church", date: "2008-06-01", role: "Associate Pastor" }
      ]
    },
    {
      id: 2,
      fullName: "Pastor Maria Elena Rodriguez",
      title: "Associate Pastor",
      photo: "https://images.unsplash.com/photo-1494790108755-2616c27d8bb6?w=400",
      birthdate: "1982-03-22",
      phone: "(555) 234-5678",
      email: "maria.rodriguez@church.org",
      address: "456 Hope Avenue, Springfield, IL 62702",
      ordinationDate: "2012-05-15",
      employmentStatus: "Full-time",
      spouse: "Carlos Rodriguez",
      children: ["Ana Rodriguez", "Miguel Rodriguez", "Sofia Rodriguez"],
      anniversary: "2008-07-20",
      spiritualGifts: ["Counseling", "Youth Ministry", "Worship"],
      education: ["M.A. Pastoral Care - Seminary Institute", "B.S. Psychology - State University"],
      appointments: [
        { church: "Springfield Community Church", date: "2018-03-15", role: "Associate Pastor" },
        { church: "New Life Baptist Church", date: "2012-06-01", role: "Youth Pastor" }
      ]
    },
    {
      id: 3,
      fullName: "Deacon Robert William Johnson",
      title: "Deacon",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      birthdate: "1968-11-08",
      phone: "(555) 345-6789",
      email: "robert.johnson@church.org",
      address: "789 Grace Road, Springfield, IL 62703",
      ordinationDate: "2010-12-10",
      employmentStatus: "Part-time",
      spouse: "Linda Johnson",
      children: ["Michael Johnson", "Jennifer Johnson"],
      anniversary: "1995-08-12",
      spiritualGifts: ["Administration", "Hospitality", "Service"],
      education: ["Certificate in Ministry - Local Seminary", "B.A. Business Administration"],
      appointments: [
        { church: "Springfield Community Church", date: "2010-12-15", role: "Deacon" }
      ]
    }
  ]);

  // Add Pastor handler
  const handleAddPastor = (data) => {
    const newPastor = {
      id: Date.now(),
      fullName: data.fullName,
      title: data.title,
      photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400',
      birthdate: data.birthdate || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      ordinationDate: data.ordinationDate || '',
      employmentStatus: data.employmentStatus || 'Full-time',
      spouse: data.spouse || '',
      children: (data.children || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean),
      anniversary: data.anniversary || '',
      spiritualGifts: (data.spiritualGifts || '').split(',').map(s => s.trim()).filter(Boolean),
      education: (data.education || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean),
      appointments: []
    };
    setPastors(prev => [newPastor, ...prev]);
  };

  return (
    <BrowserRouter>
      <div className="App">
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
                onSubmit={(data) => { handleAddPastor(data); window.location.assign('/dashboard'); }}
              />
            </PrivateRoute>
          } />
          <Route path="/pastors/:id" element={
            <PrivateRoute>
              <PastorProfile
                pastor={pastors.find(p => p.id === Number(selectedPastor?.id))}
                onBack={() => window.location.assign('/dashboard')}
              />
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