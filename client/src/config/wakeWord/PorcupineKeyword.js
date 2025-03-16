let porcupineKeywordBase64;

try {
  porcupineKeywordBase64 = (await import('./porcupineKeywordBase64')).default;
} catch (error) {
  console.warn(
    'Warning: porcupineKeywordBase64.js file not found. Using default value.'
  );
  porcupineKeywordBase64 = '';
}

export default {
  base64: porcupineKeywordBase64,
  label: 'Magic Mirror',
};
