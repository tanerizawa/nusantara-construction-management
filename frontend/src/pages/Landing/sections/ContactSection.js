import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { LANDING_CONFIG } from '../config/landingConfig';
import { useFormActions } from '../hooks/useInteractions';

export const ContactSection = ({ className = '' }) => {
  const { contact } = LANDING_CONFIG;
  const { formData, isSubmitting, submitStatus, updateField, submitForm } = useFormActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm('/api/contact', formData);
  };

  return (
    <section 
      id="contact" 
      className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Siap membantu mewujudkan proyek konstruksi impian Anda. 
            Konsultasi gratis dan tanpa komitmen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <ContactInfo contact={contact} />
          
          {/* Contact Form */}
          <ContactForm 
            formData={formData}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            onFieldUpdate={updateField}
            onSubmit={handleSubmit}
          />
        </div>

        {/* CTA Section */}
        <CTASection contact={contact} />
      </div>
    </section>
  );
};

const ContactInfo = ({ contact }) => {
  const contactItems = [
    {
      icon: MapPin,
      title: 'Alamat Kantor',
      content: contact.address,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: contact.phone,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: contact.email,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: contact.workingHours,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-8">
        Informasi Kontak
      </h3>
      
      <div className="space-y-6 mb-8">
        {contactItems.map((item, index) => (
          <ContactInfoCard key={index} item={item} />
        ))}
      </div>

      {/* Map Embed */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <iframe
          title="Peta Lokasi Kantor Nusantara Group"
          src="https://www.google.com/maps?q=Karawang&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-64 border-0"
        ></iframe>
      </div>
    </div>
  );
};

const ContactInfoCard = ({ item }) => {
  const IconComponent = item.icon;
  
  return (
    <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
        <IconComponent size={24} className="text-white" />
      </div>
      
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
        <p className="text-gray-600">{item.content}</p>
      </div>
    </div>
  );
};

const ContactForm = ({ formData, isSubmitting, submitStatus, onFieldUpdate, onSubmit }) => (
  <div className="bg-white rounded-3xl p-8 shadow-2xl">
    <h3 className="text-2xl font-bold text-gray-900 mb-8">
      Kirim Pesan
    </h3>
    
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          type="text"
          name="name"
          label="Nama Lengkap"
          value={formData.name || ''}
          onChange={(value) => onFieldUpdate('name', value)}
          required
        />
        
        <FormField
          type="email"
          name="email"
          label="Email"
          value={formData.email || ''}
          onChange={(value) => onFieldUpdate('email', value)}
          required
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          type="tel"
          name="phone"
          label="Nomor Telepon"
          value={formData.phone || ''}
          onChange={(value) => onFieldUpdate('phone', value)}
          required
        />
        
        <FormField
          type="text"
          name="company"
          label="Perusahaan (Opsional)"
          value={formData.company || ''}
          onChange={(value) => onFieldUpdate('company', value)}
        />
      </div>
      
      <FormField
        type="select"
        name="service"
        label="Layanan yang Diminati"
        value={formData.service || ''}
        onChange={(value) => onFieldUpdate('service', value)}
        options={[
          { value: '', label: 'Pilih layanan' },
          { value: 'konstruksi-sipil', label: 'Konstruksi Sipil' },
          { value: 'bangunan-gedung', label: 'Bangunan Gedung' },
          { value: 'proyek-pemerintah', label: 'Proyek Pemerintah' },
          { value: 'konsultasi', label: 'Konsultasi' }
        ]}
        required
      />
      
      <FormField
        type="textarea"
        name="message"
        label="Pesan"
        value={formData.message || ''}
        onChange={(value) => onFieldUpdate('message', value)}
        placeholder="Ceritakan tentang proyek Anda..."
        rows={4}
        required
      />
      
      {/* Submit Status */}
      {submitStatus && (
        <div className={`p-4 rounded-xl ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Mengirim...
          </>
        ) : (
          <>
            <Send size={20} className="mr-2" />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  </div>
);

const FormField = ({ type, name, label, value, onChange, options, ...props }) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          {...props}
        />
      )}
    </div>
  );
};

const CTASection = ({ contact }) => (
  <div className="text-center mt-16 p-12 bg-white rounded-3xl shadow-2xl">
    <h3 className="text-3xl font-bold text-gray-900 mb-4">
      Siap Memulai Proyek Anda?
    </h3>
    <p className="text-lg text-gray-600 mb-8">
      Dapatkan konsultasi gratis dan proposal terbaik untuk proyek konstruksi Anda
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href={`tel:${contact.phone.replace(/\s/g, '')}`} 
        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
      >
        <Phone size={20} className="mr-2" />
        Hubungi Sekarang
      </a>
      
      <a 
        href={`mailto:${contact.email}`} 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
      >
        <Mail size={20} className="mr-2" />
        Kirim Email
      </a>
    </div>
  </div>
);

export default ContactSection;
