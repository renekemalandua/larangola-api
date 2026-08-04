const CLOUDINARY_DEFAULT_AVATAR ='https://res.cloudinary.com/dayiorfxq/image/upload/v1768649105/larangola/users/pelpdpphrwosjdqbnu95.jpg';
const S3_DEFAULT_AVATAR ='https://larangola-bucket.s3.us-east-1.amazonaws.com/larangola/payments/f9f3379d-78cc-44b2-a99d-497992356367.jpg';

export const DEFAULT_USER_AVATAR =
  process.env.UPLOAD_PROVIDER === 's3'
    ? S3_DEFAULT_AVATAR
    : CLOUDINARY_DEFAULT_AVATAR;
