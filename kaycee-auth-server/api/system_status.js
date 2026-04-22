/**
 * /api/system_status.js
 * GET /api/system_status - Check if system is active or locked
 */
const { query, handleCors } = require('../lib/db');

module.exports = async (req, res) => {
    if (handleCors(req, res)) return;
    
    try {
        const result = await query(
            `SELECT setting_value FROM system_settings WHERE setting_key = 'system_status'`
        );
        
        const status = result.rows[0]?.setting_value || 'active';
        
        if (status === 'locked') {
            const msgResult = await query(
                `SELECT setting_value FROM system_settings WHERE setting_key = 'lock_message'`
            );
            const message = msgResult.rows[0]?.setting_value || 'System is locked';
            
            return res.json({
                success: false,
                locked: true,
                message: message
            });
        }
        
        res.json({
            success: true,
            locked: false,
            status: 'active'
        });
        
    } catch (err) {
        console.error('[SYSTEM STATUS ERROR]', err.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
