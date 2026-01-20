-- ========================================
-- UPDATE SUBSIDIARY CONTACT INFO TO KARAWANG
-- ========================================
-- Update phone numbers to Karawang area code (0267)
-- Date: October 16, 2025
-- ========================================

-- NU001: CV. CAHAYA UTAMA EMPATBELAS
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@cahayautama14.co.id',
    'phone', '+62-267-8520-1401',
    'fax', '+62-267-8520-1499',
    'mobile', '+62-812-9000-1401'
)
WHERE id = 'NU001';

-- NU002: CV. BINTANG SURAYA
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@bintangsuraya.co.id',
    'phone', '+62-267-8520-1402',
    'fax', '+62-267-8520-1498',
    'mobile', '+62-812-9000-1402'
)
WHERE id = 'NU002';

-- NU003: CV. LATANSA
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@latansa.co.id',
    'phone', '+62-267-8520-1403',
    'fax', '+62-267-8520-1497',
    'mobile', '+62-812-9000-1403'
)
WHERE id = 'NU003';

-- NU004: CV. GRAHA BANGUN NUSANTARA
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@grahabangun.co.id',
    'phone', '+62-267-8520-1404',
    'fax', '+62-267-8520-1496',
    'mobile', '+62-812-9000-1404'
)
WHERE id = 'NU004';

-- NU005: CV. SAHABAT SINAR RAYA
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@sahabatsinar.co.id',
    'phone', '+62-267-8520-1405',
    'fax', '+62-267-8520-1495',
    'mobile', '+62-812-9000-1405'
)
WHERE id = 'NU005';

-- NU006: PT. PUTRA JAYA KONSTRUKASI
UPDATE subsidiaries 
SET contact_info = jsonb_build_object(
    'email', 'info@putrajaya.co.id',
    'phone', '+62-267-8520-1406',
    'fax', '+62-267-8520-1494',
    'mobile', '+62-812-9000-1406'
)
WHERE id = 'NU006';

-- ========================================
-- VERIFICATION QUERY
-- ========================================
SELECT 
    id,
    name,
    contact_info->>'email' as email,
    contact_info->>'phone' as phone,
    contact_info->>'fax' as fax,
    contact_info->>'mobile' as mobile,
    address->>'city' as city,
    address->>'province' as province
FROM subsidiaries
ORDER BY id;
