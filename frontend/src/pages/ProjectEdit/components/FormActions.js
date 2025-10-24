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
    <div className="flex justify-end pt-2">
      <button
        type="submit"
        className="inline-flex items-center px-6 py-2.5 rounded-lg text-white font-medium 
                 bg-[#0A84FF] hover:bg-[#0077ED] transition-colors 
                 disabled:opacity-50 disabled:cursor-not-allowed"
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