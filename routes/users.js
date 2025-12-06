const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Obter perfil do usuário
// @access  Public
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/users/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', auth, [
  body('name').optional().isLength({ min: 2, max: 100 }),
  body('bio').optional().isLength({ max: 500 }),
  body('skills').optional().isArray(),
  body('github').optional().isURL().withMessage('URL do GitHub inválida'),
  body('linkedin').optional().isURL().withMessage('URL do LinkedIn inválida'),
  body('website').optional().isURL().withMessage('URL do website inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errors.array() 
      });
    }

    const { name, bio, skills, github, linkedin, website } = req.body;

    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (website !== undefined) user.website = website;

    await user.save();

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: await User.findById(user._id).select('-password')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Seguir usuário
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (req.params.userId === req.user.id.toString()) {
      return res.status(400).json({ message: 'Você não pode seguir a si mesmo' });
    }

    // Verificar se já está seguindo
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Você já segue este usuário' });
    }

    // Adicionar aos seguidores e seguindo
    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'Usuário seguido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/users/unfollow/:userId
// @desc    Deixar de seguir usuário
// @access  Private
router.delete('/unfollow/:userId', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se está seguindo
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Você não segue este usuário' });
    }

    // Remover dos seguidores e seguindo
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'Usuário removido dos seguidos' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/users/upgrade-premium
// @desc    Upgrade para premium
// @access  Private
router.post('/upgrade-premium', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Simular pagamento (em produção, integrar com gateway de pagamento)
    user.isPremium = true;
    user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano
    
    await user.save();

    res.json({
      message: 'Upgrade para premium realizado com sucesso',
      user: await User.findById(user._id).select('-password')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;