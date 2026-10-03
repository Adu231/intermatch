import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'internmatch_jwt_super_secret_key_2026_key', {
    expiresIn: '30d'
  })
}
