import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generate2FASecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `Right Tech Centre (${email})`,
    issuer: 'Right Tech Centre'
  });
  
  return secret;
};

export const verify2FAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps before/after for clock skew
  });
};

export const generateQRCode = async (otpauthUrl) => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};
