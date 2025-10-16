import React from 'react';
import { Building2, Mail, Phone, MapPin, Linkedin, Instagram, Globe } from 'lucide-react';
import { LANDING_CONFIG } from '../config/landingConfig';

export const Footer = ({ className = '' }) => {
  const { contact, socialMedia } = LANDING_CONFIG;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <CompanyInfo />
          
          {/* Quick Links */}
          <QuickLinks />
          
          {/* Services */}
          <ServicesLinks />
          
          {/* Contact Info */}
          <ContactInfo contact={contact} socialMedia={socialMedia} />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Nusantara Group. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/sitemap" className="hover:text-white transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CompanyInfo = () => (
  <div>
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl mr-3">
        <Building2 size={24} />
      </div>
      <div>
        <div className="text-xl font-bold">Nusantara Group</div>
        <div className="text-gray-400 text-sm">Building Excellence</div>
      </div>
    </div>
    
    <p className="text-gray-400 leading-relaxed mb-6">
      Kontraktor profesional dengan 15+ tahun pengalaman dalam pembangunan 
      infrastruktur dan konstruksi berkualitas tinggi di Kabupaten Karawang.
    </p>
    
    <div className="flex space-x-3">
      <SocialIcon href="#" icon={Linkedin} />
      <SocialIcon href="#" icon={Instagram} />
      <SocialIcon href="#" icon={Globe} />
    </div>
  </div>
);

const QuickLinks = () => {
  const links = [
    { label: 'Beranda', href: '#home' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Layanan', href: '#services' },
    { label: 'Portofolio', href: '#projects' },
    { label: 'Testimoni', href: '#testimonials' },
    { label: 'Kontak', href: '#contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Karir', href: '/careers' }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold mb-6">Quick Links</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href} 
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ServicesLinks = () => {
  const services = [
    { label: 'Konstruksi Sipil', href: '#services' },
    { label: 'Bangunan Gedung', href: '#services' },
    { label: 'Proyek Pemerintah', href: '#services' },
    { label: 'Jalan & Jembatan', href: '#services' },
    { label: 'Sistem Drainase', href: '#services' },
    { label: 'Irigasi', href: '#services' },
    { label: 'Konsultasi', href: '#contact' },
    { label: 'Maintenance', href: '#contact' }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold mb-6">Layanan Kami</h3>
      <ul className="space-y-3">
        {services.map((service, index) => (
          <li key={index}>
            <a 
              href={service.href} 
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              {service.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ContactInfo = ({ contact, socialMedia }) => (
  <div>
    <h3 className="text-lg font-bold mb-6">Hubungi Kami</h3>
    
    <div className="space-y-4 mb-6">
      <ContactItem icon={MapPin} text={contact.address} />
      <ContactItem icon={Phone} text={contact.phone} href={`tel:${contact.phone}`} />
      <ContactItem icon={Mail} text={contact.email} href={`mailto:${contact.email}`} />
    </div>
    
    <div className="bg-gray-800 p-4 rounded-xl">
      <div className="text-sm font-semibold mb-2">Jam Operasional:</div>
      <div className="text-gray-400 text-sm">{contact.workingHours}</div>
    </div>
  </div>
);

const ContactItem = ({ icon: Icon, text, href }) => {
  const content = (
    <div className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
      <Icon size={16} className="mt-1 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
};

const SocialIcon = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    className="bg-gray-800 p-3 rounded-xl hover:bg-blue-600 transition-all duration-300 group"
  >
    <Icon size={20} className="text-gray-400 group-hover:text-white" />
  </a>
);

export default Footer;