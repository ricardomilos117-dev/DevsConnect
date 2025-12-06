const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Listar vagas
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      location, 
      type, 
      level, 
      remote, 
      tech 
    } = req.query;
    
    let query = { 
      active: true, 
      expiresAt: { $gt: new Date() } 
    };

    // Filtros
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (level) {
      query.level = level;
    }

    if (remote === 'true') {
      query.remote = true;
    }

    if (tech) {
      query.technologies = { $in: [tech] };
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'username name avatar company')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Job.countDocuments(query);

    // Adicionar informações de candidatura para usuário logado
    const jobsWithUserData = jobs.map(job => {
      const jobObj = job.toObject();
      if (req.user) {
        jobObj.hasUserApplied = job.hasUserApplied(req.user._id);
        jobObj.canApply = req.user.canApplyToJob();
      }
      jobObj.applicationsCount = job.getApplicationsCount();
      return jobObj;
    });

    res.json({
      jobs: jobsWithUserData,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Obter vaga específica
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'username name avatar bio company')
      .populate('applications.user', 'username name avatar');

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    const jobObj = job.toObject();
    if (req.user) {
      jobObj.hasUserApplied = job.hasUserApplied(req.user._id);
      jobObj.canApply = req.user.canApplyToJob();
    }
    jobObj.applicationsCount = job.getApplicationsCount();

    res.json(jobObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/jobs
// @desc    Criar nova vaga
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter entre 3 e 100 caracteres'),
  body('company')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da empresa deve ter entre 2 e 100 caracteres'),
  body('description')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Descrição deve ter entre 50 e 2000 caracteres'),
  body('location')
    .isLength({ min: 2, max: 100 })
    .withMessage('Localização deve ter entre 2 e 100 caracteres'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Tipo de vaga inválido'),
  body('level')
    .isIn(['junior', 'mid', 'senior', 'lead'])
    .withMessage('Nível da vaga inválido'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma tecnologia deve ser informada'),
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um requisito deve ser informado')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const {
      title,
      company,
      description,
      requirements,
      technologies,
      location,
      remote,
      type,
      level,
      salary
    } = req.body;

    const job = new Job({
      title,
      company,
      description,
      requirements,
      technologies,
      location,
      remote: remote || false,
      type,
      level,
      salary: salary || { min: 0, max: 0, currency: 'BRL' },
      postedBy: req.user.id
    });

    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'username name avatar');

    res.status(201).json({
      message: 'Vaga criada com sucesso',
      job: populatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Atualizar vaga
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verificar se o usuário é o autor
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const allowedUpdates = [
      'title', 'company', 'description', 'requirements', 
      'technologies', 'location', 'remote', 'type', 
      'level', 'salary', 'active'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate('postedBy', 'username name avatar');

    res.json({
      message: 'Vaga atualizada com sucesso',
      job: updatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Deletar vaga
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verificar se o usuário é o autor
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vaga deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Candidatar-se a vaga
// @access  Private
router.post('/:id/apply', auth, [
  body('coverLetter')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Carta de apresentação deve ter no máximo 1000 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    if (!job.active || job.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Esta vaga não está mais ativa' });
    }

    // Verificar se já se candidatou
    if (job.hasUserApplied(req.user.id)) {
      return res.status(400).json({ message: 'Você já se candidatou a esta vaga' });
    }

    // Verificar limite de candidaturas
    if (!user.canApplyToJob()) {
      return res.status(400).json({ 
        message: 'Você atingiu o limite de candidaturas. Faça upgrade para premium para candidaturas ilimitadas.' 
      });
    }

    // Adicionar candidatura
    job.applications.push({
      user: req.user.id,
      coverLetter: req.body.coverLetter || ''
    });

    // Incrementar contador de candidaturas do usuário
    user.jobApplicationsCount += 1;

    await job.save();
    await user.save();

    res.json({
      message: 'Candidatura enviada com sucesso',
      applicationsCount: job.getApplicationsCount()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/jobs/:id/applications
// @desc    Listar candidaturas da vaga (apenas para o autor)
// @access  Private
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applications.user', 'username name avatar bio skills');

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verificar se o usuário é o autor
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json({
      applications: job.applications,
      total: job.applications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/jobs/:id/applications/:applicationId
// @desc    Atualizar status da candidatura
// @access  Private
router.put('/:id/applications/:applicationId', auth, [
  body('status')
    .isIn(['pending', 'reviewing', 'accepted', 'rejected'])
    .withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verificar se o usuário é o autor
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const application = job.applications.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    application.status = req.body.status;
    await job.save();

    res.json({
      message: 'Status da candidatura atualizado com sucesso',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/jobs/my/applications
// @desc    Listar candidaturas do usuário
// @access  Private
router.get('/my/applications', auth, async (req, res) => {
  try {
    const jobs = await Job.find({
      'applications.user': req.user.id
    })
    .populate('postedBy', 'username name avatar company')
    .select('title company location type level applications createdAt');

    const userApplications = jobs.map(job => {
      const application = job.applications.find(
        app => app.user.toString() === req.user.id
      );
      
      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          level: job.level,
          postedBy: job.postedBy,
          createdAt: job.createdAt
        },
        application: {
          _id: application._id,
          status: application.status,
          appliedAt: application.appliedAt,
          coverLetter: application.coverLetter
        }
      };
    });

    res.json({
      applications: userApplications,
      total: userApplications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;