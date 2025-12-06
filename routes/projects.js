const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Listar projetos
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'recent', search, tech } = req.query;
    
    let query = {};
    let sortOption = {};

    // Filtro de busca
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro por tecnologia
    if (tech) {
      query.technologies = { $in: [tech] };
    }

    // Opções de ordenação
    switch (sort) {
      case 'popular':
        sortOption = { 'likes': -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const projects = await Project.find(query)
      .populate('author', 'username name avatar')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username name avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Project.countDocuments(query);

    // Adicionar informações de curtida para usuário logado
    const projectsWithUserData = projects.map(project => {
      const projectObj = project.toObject();
      if (req.user) {
        projectObj.isLikedByUser = project.isLikedBy(req.user._id);
      }
      projectObj.likesCount = project.getLikesCount();
      return projectObj;
    });

    res.json({
      projects: projectsWithUserData,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/projects/:id
// @desc    Obter projeto específico
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username name avatar bio')
      .populate('likes.user', 'username name avatar')
      .populate('comments.user', 'username name avatar');

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Incrementar visualizações
    project.views += 1;
    await project.save();

    const projectObj = project.toObject();
    if (req.user) {
      projectObj.isLikedByUser = project.isLikedBy(req.user._id);
    }
    projectObj.likesCount = project.getLikesCount();

    res.json(projectObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/projects
// @desc    Criar novo projeto
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter entre 3 e 100 caracteres'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma tecnologia deve ser informada'),
  body('repositoryUrl')
    .optional()
    .isURL()
    .withMessage('URL do repositório inválida'),
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('URL da demo inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { title, description, imageUrl, repositoryUrl, demoUrl, technologies } = req.body;

    const project = new Project({
      title,
      description,
      imageUrl: imageUrl || '',
      repositoryUrl: repositoryUrl || '',
      demoUrl: demoUrl || '',
      technologies,
      author: req.user.id
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatar');

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project: populatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Atualizar projeto
// @access  Private
router.put('/:id', auth, [
  body('title').optional().isLength({ min: 3, max: 100 }),
  body('description').optional().isLength({ min: 10, max: 1000 }),
  body('technologies').optional().isArray({ min: 1 }),
  body('repositoryUrl').optional().isURL(),
  body('demoUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Verificar se o usuário é o autor
    if (project.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { title, description, imageUrl, repositoryUrl, demoUrl, technologies } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (imageUrl !== undefined) project.imageUrl = imageUrl;
    if (repositoryUrl !== undefined) project.repositoryUrl = repositoryUrl;
    if (demoUrl !== undefined) project.demoUrl = demoUrl;
    if (technologies) project.technologies = technologies;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatar');

    res.json({
      message: 'Projeto atualizado com sucesso',
      project: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Deletar projeto
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Verificar se o usuário é o autor
    if (project.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/projects/:id/like
// @desc    Curtir/descurtir projeto
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const isLiked = project.isLikedBy(req.user.id);

    if (isLiked) {
      // Remover curtida
      project.likes = project.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Adicionar curtida
      project.likes.push({ user: req.user.id });
    }

    await project.save();

    res.json({
      message: isLiked ? 'Curtida removida' : 'Projeto curtido',
      likesCount: project.getLikesCount(),
      isLiked: !isLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/projects/:id/comment
// @desc    Comentar em projeto
// @access  Private
router.post('/:id/comment', auth, [
  body('text')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comentário deve ter entre 1 e 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    project.comments.push(newComment);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('comments.user', 'username name avatar');

    const addedComment = updatedProject.comments[updatedProject.comments.length - 1];

    res.status(201).json({
      message: 'Comentário adicionado com sucesso',
      comment: addedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/projects/:id/comment/:commentId
// @desc    Deletar comentário
// @access  Private
router.delete('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const comment = project.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    // Verificar se o usuário é o autor do comentário ou do projeto
    if (comment.user.toString() !== req.user.id && project.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    project.comments.pull(req.params.commentId);
    await project.save();

    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;