import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCode, FiArrowRight } from 'react-icons/fi';
import styled from 'styled-components';

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23334155" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.5;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const TextContent = styled.div`
  animation: slideIn 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  .highlight {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: #06b6d4;
    display: block;
  }
  
  .label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.25rem;
  }
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  animation: fadeIn 0.8s ease-out 0.3s both;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #06b6d4;
`;

const FormSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  
  a {
    color: #06b6d4;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Landing = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações básicas
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('O username deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/projects');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <LandingContainer>
      <Content>
        <TextContent>
          <Title>
            Conecte-se com <span className="highlight">desenvolvedores</span> do mundo todo
          </Title>
          <Subtitle>
            Compartilhe projetos, descubra novas tecnologias e cresça junto com a comunidade dev
          </Subtitle>
          
          <CTAButtons>
            <Link to="/register" className="btn btn-primary">
              Começar agora <FiArrowRight />
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              Explorar projetos
            </Link>
          </CTAButtons>
          
          <Stats>
            <StatItem>
              <span className="number">+1000</span>
              <span className="label">devs já conectados</span>
            </StatItem>
            <StatItem>
              <span className="number">500+</span>
              <span className="label">projetos compartilhados</span>
            </StatItem>
            <StatItem>
              <span className="number">200+</span>
              <span className="label">vagas disponíveis</span>
            </StatItem>
          </Stats>
        </TextContent>

        <FormContainer>
          <FormTitle>
            <FiCode />
            Cadastrar
          </FormTitle>
          <FormSubtitle>
            Crie sua conta
          </FormSubtitle>
          
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <InputGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                name="username"
                placeholder="seu_username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Nome completo (opcional)</Label>
              <Input 
                type="text" 
                name="name"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Email</Label>
              <Input 
                type="email" 
                name="email"
                placeholder="dev@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Senha</Label>
              <Input 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'} <FiArrowRight />
            </SubmitButton>
          </Form>
          
          <LoginLink>
            Já tem conta? <Link to="/login">Faça login</Link>
          </LoginLink>
        </FormContainer>
      </Content>
    </LandingContainer>
  );
};

export default Landing;