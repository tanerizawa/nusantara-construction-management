import React from 'react';
import { Users, User, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';

const GovernanceView = ({ subsidiary }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Aktif
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#8E8E93]/20 text-[#8E8E93] border border-[#8E8E93]/30">
        <XCircle className="h-3 w-3 mr-1" />
        Tidak Aktif
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Board of Directors */}
      {subsidiary.boardOfDirectors && subsidiary.boardOfDirectors.length > 0 ? (
        <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Dewan Direksi
          </h3>
          <div className="space-y-4">
            {subsidiary.boardOfDirectors.map((director, index) => (
              <div 
                key={index}
                className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-[#0A84FF]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base">{director.name || '-'}</h4>
                      <p className="text-[#8E8E93] text-sm mt-1">{director.position || '-'}</p>
                    </div>
                  </div>
                  {getStatusBadge(director.isActive !== false)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#38383A]">
                  <div>
                    <label className="block text-xs text-[#8E8E93] mb-1 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </label>
                    <p className="text-white text-sm">{director.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E8E93] mb-1 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Telepon
                    </label>
                    <p className="text-white text-sm">{director.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E8E93] mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Tanggal Penunjukan
                    </label>
                    <p className="text-white text-sm">{formatDate(director.appointmentDate)}</p>
                  </div>
                  {director.endDate && (
                    <div>
                      <label className="block text-xs text-[#8E8E93] mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Tanggal Berakhir
                      </label>
                      <p className="text-white text-sm">{formatDate(director.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
          <Users className="h-12 w-12 text-[#636366] mx-auto mb-4" />
          <p className="text-[#8E8E93]">Belum ada data dewan direksi</p>
        </div>
      )}

      {/* Social Media Links */}
      {subsidiary.profileInfo?.socialMedia && Object.keys(subsidiary.profileInfo.socialMedia).length > 0 && (
        <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Media Sosial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(subsidiary.profileInfo.socialMedia).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2 capitalize">
                  {platform}
                </label>
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A84FF] text-sm hover:text-[#409CFF] transition-colors break-all"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {subsidiary.attachments && subsidiary.attachments.length > 0 && (
        <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dokumen Lampiran</h3>
          <div className="space-y-2">
            {subsidiary.attachments.map((attachment, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-[#2C2C2E] border border-[#38383A] rounded-lg hover:bg-[#38383A] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#0A84FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{attachment.name || `Document ${index + 1}`}</p>
                    {attachment.type && (
                      <p className="text-[#8E8E93] text-xs mt-0.5">{attachment.type}</p>
                    )}
                  </div>
                </div>
                {attachment.url && (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A84FF] text-sm hover:text-[#409CFF] transition-colors"
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceView;
