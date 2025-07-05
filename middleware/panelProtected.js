function panelProtected(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    
    if (req.user.email !== 'example@example.com') {
        return res.status(403).send('Access Denied: Admins Only');
    }

    next();
}

module.exports = panelProtected;
