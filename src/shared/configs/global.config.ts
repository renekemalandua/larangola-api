export const GLOBAL_CONFIG = {
  jwtAuthExp: process.env.JWT_AUTH_EXP,
  jwtAuthSecret: process.env.JWT_AUTH_SECRET,

  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASSWORD,
  frontendConfirmLink: process.env.FRONTEND_CONFIRM_LINK,
  emailLogo: process.env.EMAIL_LOGO,
};
