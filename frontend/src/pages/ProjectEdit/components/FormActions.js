import React from 'react';
import { Save } from 'lucide-react';

/**
 * FormActions component for the project edit form's submit button
 * 
 * @param {object} props - Component props
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} FormActions component
 */
const FormActions = ({ saving }) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        style={{
          backgroundColor: saving ? 'rgba(10, 132, 255, 0.6)' : '#0A84FF'
        }}
        className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={saving}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Simpan Perubahan
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;