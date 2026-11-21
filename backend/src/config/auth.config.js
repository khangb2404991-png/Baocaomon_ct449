module.exports = {
  secret: process.env.JWT_SECRET || 'bls_super_secret_jwt_key_ct449_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
