import React from 'react';
import { CLIENTS_DATA } from '../config/contentData';

export const ClientsSection = ({ className = '' }) => (
  <section
    id="clients"
    className={`relative py-16 bg-slate-50 overflow-hidden ${className}`}
    aria-label="Mitra dan instansi"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100" />
    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-3">Kepercayaan</p>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">Mitra & Instansi Terkait</h3>
        <p className="text-slate-600">
          Sebagian lembaga dan instansi pemerintah yang pernah berkolaborasi dengan kami.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
        {CLIENTS_DATA.map((client, idx) => (
          <div
            key={idx}
            className="bg-white/80 border border-slate-100 rounded-2xl p-6 flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur hover:-translate-y-1"
          >
            {client.logo ? (
              <img
                src={client.logo}
                alt={`Logo ${client.name}`}
                loading="lazy"
                className="max-h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            ) : (
              <span className="text-slate-700 font-semibold">{client.short || client.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
