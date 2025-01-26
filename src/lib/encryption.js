const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY; // Replace this with a secure secret in production.

export const encryptPrivateKey = async (privateKey) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('static-salt'), // In production, use a unique salt for each user
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Random initialization vector
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(privateKey)
  );

  return { encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))), iv: btoa(String.fromCharCode(...iv)) };
};

export const decryptPrivateKey = async (encryptedKey, iv) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // Import the secret key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive the decryption key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('static-salt'), // Use the same salt used during encryption
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Decrypt the private key
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)), // Decode the IV from Base64
    },
    key,
    Uint8Array.from(atob(encryptedKey), (c) => c.charCodeAt(0)) // Decode the encrypted key from Base64
  );

  return dec.decode(decrypted); // Convert the decrypted data back to a string
};