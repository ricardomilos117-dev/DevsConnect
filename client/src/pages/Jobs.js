import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiBriefcase, 
  FiMapPin, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiSearch,
  FiFilter,
  FiPlus,
  FiExternalLink,
  FiStar
} from 'react-icons/fi';
import styled from 'styled-components';

const JobsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  .highlight {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 6px;
  color: ${props => props.active ? '#06b6d4' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  
  &:hover {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.3);
  }
`;

const JobsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const JobCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const Company = styled.div`
  color: #06b6d4;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const JobDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  padding: 0.25rem 0.75rem;
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(6, 182, 212, 0.3);
`;

const JobActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const JobLevel = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${props => {
    switch(props.level) {
      case 'junior': return 'rgba(34, 197, 94, 0.2)';
      case 'mid': return 'rgba(251, 191, 36, 0.2)';
      case 'senior': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.level) {
      case 'junior': return '#22c55e';
      case 'mid': return '#fbbf24';
      case 'senior': return '#ef4444';
      default: return '#9ca3af';
    }
  }};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  
  .loading {
    width: 40px;
    height: 40px;
  }
`;

const PremiumBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, [levelFilter, typeFilter, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        level: levelFilter !== 'all' ? levelFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        search: searchTerm || undefined
      };
      
      const response = await jobsAPI.getJobs(params);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) return;
    
    try {
      await jobsAPI.applyToJob(jobId, {
        coverLetter: 'Tenho interesse nesta vaga e acredito que minha experiência se alinha com os requisitos.'
      });
      
      // Atualizar o estado local
      setJobs(jobs.map(job => {
        if (job._id === jobId) {
          return {
            ...job,
            hasApplied: true,
            applicationsCount: job.applicationsCount + 1
          };
        }
        return job;
      }));
    } catch (error) {
      console.error('Erro ao se candidatar:', error);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Não informado';
    const { min, max, currency } = salary;
    const symbol = currency === 'BRL' ? 'R$' : '$';
    
    if (min && max) {
      return `${symbol} ${min.toLocaleString()} - ${symbol} ${max.toLocaleString()}`;
    } else if (min) {
      return `A partir de ${symbol} ${min.toLocaleString()}`;
    } else if (max) {
      return `Até ${symbol} ${max.toLocaleString()}`;
    }
    return 'Não informado';
  };

  if (loading) {
    return (
      <JobsContainer>
        <LoadingState>
          <div className="loading" />
        </LoadingState>
      </JobsContainer>
    );
  }

  return (
    <JobsContainer>
      <Header>
        <Title>
          Encontre sua próxima <span className="highlight">oportunidade</span>
        </Title>
        <Subtitle>
          Descubra vagas incríveis em empresas que valorizam desenvolvedores talentosos
        </Subtitle>
      </Header>

      <Controls>
        <SearchBar>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar vagas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterButtons>
          <FilterButton 
            active={levelFilter === 'all'} 
            onClick={() => setLevelFilter('all')}
          >
            Todos os níveis
          </FilterButton>
          <FilterButton 
            active={levelFilter === 'junior'} 
            onClick={() => setLevelFilter('junior')}
          >
            Junior
          </FilterButton>
          <FilterButton 
            active={levelFilter === 'mid'} 
            onClick={() => setLevelFilter('mid')}
          >
            Pleno
          </FilterButton>
          <FilterButton 
            active={levelFilter === 'senior'} 
            onClick={() => setLevelFilter('senior')}
          >
            Sênior
          </FilterButton>
        </FilterButtons>

        <FilterButtons>
          <FilterButton 
            active={typeFilter === 'all'} 
            onClick={() => setTypeFilter('all')}
          >
            Todos os tipos
          </FilterButton>
          <FilterButton 
            active={typeFilter === 'full-time'} 
            onClick={() => setTypeFilter('full-time')}
          >
            Tempo integral
          </FilterButton>
          <FilterButton 
            active={typeFilter === 'part-time'} 
            onClick={() => setTypeFilter('part-time')}
          >
            Meio período
          </FilterButton>
          <FilterButton 
            active={typeFilter === 'contract'} 
            onClick={() => setTypeFilter('contract')}
          >
            Freelance
          </FilterButton>
        </FilterButtons>
      </Controls>

      {jobs.length === 0 ? (
        <EmptyState>
          <div className="icon">💼</div>
          <h3>Nenhuma vaga encontrada</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos.</p>
        </EmptyState>
      ) : (
        <JobsGrid>
          {jobs.map((job) => (
            <JobCard key={job._id}>
              <JobHeader>
                <div>
                  <JobTitle>{job.title}</JobTitle>
                  <Company>{job.company}</Company>
                  <JobLevel level={job.level}>{job.level}</JobLevel>
                </div>
                {job.featured && (
                  <PremiumBadge>
                    <FiStar />
                    Destaque
                  </PremiumBadge>
                )}
              </JobHeader>

              <JobMeta>
                <MetaItem>
                  <FiMapPin />
                  {job.location}
                </MetaItem>
                <MetaItem>
                  <FiClock />
                  {job.type === 'full-time' ? 'Tempo integral' : 
                   job.type === 'part-time' ? 'Meio período' : 'Freelance'}
                </MetaItem>
                <MetaItem>
                  <FiDollarSign />
                  {formatSalary(job.salary)}
                </MetaItem>
                <MetaItem>
                  <FiUsers />
                  {job.applicationsCount || 0} candidatos
                </MetaItem>
              </JobMeta>

              <JobDescription>
                {job.description}
              </JobDescription>

              <TechTags>
                {job.technologies.slice(0, 4).map((tech, index) => (
                  <TechTag key={index}>{tech}</TechTag>
                ))}
                {job.technologies.length > 4 && (
                  <TechTag>+{job.technologies.length - 4}</TechTag>
                )}
              </TechTags>

              <JobActions>
                <ApplyButton 
                  onClick={() => handleApply(job._id)}
                  disabled={!isAuthenticated || job.hasApplied}
                >
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Fazer login para candidatar
                      </Link>
                    </>
                  ) : job.hasApplied ? (
                    'Já candidatado'
                  ) : (
                    <>
                      Candidatar-se <FiExternalLink />
                    </>
                  )}
                </ApplyButton>
              </JobActions>
            </JobCard>
          ))}
        </JobsGrid>
      )}
    </JobsContainer>
  );
};

export default Jobs;