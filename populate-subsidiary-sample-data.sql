-- Populate Sample Data for Subsidiary Detail Pages
-- This script adds complete data for testing purposes
-- Execute this to see all tabs populated with realistic data

-- Update NU001 with complete data
UPDATE subsidiaries 
SET 
  employee_count = 45,
  legal_info = '{
    "companyRegistrationNumber": "AHU-0012345.AH.01.01.2010",
    "taxIdentificationNumber": "01.123.456.7-014.000",
    "businessLicenseNumber": "NIB-1234567890123456",
    "vatRegistrationNumber": "PKP-010123456789000",
    "articlesOfIncorporation": "Akta Pendirian Perusahaan No. 123 tanggal 15 Januari 2010, dibuat di hadapan Notaris Dr. Ahmad Wahyudi, S.H., M.Kn"
  }'::jsonb,
  permits = '[
    {
      "name": "Izin Usaha Konstruksi (IUK)",
      "number": "IUK-CUE14-2024-001",
      "status": "valid",
      "issuedBy": "Lembaga Pengembangan Jasa Konstruksi (LPJK)",
      "issuedDate": "2024-01-15",
      "expiryDate": "2027-01-15",
      "description": "Izin untuk melaksanakan pekerjaan konstruksi bangunan gedung grade 6"
    },
    {
      "name": "Sertifikat Badan Usaha (SBU)",
      "number": "SBU-CUE14-2023-002",
      "status": "valid",
      "issuedBy": "LPJK Jakarta",
      "issuedDate": "2023-06-20",
      "expiryDate": "2026-06-20",
      "description": "Sertifikat untuk klasifikasi konstruksi bangunan gedung"
    },
    {
      "name": "Tanda Daftar Perusahaan (TDP)",
      "number": "TDP-01-14-0123456",
      "status": "valid",
      "issuedBy": "Dinas Penanaman Modal dan PTSP DKI Jakarta",
      "issuedDate": "2020-03-10",
      "expiryDate": "2025-03-10",
      "description": "Tanda daftar perusahaan yang sah"
    }
  ]'::jsonb,
  financial_info = '{
    "currency": "IDR",
    "authorizedCapital": 10000000000,
    "paidUpCapital": 2500000000,
    "fiscalYearEnd": "31 Desember"
  }'::jsonb,
  board_of_directors = '[
    {
      "name": "Budi Santoso, S.T., M.T.",
      "position": "Direktur Utama",
      "email": "budi.santoso@cahayautama14.co.id",
      "phone": "+62-812-3456-7890",
      "appointmentDate": "2020-01-01",
      "isActive": true
    },
    {
      "name": "Siti Rahayu, S.E., M.M.",
      "position": "Direktur Operasional",
      "email": "siti.rahayu@cahayautama14.co.id",
      "phone": "+62-813-9876-5432",
      "appointmentDate": "2020-01-01",
      "isActive": true
    },
    {
      "name": "Ahmad Fauzi, S.T.",
      "position": "Direktur Teknik",
      "email": "ahmad.fauzi@cahayautama14.co.id",
      "phone": "+62-821-1122-3344",
      "appointmentDate": "2021-03-15",
      "isActive": true
    }
  ]'::jsonb,
  profile_info = '{
    "website": "https://cahayautama14.co.id",
    "companySize": "medium",
    "industryClassification": "F41001 - Konstruksi Gedung Untuk Tempat Tinggal",
    "businessDescription": "CV. Cahaya Utama Empatbelas adalah perusahaan konstruksi yang berfokus pada pembangunan gedung perkantoran modern, pusat perbelanjaan, dan fasilitas komersial lainnya. Dengan pengalaman lebih dari 15 tahun, kami telah menyelesaikan berbagai proyek berkualitas tinggi di Jakarta dan sekitarnya. Tim profesional kami terdiri dari arsitek, insinyur sipil, dan manajer proyek berpengalaman yang berkomitmen memberikan hasil terbaik.",
    "socialMedia": {
      "linkedin": "https://linkedin.com/company/cahaya-utama-14",
      "facebook": "https://facebook.com/cahayautama14",
      "instagram": "https://instagram.com/cahayautama_official",
      "youtube": "https://youtube.com/@cahayautama14"
    }
  }'::jsonb
WHERE id = 'NU001';

