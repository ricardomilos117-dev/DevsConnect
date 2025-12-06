import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import Jobs from './pages/Jobs';
import Premium from './pages/Premium';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
`;

const MainContent = styled.main`
  min-height: calc(100vh - 80px);
`;

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para rotas públicas (redireciona se já logado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/projects" />;
};

const AppRoutes = () => {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          {/* Rota inicial */}
          <Route path="/" element={<Landing />} />
          
          {/* Rotas públicas */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Rotas públicas/semi-públicas */}
          <Route path="/projects" element={<Projects />} />
          
          {/* Rotas protegidas */}
          <Route path="/new-project" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Criar Novo Projeto</h1>
                <p>Em desenvolvimento...</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/jobs" element={<Jobs />} />
          
          <Route path="/profile/:username" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>Perfil do Usuário</h1>
              <p>Em desenvolvimento...</p>
            </div>
          } />
          
          <Route path="/my-applications" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Minhas Candidaturas</h1>
                <p>Em desenvolvimento...</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/premium" element={
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          } />
          
          {/* Rota 404 */}
          <Route path="*" element={
            <div style={{ 
              padding: '4rem', 
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                Página não encontrada
              </p>
              <a href="/" className="btn btn-primary">
                Voltar ao início
              </a>
            </div>
          } />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;