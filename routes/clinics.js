const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Obter dados da clínica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.clinicId !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query('SELECT * FROM clinics WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clínica não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar clínica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar módulos da clínica
router.put('/:id/modules', authenticateToken, requirePermission('clinica_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;

    if (req.user.clinicId !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await pool.query('UPDATE clinics SET modules = $1 WHERE id = $2', [JSON.stringify(modules), id]);
    
    res.json({ message: 'Módulos atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar módulos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;