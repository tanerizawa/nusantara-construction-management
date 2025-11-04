import React from 'react';
import { CLIENTS_DATA } from '../config/contentData';

export const ClientsSection = ({ className = '' }) => (
  <section id="clients" className={`py-16 bg-white ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Mitra & Instansi Terkait</h3>
        <p className="text-gray-600">Sebagian mitra dan instansi yang pernah bekerja sama</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
        {CLIENTS_DATA.map((c, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex items-center justify-center hover:shadow-md transition-shadow duration-300">
            {c.logo ? (
              <img
                src={c.logo}
                alt={`Logo ${c.name}`}
                loading="lazy"
                className="max-h-12 object-contain"
              />
            ) : (
              <span className="text-gray-700 font-semibold">{c.short || c.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;

