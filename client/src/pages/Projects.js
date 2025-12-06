import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiEye, 
  FiExternalLink, 
  FiGithub, 
  FiPlus,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
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

const ProjectsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.image ? 'rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const ProjectAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
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
  margin-bottom: 1rem;
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

const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: ${props => props.active ? '#06b6d4' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 0.875rem;
  
  &:hover {
    color: #06b6d4;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LinkButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.5);
    color: #06b6d4;
  }
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [sortBy, searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        search: searchTerm || undefined
      };
      
      const response = await projectsAPI.getProjects(params);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId) => {
    if (!isAuthenticated) return;
    
    try {
      await projectsAPI.likeProject(projectId);
      // Atualizar o estado local
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          return {
            ...project,
            isLikedByUser: !project.isLikedByUser,
            likesCount: project.isLikedByUser ? project.likesCount - 1 : project.likesCount + 1
          };
        }
        return project;
      }));
    } catch (error) {
      console.error('Erro ao curtir projeto:', error);
    }
  };

  if (loading) {
    return (
      <ProjectsContainer>
        <LoadingState>
          <div className="loading" />
        </LoadingState>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <Header>
        <Title>
          Compartilhe seus <span className="highlight">projetos</span> com o mundo
        </Title>
        <Subtitle>
          Conecte-se com desenvolvedores, mostre seu trabalho, descubra projetos incríveis e faça parte da comunidade que está construindo o futuro
        </Subtitle>
        {isAuthenticated && (
          <Link to="/new-project" className="btn btn-primary">
            <FiPlus />
            Novo Projeto
          </Link>
        )}
      </Header>

      <Controls>
        <SearchBar>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterButtons>
          <FilterButton 
            active={sortBy === 'recent'} 
            onClick={() => setSortBy('recent')}
          >
            Recentes
          </FilterButton>
          <FilterButton 
            active={sortBy === 'popular'} 
            onClick={() => setSortBy('popular')}
          >
            Populares
          </FilterButton>
        </FilterButtons>
      </Controls>

      {projects.length === 0 ? (
        <EmptyState>
          <div className="icon">📂</div>
          <h3>Nenhum projeto ainda</h3>
          <p>Seja o primeiro a compartilhar um projeto!</p>
          {isAuthenticated && (
            <Link to="/new-project" className="btn btn-primary">
              <FiPlus />
              Criar Projeto
            </Link>
          )}
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project._id}>
              <ProjectImage image={project.imageUrl} />
              
              <ProjectContent>
                <ProjectHeader>
                  <div>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectAuthor>
                      <AuthorAvatar>
                        {project.author.name.charAt(0).toUpperCase()}
                      </AuthorAvatar>
                      {project.author.name}
                    </ProjectAuthor>
                  </div>
                </ProjectHeader>

                <ProjectDescription>
                  {project.description}
                </ProjectDescription>

                <TechTags>
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <TechTag key={index}>{tech}</TechTag>
                  ))}
                  {project.technologies.length > 3 && (
                    <TechTag>+{project.technologies.length - 3}</TechTag>
                  )}
                </TechTags>

                <ProjectActions>
                  <ActionButtons>
                    <ActionButton 
                      active={project.isLikedByUser}
                      onClick={() => handleLike(project._id)}
                    >
                      <FiHeart fill={project.isLikedByUser ? 'currentColor' : 'none'} />
                      {project.likesCount}
                    </ActionButton>
                    <ActionButton>
                      <FiMessageCircle />
                      {project.comments?.length || 0}
                    </ActionButton>
                    <ActionButton>
                      <FiEye />
                      {project.views}
                    </ActionButton>
                  </ActionButtons>

                  <ProjectLinks>
                    {project.repositoryUrl && (
                      <LinkButton 
                        href={project.repositoryUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FiGithub />
                      </LinkButton>
                    )}
                    {project.demoUrl && (
                      <LinkButton 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink />
                      </LinkButton>
                    )}
                  </ProjectLinks>
                </ProjectActions>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </ProjectsContainer>
  );
};

export default Projects;