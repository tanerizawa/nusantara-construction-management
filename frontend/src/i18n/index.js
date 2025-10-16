import * as id from './id';

/**
 * Hook sederhana untuk mengakses terjemahan
 * 
 * @returns {Object} Objek berisi semua konstanta bahasa
 * @example
 * // Di dalam komponen
 * const { common, users } = useTranslation();
 * return <h1>{users.title}</h1>;
 */
export function useTranslation() {
  // Saat ini hanya mendukung bahasa Indonesia
  // Di masa depan bisa ditambahkan dukungan untuk bahasa lain
  return id;
}

/**
 * Helper function untuk mengganti placeholder dalam teks terjemahan
 * 
 * @param {string} text Teks dengan placeholder, misalnya "Halaman {page} dari {total}"
 * @param {Object} params Objek berisi nilai untuk menggantikan placeholder
 * @returns {string} Teks dengan placeholder yang sudah diganti
 * @example
 * // Mengganti placeholder {count} dengan nilai 5
 * formatMessage('Showing {count} items', { count: 5 }) // "Showing 5 items"
 */
export function formatMessage(text, params) {
  if (!text) return '';
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    return result.replace(regex, value);
  }, text);
}