const TRANSLATION_HASH_LENGTH = 8;

export const computeDigestForJson = async (json: string): Promise<string> => {
  const messageBuffer = new TextEncoder().encode(json);
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);

  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hash.substring(0, TRANSLATION_HASH_LENGTH).toLowerCase();
};

export const importJwtVerificationSecret = (jwtVerificationKey: string): Promise<CryptoKey> => {
  return crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(jwtVerificationKey), c => c.charCodeAt(0)),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['verify'],
  );
};
