import db from '../config/db.js';

export const logAuditTrail = (actionType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      res.send = originalSend;
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user ? req.user.id : null;
        const details = JSON.stringify({
          path: req.originalUrl,
          method: req.method,
          body: req.body
        });

        db.query(
          'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
          [userId, actionType, details]
        ).catch(err => console.error('Audit Logging Error:', err));
      }
      
      return res.send(data);
    };

    next();
  };
};