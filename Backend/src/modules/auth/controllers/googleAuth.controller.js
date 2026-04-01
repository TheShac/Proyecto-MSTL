import { resolveOrCreateGoogleUser, signToken } from '../services/auth.service.js';

export const googleCallback = async (req, res) => {
  try {
    const payload = await resolveOrCreateGoogleUser(req.user);
    const token   = signToken(payload);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
    );
  } catch (error) {
    console.error(error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    );
  }
};