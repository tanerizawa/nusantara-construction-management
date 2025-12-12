import React from 'react';

/**
 * Client Information Section
 * Company name, contact person, phone, email
 */
const ClientInfoSection = ({ formData, errors, handleInputChange }) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-5">
        <p className="eyebrow-label text-white/60">Step 2</p>
        <h2 className="text-xl font-semibold text-white">Informasi Klien</h2>
        <p className="text-sm text-white/50">Detail perusahaan klien membantu sinkronisasi kontrak dan dokumen formal.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Nama Perusahaan *
          </label>
          <input
            type="text"
            value={formData.client.company}
            onChange={(e) => handleInputChange('client.company', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0
                      ${errors['client.company'] ? 'border-[#fb7185] bg-[#1c0f13]' : 'border-white/10 bg-white/5'}`}
            placeholder="Nama perusahaan klien"
          />
          {errors['client.company'] && (
            <p className="mt-1 text-sm text-[#FF3B30]">{errors['client.company']}</p>
          )}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Kontak Person
          </label>
          <input
            type="text"
            value={formData.client.contact}
            onChange={(e) => handleInputChange('client.contact', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Nama kontak person"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Telepon Klien
          </label>
          <input
            type="tel"
            value={formData.client.phone}
            onChange={(e) => handleInputChange('client.phone', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="081234567890"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Email Klien
          </label>
          <input
            type="email"
            value={formData.client.email}
            onChange={(e) => handleInputChange('client.email', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="email@client.com"
          />
        </div>
      </div>
    </section>
  );
};

export default ClientInfoSection;
