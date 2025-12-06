import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../utils/api';
import { 
  FiStar, 
  FiCheck, 
  FiX, 
  FiZap, 
  FiTrendingUp, 
  FiShield,

  FiArrowRight
} from 'react-icons/fi';
import styled from 'styled-components';

const PremiumContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  .highlight {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const PlansContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
  background: ${props => props.premium ? 
    'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: ${props => props.premium ? 
    '2px solid rgba(251, 191, 36, 0.5)' : 
    '1px solid rgba(255, 255, 255, 0.1)'
  };
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    border-color: ${props => props.premium ? 
      'rgba(251, 191, 36, 0.8)' : 
      'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.premium ? '#fbbf24' : 'white'};
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  
  .currency {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .period {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
  }
`;

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  
  .icon {
    color: ${props => props.available ? '#22c55e' : '#ef4444'};
    flex-shrink: 0;
  }
  
  .text {
    ${props => !props.available && 'opacity: 0.5; text-decoration: line-through;'}
  }
`;

const PlanButton = styled.button`
  width: 100%;
  background: ${props => props.premium ? 
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.premium ? '#1f2937' : 'white'};
  border: ${props => props.premium ? 
    'none' : 
    '1px solid rgba(255, 255, 255, 0.2)'
  };
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: ${props => props.premium ? 
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
      'rgba(255, 255, 255, 0.15)'
    };
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BenefitsSection = styled.div`
  max-width: 800px;
  margin: 4rem auto 0;
  padding: 0 20px;
  text-align: center;
`;

const BenefitsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: white;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BenefitCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  
  .icon {
    font-size: 2.5rem;
    color: #fbbf24;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const CurrentPlanBadge = styled.div`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simular upgrade para premium
      const response = await usersAPI.upgradePremium();
      console.log('Resposta do upgrade:', response.data);
      
      if (response.data.user) {
        updateUser(response.data.user);
        alert('Upgrade realizado com sucesso! Agora você é um membro Premium!');
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      alert('Erro ao processar upgrade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      name: 'Candidaturas ilimitadas',
      free: false,
      premium: true
    },
    {
      name: 'Destaque em projetos',
      free: false,
      premium: true
    },
    {
      name: 'Acesso a vagas exclusivas',
      free: false,
      premium: true
    },
    {
      name: 'Badge premium no perfil',
      free: false,
      premium: true
    },
    {
      name: 'Suporte prioritário',
      free: false,
      premium: true
    },
    {
      name: 'Visualizar projetos',
      free: true,
      premium: true
    },
    {
      name: 'Criar projetos',
      free: true,
      premium: true
    },
    {
      name: 'Comentar e curtir',
      free: true,
      premium: true
    },
    {
      name: '5 candidaturas por mês',
      free: true,
      premium: false
    }
  ];

  return (
    <PremiumContainer>
      <Header>
        <Title>
          Desbloqueie todo o <span className="highlight">potencial</span>
        </Title>
        <Subtitle>
          Upgrade para Premium e tenha acesso a recursos exclusivos que vão acelerar sua carreira
        </Subtitle>
      </Header>

      <PlansContainer>
        {/* Plano Gratuito */}
        <PlanCard>
          <PlanHeader>
            <PlanName>Gratuito</PlanName>
            <PlanPrice>
              <span className="currency">R$</span> 0
              <span className="period">/mês</span>
            </PlanPrice>
            <PlanDescription>
              Perfeito para começar e explorar a plataforma
            </PlanDescription>
          </PlanHeader>

          <FeaturesList>
            {features.map((feature, index) => (
              <FeatureItem key={index} available={feature.free}>
                <div className="icon">
                  {feature.free ? <FiCheck /> : <FiX />}
                </div>
                <span className="text">{feature.name}</span>
              </FeatureItem>
            ))}
          </FeaturesList>

          <PlanButton disabled={!user?.isPremium}>
            {user?.isPremium ? 'Plano Atual' : 'Plano Atual'}
          </PlanButton>
          
          {!user?.isPremium && (
            <CurrentPlanBadge>
              <FiCheck />
              Plano Atual
            </CurrentPlanBadge>
          )}
        </PlanCard>

        {/* Plano Premium */}
        <PlanCard premium>
          {!user?.isPremium && (
            <PlanBadge>
              <FiStar />
              Recomendado
            </PlanBadge>
          )}
          
          <PlanHeader>
            <PlanName premium>Premium</PlanName>
            <PlanPrice>
              <span className="currency">R$</span> 29
              <span className="period">/mês</span>
            </PlanPrice>
            <PlanDescription>
              Para desenvolvedores que querem acelerar sua carreira
            </PlanDescription>
          </PlanHeader>

          <FeaturesList>
            {features.map((feature, index) => (
              <FeatureItem key={index} available={feature.premium}>
                <div className="icon">
                  {feature.premium ? <FiCheck /> : <FiX />}
                </div>
                <span className="text">{feature.name}</span>
              </FeatureItem>
            ))}
          </FeaturesList>

          <PlanButton 
            premium 
            onClick={handleUpgrade}
            disabled={loading || user?.isPremium}
          >
            {user?.isPremium ? (
              'Plano Atual'
            ) : loading ? (
              'Processando...'
            ) : (
              <>
                Fazer Upgrade <FiArrowRight />
              </>
            )}
          </PlanButton>
          
          {user?.isPremium && (
            <CurrentPlanBadge>
              <FiStar />
              Plano Atual
            </CurrentPlanBadge>
          )}
        </PlanCard>
      </PlansContainer>

      <BenefitsSection>
        <BenefitsTitle>Por que escolher o Premium?</BenefitsTitle>
        
        <BenefitsGrid>
          <BenefitCard>
            <div className="icon">
              <FiZap />
            </div>
            <h3>Candidaturas Ilimitadas</h3>
            <p>
              Candidate-se a quantas vagas quiser sem limitações mensais
            </p>
          </BenefitCard>
          
          <BenefitCard>
            <div className="icon">
              <FiTrendingUp />
            </div>
            <h3>Destaque seus Projetos</h3>
            <p>
              Seus projetos aparecem em destaque para mais visibilidade
            </p>
          </BenefitCard>
          
          <BenefitCard>
            <div className="icon">
              <FiShield />
            </div>
            <h3>Vagas Exclusivas</h3>
            <p>
              Acesso a oportunidades exclusivas para membros premium
            </p>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>
    </PremiumContainer>
  );
};

export default Premium;