export const GLOBAL_CONFIG = {
  jwtVerifyExp: process.env.JWT_VERIFY_EXP,
  jwtVerifySecret: process.env.JWT_VERIFY_SECRET,
  jwtAuthExp: process.env.JWT_AUTH_EXP,
  jwtAuthSecret: process.env.JWT_AUTH_SECRET,

  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASSWORD,
  frontendConfirmLink: process.env.FRONTEND_CONFIRM_LINK,
  emailLogo: process.env.EMAIL_LOGO,
};