-- Update NU002 with complete data
UPDATE subsidiaries 
SET 
  employee_count = 32,
  legal_info = '{
    "companyRegistrationNumber": "AHU-0023456.AH.01.01.2012",
    "taxIdentificationNumber": "02.234.567.8-015.000",
    "businessLicenseNumber": "NIB-2345678901234567",
    "vatRegistrationNumber": "PKP-020234567890000",
    "articlesOfIncorporation": "Akta Pendirian Perusahaan No. 234 tanggal 20 Maret 2012, dibuat di hadapan Notaris Ir. Siti Nurhaliza, S.H., M.Kn"
  }'::jsonb,
  permits = '[
    {
      "name": "Izin Usaha Konstruksi (IUK)",
      "number": "IUK-BSR-2023-001",
      "status": "valid",
      "issuedBy": "LPJK",
      "issuedDate": "2023-03-10",
      "expiryDate": "2026-03-10",
      "description": "Izin konstruksi untuk bangunan residensial"
    },
    {
      "name": "Sertifikat Badan Usaha (SBU)",
      "number": "SBU-BSR-2022-001",
      "status": "valid",
      "issuedBy": "LPJK Jakarta",
      "issuedDate": "2022-11-15",
      "expiryDate": "2025-11-15",
      "description": "Sertifikat untuk konstruksi perumahan grade 5"
    }
  ]'::jsonb,
  financial_info = '{
    "currency": "IDR",
    "authorizedCapital": 5000000000,
    "paidUpCapital": 1250000000,
    "fiscalYearEnd": "31 Desember"
  }'::jsonb,
  board_of_directors = '[
    {
      "name": "Andi Wijaya, S.T.",
      "position": "Direktur Utama",
      "email": "andi.wijaya@bintangsuraya.co.id",
      "phone": "+62-815-2233-4455",
      "appointmentDate": "2019-06-01",
      "isActive": true
    },
    {
      "name": "Maya Sari, S.E.",
      "position": "Direktur Keuangan",
      "email": "maya.sari@bintangsuraya.co.id",
      "phone": "+62-816-3344-5566",
      "appointmentDate": "2019-06-01",
      "isActive": true
    }
  ]'::jsonb,
  profile_info = '{
    "website": "https://bintangsuraya.co.id",
    "companySize": "medium",
    "industryClassification": "F41002 - Konstruksi Gedung Bukan Tempat Tinggal",
    "businessDescription": "CV. Bintang Suraya mengkhususkan diri dalam konstruksi bangunan residensial berkualitas tinggi. Kami membangun perumahan modern, apartemen, dan kompleks hunian yang nyaman dan berkelanjutan.",
    "socialMedia": {
      "linkedin": "https://linkedin.com/company/bintang-suraya",
      "instagram": "https://instagram.com/bintangsuraya_official"
    }
  }'::jsonb
WHERE id = 'NU002';

-- Update NU003 with complete data
UPDATE subsidiaries 
SET 
  employee_count = 28,
  legal_info = '{
    "companyRegistrationNumber": "AHU-0034567.AH.01.01.2015",
    "taxIdentificationNumber": "03.345.678.9-016.000",
    "businessLicenseNumber": "NIB-3456789012345678",
    "vatRegistrationNumber": "PKP-030345678901000"
  }'::jsonb,
  permits = '[
    {
      "name": "Izin Usaha Konstruksi (IUK)",
      "number": "IUK-LTS-2024-001",
      "status": "valid",
      "issuedBy": "LPJK",
      "issuedDate": "2024-02-01",
      "expiryDate": "2027-02-01",
      "description": "Izin untuk konstruksi infrastruktur"
    }
  ]'::jsonb,
  financial_info = '{
    "currency": "IDR",
    "authorizedCapital": 8000000000,
    "paidUpCapital": 3200000000,
    "fiscalYearEnd": "31 Desember"
  }'::jsonb,
  board_of_directors = '[
    {
      "name": "Hendra Kusuma, S.T., M.Eng.",
      "position": "Direktur Utama",
      "email": "hendra@latansa.co.id",
      "phone": "+62-817-4455-6677",
      "appointmentDate": "2018-01-15",
      "isActive": true
    }
  ]'::jsonb,
  profile_info = '{
    "website": "https://latansa.co.id",
    "companySize": "medium",
    "industryClassification": "F42101 - Konstruksi Jalan dan Jalan Rel",
    "businessDescription": "CV. Latansa adalah kontraktor infrastruktur yang berpengalaman dalam pembangunan jalan, jembatan, dan fasilitas transportasi lainnya.",
    "socialMedia": {
      "linkedin": "https://linkedin.com/company/cv-latansa"
    }
  }'::jsonb
WHERE id = 'NU003';

-- Verify updates
SELECT 
  id,
  name,
  employee_count,
  (legal_info->>'companyRegistrationNumber') as npwp,
  (financial_info->>'authorizedCapital') as modal_dasar,
  jsonb_array_length(board_of_directors) as jumlah_direksi,
  jsonb_array_length(permits) as jumlah_izin
FROM subsidiaries
WHERE id IN ('NU001', 'NU002', 'NU003')
ORDER BY id;
