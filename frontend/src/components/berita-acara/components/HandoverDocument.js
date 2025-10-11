import React, { useRef } from 'react';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { formatDate, formatCurrency } from '../../../utils/formatters';

/**
 * Formal Handover Document (Berita Acara Serah Terima)
 * Generates official document with signatures
 */
const HandoverDocument = ({ beritaAcara, project, onPrint, onDownload, onClose }) => {
  const documentRef = useRef();

  const currentDate = formatDate(beritaAcara.submittedAt || beritaAcara.createdAt);
  const companyName = "PT Nusantara Construction";
  const companyAddress = "Jl. Industri No. 123, Jakarta 12345";
  const companyPhone = "+62 21 1234 5678";

  return (
    <div className="space-y-4">
      {/* Action Buttons - Hidden when printing */}
      <div className="sticky top-0 z-10 bg-[#1C1C1E] p-4 rounded-lg shadow-2xl border border-[#38383A] print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-[#48484A] text-white px-5 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Tutup Dokumen</span>
            </button>
          )}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-[#0A84FF] text-white px-5 py-2.5 rounded-lg hover:bg-[#0A84FF]/90 transition-colors shadow-lg"
          >
            <Printer size={18} />
            <span className="font-medium">Print Dokumen</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-[#30D158] text-white px-5 py-2.5 rounded-lg hover:bg-[#30D158]/90 transition-colors shadow-lg"
          >
            <Download size={18} />
            <span className="font-medium">Download PDF</span>
          </button>
          <div className="flex-1 min-w-[200px] text-[#8E8E93] text-sm">
            💡 Tekan <kbd className="px-2 py-1 bg-[#2C2C2E] rounded text-white text-xs">Ctrl+P</kbd> untuk mencetak
          </div>
        </div>
      </div>

      {/* Formal Document - Optimized for Print & Screen */}
      <div
        ref={documentRef}
        id="handover-document"
        className="bg-white text-black rounded-lg shadow-2xl print:shadow-none print:rounded-none overflow-hidden"
        style={{ 
          fontFamily: 'Times New Roman, serif'
        }}
      >
        {/* Document Content with proper padding */}
        <div className="p-8 sm:p-12 print:p-16">
        {/* Letterhead */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase">{companyName}</h1>
          <p className="text-sm mt-1">{companyAddress}</p>
          <p className="text-sm">Telp: {companyPhone}</p>
        </div>

        {/* Document Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase underline">BERITA ACARA SERAH TERIMA PEKERJAAN</h2>
          <p className="text-sm mt-2">Nomor: {beritaAcara.baNumber}</p>
        </div>

        {/* Opening Statement */}
        <div className="mb-6 text-justify leading-relaxed">
          <p className="indent-8">
            Pada hari ini, <strong>{currentDate}</strong>, yang bertanda tangan di bawah ini:
          </p>
        </div>

        {/* Pihak Pertama (Kontraktor) */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">PIHAK PERTAMA (Kontraktor):</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="w-32 py-1">Nama</td>
                <td className="w-8">:</td>
                <td>{beritaAcara.submittedBy || companyName}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan</td>
                <td>:</td>
                <td>Project Manager</td>
              </tr>
              <tr>
                <td className="py-1">Perusahaan</td>
                <td>:</td>
                <td>{companyName}</td>
              </tr>
              <tr>
                <td className="py-1">Alamat</td>
                <td>:</td>
                <td>{companyAddress}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm">
            Dalam hal ini bertindak untuk dan atas nama Pihak Pertama, selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
          </p>
        </div>

        {/* Pihak Kedua (Klien) */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">PIHAK KEDUA (Pemberi Kerja/Klien):</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="w-32 py-1">Nama</td>
                <td className="w-8">:</td>
                <td>{beritaAcara.clientRepresentative || '[Nama Klien]'}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan</td>
                <td>:</td>
                <td>Perwakilan Klien</td>
              </tr>
              <tr>
                <td className="py-1">Proyek</td>
                <td>:</td>
                <td>{project?.name || '[Nama Proyek]'}</td>
              </tr>
              <tr>
                <td className="py-1">Lokasi</td>
                <td>:</td>
                <td>
                  {beritaAcara.workLocation || 
                   (typeof project?.location === 'string' 
                     ? project.location 
                     : project?.location?.address 
                       ? `${project.location.address}${project.location.city ? ', ' + project.location.city : ''}${project.location.province ? ', ' + project.location.province : ''}`
                       : '[Lokasi Proyek]'
                   )}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm">
            Dalam hal ini bertindak untuk dan atas nama Pihak Kedua, selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
          </p>
        </div>

        {/* Kesepakatan */}
        <div className="mb-6">
          <p className="text-justify leading-relaxed mb-3">
            PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut sebagai "Para Pihak" dengan ini menyatakan bahwa:
          </p>
          
          <ol className="list-decimal ml-6 space-y-2 text-justify">
            <li>
              PIHAK PERTAMA telah menyelesaikan pekerjaan <strong>{beritaAcara.baType === 'partial' ? 'Sebagian' : beritaAcara.baType === 'provisional' ? 'Sementara' : 'Akhir'}</strong> untuk:
              <div className="mt-2 ml-4">
                <p><strong>Deskripsi Pekerjaan:</strong></p>
                <p className="whitespace-pre-line ml-4">{beritaAcara.workDescription}</p>
              </div>
            </li>
            
            <li>
              Tingkat penyelesaian pekerjaan adalah <strong>{beritaAcara.completionPercentage}%</strong> dengan tanggal penyelesaian <strong>{formatDate(beritaAcara.completionDate)}</strong>.
            </li>
            
            {beritaAcara.contractReference && (
              <li>
                Pekerjaan dilaksanakan berdasarkan Kontrak Nomor: <strong>{beritaAcara.contractReference}</strong>.
              </li>
            )}
            
            <li>
              PIHAK PERTAMA telah menyerahkan hasil pekerjaan tersebut kepada PIHAK KEDUA dalam kondisi baik dan sesuai dengan spesifikasi yang telah disepakati.
            </li>
            
            <li>
              PIHAK KEDUA telah memeriksa dan menerima hasil pekerjaan yang diserahkan oleh PIHAK PERTAMA.
            </li>
            
            {beritaAcara.paymentAmount && (
              <li>
                Nilai pembayaran progress yang disetujui adalah <strong>{formatCurrency(beritaAcara.paymentAmount)}</strong>.
              </li>
            )}
            
            {beritaAcara.clientNotes && (
              <li>
                Catatan dari PIHAK KEDUA:
                <p className="whitespace-pre-line ml-4 mt-1">{beritaAcara.clientNotes}</p>
              </li>
            )}
          </ol>
        </div>

        {/* Closing Statement */}
        <div className="mb-8 text-justify">
          <p className="leading-relaxed">
            Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya dalam rangkap 2 (dua) bermaterai cukup, 
            masing-masing mempunyai kekuatan hukum yang sama, untuk dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* PIHAK PERTAMA Signature */}
          <div className="text-center">
            <p className="font-bold mb-16">PIHAK PERTAMA</p>
            {beritaAcara.submittedAt && (
              <div className="border-2 border-dashed border-gray-400 h-24 mb-2 flex items-center justify-center">
                {beritaAcara.contractorSignature ? (
                  <img 
                    src={beritaAcara.contractorSignature} 
                    alt="Contractor Signature" 
                    className="max-h-20"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">[Tanda Tangan Digital]</span>
                )}
              </div>
            )}
            <div className="border-t-2 border-black pt-1">
              <p className="font-bold">{beritaAcara.submittedBy || companyName}</p>
              <p className="text-sm">Project Manager</p>
              {beritaAcara.submittedAt && (
                <p className="text-xs text-gray-600 mt-1">
                  Ditandatangani: {formatDate(beritaAcara.submittedAt)}
                </p>
              )}
            </div>
          </div>

          {/* PIHAK KEDUA Signature */}
          <div className="text-center">
            <p className="font-bold mb-16">PIHAK KEDUA</p>
            {beritaAcara.clientSignDate && (
              <div className="border-2 border-dashed border-gray-400 h-24 mb-2 flex items-center justify-center">
                {beritaAcara.clientSignature ? (
                  <img 
                    src={beritaAcara.clientSignature} 
                    alt="Client Signature" 
                    className="max-h-20"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">[Tanda Tangan Digital]</span>
                )}
              </div>
            )}
            <div className="border-t-2 border-black pt-1">
              <p className="font-bold">{beritaAcara.clientRepresentative || '[Nama Klien]'}</p>
              <p className="text-sm">Perwakilan Klien</p>
              {beritaAcara.clientSignDate && (
                <p className="text-xs text-gray-600 mt-1">
                  Ditandatangani: {formatDate(beritaAcara.clientSignDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Witnesses Section */}
        {beritaAcara.witnesses && beritaAcara.witnesses.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-center mb-4">PARA SAKSI:</h3>
            <div className={`grid ${beritaAcara.witnesses.length > 2 ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
              {beritaAcara.witnesses.map((witness, index) => (
                <div key={index} className="text-center">
                  <p className="font-bold mb-1">Saksi {index + 1}</p>
                  {witness.signature && (
                    <div className="border-2 border-dashed border-gray-400 h-20 mb-2 flex items-center justify-center">
                      {witness.signature ? (
                        <img 
                          src={witness.signature} 
                          alt={`Witness ${index + 1} Signature`} 
                          className="max-h-16"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">[Tanda Tangan]</span>
                      )}
                    </div>
                  )}
                  <div className="border-t-2 border-black pt-1 mt-12">
                    <p className="font-bold text-sm">{witness.name}</p>
                    <p className="text-xs">{witness.position}</p>
                    {witness.organization && (
                      <p className="text-xs text-gray-600">{witness.organization}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Notes */}
        <div className="text-center text-xs text-gray-600 mt-8 pt-4 border-t">
          <p>Dokumen ini dibuat secara elektronik dan sah tanpa memerlukan tanda tangan basah</p>
          <p>Generated on {formatDate(new Date())} by Nusantara Construction Management System</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HandoverDocument;
