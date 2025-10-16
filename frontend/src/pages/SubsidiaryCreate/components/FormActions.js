import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

/**
 * Form actions for the subsidiary create form
 * 
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state
 * @returns {JSX.Element} Form actions component
 */
const FormActions = ({ loading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-end gap-4 pt-6">
      <button
        type="button"
        onClick={() => navigate('/subsidiaries')}
        className="px-6 py-3 rounded-lg transition-colors font-medium"
        style={{
          border: "1px solid #38383A",
          color: "#98989D",
          backgroundColor: "transparent"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2C2C2E'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
          color: '#FFFFFF'
        }}
      >
        <Save size={20} />
        {loading ? 'Menyimpan...' : 'Simpan Anak Usaha'}
      </button>
    </div>
  );
};

export default FormActions;