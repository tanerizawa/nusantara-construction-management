-- ========================================
-- UPDATE SUBSIDIARY ADDRESS TO KARAWANG
-- ========================================
-- All subsidiaries are now located in Karawang Industrial Area
-- Date: October 16, 2025
-- ========================================

-- NU001: CV. CAHAYA UTAMA EMPATBELAS
-- Location: KIIC (Karawang International Industrial City)
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Harapan Raya Kav. A-14, KIIC',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41361',
    'district', 'Telukjambe Timur',
    'village', 'Sukaluyu'
)
WHERE id = 'NU001';

-- NU002: CV. BINTANG SURAYA
-- Location: Surya Cipta City of Industry
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Surya Utama Kav. B-88, Surya Cipta',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41363',
    'district', 'Telukjambe Timur',
    'village', 'Sukaharja'
)
WHERE id = 'NU002';

-- NU003: CV. LATANSA
-- Location: KIM (Kawasan Industri Mitra)
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Mitra Industri Kav. C-25, KIM Karawang',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41362',
    'district', 'Telukjambe Barat',
    'village', 'Sirnabaya'
)
WHERE id = 'NU003';

-- NU004: CV. GRAHA BANGUN NUSANTARA
-- Location: Karawang New Industry City (KNIC)
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Industri Terpadu Kav. D-77, KNIC',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41364',
    'district', 'Klari',
    'village', 'Gintungkerta'
)
WHERE id = 'NU004';

-- NU005: CV. SAHABAT SINAR RAYA
-- Location: Bukit Indah City
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Bukit Indah Industrial Kav. E-99',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41374',
    'district', 'Cikampek',
    'village', 'Dawuan'
)
WHERE id = 'NU005';

-- NU006: PT. PUTRA JAYA KONSTRUKASI
-- Location: KIIC (Karawang International Industrial City)
UPDATE subsidiaries 
SET address = jsonb_build_object(
    'street', 'Jl. Permata Industrial Park Kav. F-123, KIIC',
    'city', 'Karawang',
    'province', 'Jawa Barat',
    'country', 'Indonesia',
    'postalCode', '41361',
    'district', 'Telukjambe Timur',
    'village', 'Sukaluyu'
)
WHERE id = 'NU006';

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to verify all addresses are updated
SELECT 
    id,
    name,
    code,
    address->>'street' as street,
    address->>'city' as city,
    address->>'province' as province,
    address->>'postalCode' as postal_code,
    address->>'district' as district,
    address->>'village' as village
FROM subsidiaries
ORDER BY id;
