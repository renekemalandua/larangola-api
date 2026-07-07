export const GLOBAL_CONFIG = {
  jwtAuthExp: process.env.JWT_AUTH_EXP,
  jwtAuthSecret: process.env.JWT_AUTH_SECRET,

  resendApiKey: process.env.RESEND_API_KEY,
  emailLogo: process.env.EMAIL_LOGO || 'https://larangola.ao/logo-full.svg',
  mailFrom: process.env.MAIL_FROM || 'info@larangola.co.ao',
};
