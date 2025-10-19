const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authenticateToken, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Listar usuários da clínica
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, permissions, active, created_at FROM users WHERE clinic_id = $1',
      [req.user.clinicId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo usuário
router.post('/', authenticateToken, requirePermission('clinica_admin'), async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // Verificar se email já existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO users (name, email, password, clinic_id, permissions) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, permissions, active, created_at',
      [name, email, hashedPassword, req.user.clinicId, JSON.stringify(permissions)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar permissões do usuário
router.put('/:id/permissions', authenticateToken, requirePermission('clinica_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    // Verificar se usuário pertence à mesma clínica
    const userCheck = await pool.query('SELECT clinic_id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0 || userCheck.rows[0].clinic_id !== req.user.clinicId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await pool.query('UPDATE users SET permissions = $1 WHERE id = $2', [JSON.stringify(permissions), id]);
    
    res.json({ message: 'Permissões atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar permissões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;