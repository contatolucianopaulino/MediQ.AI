const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const userResult = await pool.query(
      'SELECT u.*, c.name as clinic_name FROM users u LEFT JOIN clinics c ON u.clinic_id = c.id WHERE u.email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = userResult.rows[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, clinicId: user.clinic_id, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        clinic_id: user.clinic_id,
        clinic_name: user.clinic_name,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registro de clínica
router.post('/register-clinic', async (req, res) => {
  try {
    const { clinicName, adminName, email, password, phone, address } = req.body;

    // Verificar se email já existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar clínica
    const clinicResult = await pool.query(
      'INSERT INTO clinics (name, email, phone, address, modules) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [clinicName, email, phone, address, ['prescricao_ia', 'transcricao_audio']]
    );

    const clinicId = clinicResult.rows[0].id;

    // Criar usuário admin
    await pool.query(
      'INSERT INTO users (name, email, password, clinic_id, permissions) VALUES ($1, $2, $3, $4, $5)',
      [adminName, email, hashedPassword, clinicId, ['clinica_admin']]
    );

    res.json({ message: 'Clínica registrada com sucesso' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;