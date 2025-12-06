import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCode, FiUser, FiLogOut, FiMenu, FiX, FiBriefcase, FiPlus } from 'react-icons/fi';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #06b6d4;
  font-weight: 700;
  font-size: 1.5rem;
  
  &:hover {
    color: #0891b2;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.98);
    flex-direction: column;
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover, &.active {
    color: #06b6d4;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 200px;
  margin-top: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const PremiumBadge = styled.span`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
`;

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FiCode />
          DevConnect
        </Logo>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink 
            to="/projects" 
            className={isActive('/projects') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Projetos
          </NavLink>
          <NavLink 
            to="/jobs" 
            className={isActive('/jobs') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            <FiBriefcase />
            Vagas
          </NavLink>
          {isAuthenticated && (
            <NavLink 
              to="/new-project" 
              className={isActive('/new-project') ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              <FiPlus />
              Novo Projeto
            </NavLink>
          )}
        </NavLinks>

        <UserMenu>
          {isAuthenticated ? (
            <>
              <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <FiUser />
                {user?.name}
                {user?.isPremium && <PremiumBadge>PRO</PremiumBadge>}
              </UserButton>
              <DropdownMenu isOpen={isUserMenuOpen}>
                <DropdownItem onClick={() => {
                  navigate(`/profile/${user?.username}`);
                  setIsUserMenuOpen(false);
                }}>
                  <FiUser />
                  Meu Perfil
                </DropdownItem>
                <DropdownItem onClick={() => {
                  navigate('/my-applications');
                  setIsUserMenuOpen(false);
                }}>
                  <FiBriefcase />
                  Minhas Candidaturas
                </DropdownItem>
                {!user?.isPremium && (
                  <DropdownItem onClick={() => {
                    navigate('/premium');
                    setIsUserMenuOpen(false);
                  }}>
                    ⭐ Upgrade Premium
                  </DropdownItem>
                )}
                <DropdownItem onClick={handleLogout}>
                  <FiLogOut />
                  Sair
                </DropdownItem>
              </DropdownMenu>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary">
                Cadastrar
              </Link>
            </div>
          )}
        </UserMenu>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;