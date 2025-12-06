const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDB = async () => {
  try {
    let mongoUri;
    
    if (process.env.NODE_ENV === 'development' || !process.env.MONGODB_URI) {
      // Usar MongoDB em memória para desenvolvimento
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Usando MongoDB em memória para desenvolvimento');
    } else {
      mongoUri = process.env.MONGODB_URI;
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Criar dados de exemplo se estiver em desenvolvimento
    if (process.env.NODE_ENV === 'development' || !process.env.MONGODB_URI) {
      await createSampleData();
    }
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
};

const createSampleData = async () => {
  try {
    const User = require('../models/User');
    const Project = require('../models/Project');
    const Job = require('../models/Job');

    // Verificar se já existem dados
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Dados de exemplo já existem');
      return;
    }

    console.log('Criando dados de exemplo...');

    // Criar usuários de exemplo
    const users = await User.create([
      {
        username: 'johndoe',
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        bio: 'Desenvolvedor Full Stack apaixonado por tecnologia',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        github: 'https://github.com/johndoe',
        isPremium: false
      },
      {
        username: 'janedoe',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        bio: 'Frontend Developer & UI/UX Designer',
        skills: ['React', 'TypeScript', 'CSS', 'Figma'],
        linkedin: 'https://linkedin.com/in/janedoe',
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        username: 'devmaster',
        name: 'Dev Master',
        email: 'dev@example.com',
        password: '123456',
        bio: 'Senior Developer com 10+ anos de experiência',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        website: 'https://devmaster.dev',
        isPremium: false
      }
    ]);

    // Criar projetos de exemplo
    const projects = await Project.create([
      {
        title: 'E-commerce Platform',
        description: 'Uma plataforma completa de e-commerce construída com React e Node.js. Inclui carrinho de compras, sistema de pagamento e painel administrativo.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        author: users[0]._id,
        repositoryUrl: 'https://github.com/johndoe/ecommerce',
        demoUrl: 'https://ecommerce-demo.com',
        imageUrl: 'https://via.placeholder.com/400x200/06b6d4/ffffff?text=E-commerce',
        views: 150,
        likes: [
          { user: users[1]._id },
          { user: users[2]._id }
        ],
        comments: [
          {
            user: users[1]._id,
            text: 'Projeto incrível! Adorei a interface.'
          }
        ]
      },
      {
        title: 'Task Manager App',
        description: 'Aplicativo de gerenciamento de tarefas com interface moderna e funcionalidades avançadas de organização.',
        technologies: ['React', 'TypeScript', 'Firebase'],
        author: users[1]._id,
        repositoryUrl: 'https://github.com/janedoe/taskmanager',
        demoUrl: 'https://taskmanager-demo.com',
        imageUrl: 'https://via.placeholder.com/400x200/0891b2/ffffff?text=Task+Manager',
        views: 89,
        likes: [
          { user: users[0]._id }
        ],
        comments: []
      },
      {
        title: 'API REST com Python',
        description: 'API RESTful robusta construída com Django REST Framework, incluindo autenticação JWT e documentação automática.',
        technologies: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        author: users[2]._id,
        repositoryUrl: 'https://github.com/devmaster/django-api',
        imageUrl: 'https://via.placeholder.com/400x200/0e7490/ffffff?text=Django+API',
        views: 234,
        likes: [
          { user: users[0]._id },
          { user: users[1]._id }
        ],
        comments: [
          {
            user: users[0]._id,
            text: 'Excelente documentação!'
          },
          {
            user: users[1]._id,
            text: 'Vou usar como referência nos meus projetos.'
          }
        ]
      }
    ]);

    // Criar vagas de exemplo
    const jobs = await Job.create([
      {
        title: 'Desenvolvedor Frontend React',
        company: 'TechCorp',
        description: 'Estamos procurando um desenvolvedor frontend experiente em React para se juntar ao nosso time. Você trabalhará em projetos inovadores e terá a oportunidade de crescer profissionalmente.',
        requirements: [
          '3+ anos de experiência com React',
          'Conhecimento em TypeScript',
          'Experiência com testes unitários',
          'Conhecimento em Git'
        ],
        technologies: ['React', 'TypeScript', 'Jest', 'CSS'],
        location: 'São Paulo, SP',
        remote: true,
        type: 'full-time',
        level: 'mid',
        salary: {
          min: 8000,
          max: 12000,
          currency: 'BRL'
        },
        postedBy: users[2]._id,
        applications: []
      },
      {
        title: 'Desenvolvedor Full Stack',
        company: 'StartupXYZ',
        description: 'Oportunidade única para trabalhar em uma startup em crescimento. Buscamos alguém versátil que possa trabalhar tanto no frontend quanto no backend.',
        requirements: [
          'Experiência com JavaScript/Node.js',
          'Conhecimento em bancos de dados',
          'Experiência com APIs REST',
          'Proatividade e autonomia'
        ],
        technologies: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
        location: 'Rio de Janeiro, RJ',
        remote: false,
        type: 'full-time',
        level: 'junior',
        salary: {
          min: 5000,
          max: 8000,
          currency: 'BRL'
        },
        postedBy: users[1]._id,
        applications: [
          {
            user: users[0]._id,
            coverLetter: 'Tenho grande interesse nesta vaga e acredito que minha experiência se alinha perfeitamente com os requisitos.',
            status: 'pending'
          }
        ]
      },
      {
        title: 'Senior Python Developer',
        company: 'DataTech Solutions',
        description: 'Procuramos um desenvolvedor Python sênior para liderar projetos de análise de dados e machine learning.',
        requirements: [
          '5+ anos de experiência com Python',
          'Experiência com Django/Flask',
          'Conhecimento em Data Science',
          'Experiência com cloud (AWS/GCP)'
        ],
        technologies: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
        location: 'Remoto',
        remote: true,
        type: 'full-time',
        level: 'senior',
        salary: {
          min: 15000,
          max: 20000,
          currency: 'BRL'
        },
        postedBy: users[0]._id,
        applications: []
      }
    ]);

    console.log('Dados de exemplo criados com sucesso!');
    console.log(`- ${users.length} usuários criados`);
    console.log(`- ${projects.length} projetos criados`);
    console.log(`- ${jobs.length} vagas criadas`);
    
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Erro ao desconectar MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };