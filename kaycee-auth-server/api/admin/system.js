/**
 * /api/admin/system.js
 * POST /api/admin/system - Lock/Unlock system remotely
 */
const { query, isAdmin, handleCors } = require('../../lib/db');

module.exports = async (req, res) => {
    if (handleCors(req, res)) return;
    if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    try {
        const { action, message } = req.body;
        
        if (action === 'lock') {
            // Lock system
            await query(
                `UPDATE system_settings SET setting_value = 'locked', updated_at = NOW() 
                 WHERE setting_key = 'system_status'`
            );
            
            if (message) {
                await query(
                    `UPDATE system_settings SET setting_value = $1, updated_at = NOW() 
                     WHERE setting_key = 'lock_message'`,
                    [message]
                );
            }
            
            return res.json({ 
                success: true, 
                message: 'System locked successfully',
                status: 'locked'
            });
        }
        
        if (action === 'unlock') {
            // Unlock system
            await query(
                `UPDATE system_settings SET setting_value = 'active', updated_at = NOW() 
                 WHERE setting_key = 'system_status'`
            );
            
            return res.json({ 
                success: true, 
                message: 'System unlocked successfully',
                status: 'active'
            });
        }
        
        if (action === 'get_status') {
            // Get current status
            const result = await query(
                `SELECT setting_key, setting_value, updated_at 
                 FROM system_settings 
                 WHERE setting_key IN ('system_status', 'lock_message')`
            );
            
            const settings = {};
            result.rows.forEach(row => {
                settings[row.setting_key] = row.setting_value;
            });
            
            return res.json({
                success: true,
                status: settings.system_status || 'active',
                message: settings.lock_message || '',
                locked: settings.system_status === 'locked'
            });
        }
        
        return res.json({ success: false, error: 'Invalid action' });
        
    } catch (err) {
        console.error('[SYSTEM CONTROL ERROR]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};
