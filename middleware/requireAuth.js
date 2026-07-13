/**
 * Admin panelning himoyalangan route'lari uchun middleware.
 * Session'da isAdmin=true bo'lmasa, 401 qaytaradi.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Avtorizatsiyadan o'ting" });
}

module.exports = requireAuth;
