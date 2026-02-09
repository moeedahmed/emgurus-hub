// Career pathway and milestone mappings by specialty
// Career pathways represent formal training and portfolio programs across the world

export interface CareerPath {
  name: string;
  category: string;
  description?: string;
  pathwayId?: string; // Links to strict ID in pathway registry
}

export interface Milestone {
  name: string;
  category: string;
  description?: string;
}

// Career pathways organized by specialty - global frameworks and programs
// Common programs first, then alphabetical
export const careerPathsBySpecialty: Record<string, CareerPath[]> = {
  'Emergency Medicine': [
    // UK training pathways
    { name: 'RCEM ACCS Core Training', category: 'United Kingdom', description: 'Core training program (ACCS) leading to ST3+ entry', pathwayId: 'rcem-run-through' },
    { name: 'RCEM Run-through Training', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST6)', pathwayId: 'rcem-run-through' },
    { name: 'RCEM Higher Specialty Training', category: 'United Kingdom', description: 'Higher Specialty Training program (ST4-CCT)', pathwayId: 'rcem-hst' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme (Training + Portfolio)', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Sponsored training placement (Medical Training Initiative)', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'Exam route to NHS training (PLAB)', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABEM Residency', category: 'United States', description: 'ACGME-accredited residency (3-4 years)', pathwayId: 'abem-residency' },
    { name: 'ECFMG Pathway', category: 'United Kingdom', description: 'ECFMG certification pathway for IMGs', pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'ACEM Fellowship', category: 'Australia/NZ', description: 'Specialist training program leading to FACEM', pathwayId: 'acem-fellowship' },
    { name: 'Staff Specialist / CMO', category: 'Australia', description: 'Career Medical Officer / Staff Specialist pathway', pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'AMC Standard Pathway for IMG registration', pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPS-EM Training', category: 'Canada', description: 'RCPSC-accredited residency (5 years)', pathwayId: 'ca-rcpsc-residency' },
    { name: 'CCFP-EM Training', category: 'Canada', description: 'Family Medicine + EM enhanced skills program', pathwayId: 'ca-ccfp-residency' },
    { name: 'Hospitalist / Non-Residency', category: 'Canada', description: 'Clinical Associate / Hospitalist role' , pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Emergency Medicine', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Emergency Medicine', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Medical Officer (Non-Training)', category: 'India', description: 'Medical Officer / Non-Training Service', pathwayId: 'in-medical-officer' },
    { name: 'MCEM/FCEM Pathway', category: 'Ireland', description: 'Irish College of Emergency Medicine', pathwayId: 'ie-rcsi-hst' },
    { name: 'NCHD (Non-Training)', category: 'Ireland', description: 'Non-Consultant Hospital Doctor (Service Post)', pathwayId: 'ie-nchd-pathway' },
    { name: 'IAEM EM Training', category: 'Ireland', description: 'Irish Association for Emergency Medicine', pathwayId: 'ie-iaem-training' },
    { name: 'EuSEM Training', category: 'Europe', description: 'European Society for Emergency Medicine pathway' , pathwayId: 'eusem-training' },
    { name: 'EU Specialist Recognition', category: 'Europe', description: 'EU Directive mutual recognition', pathwayId: 'eu-specialist-recognition' },
    { name: 'European Clinical Career', category: 'Europe', description: 'Non-training clinical work in EU', pathwayId: 'eu-clinical-service' },
    { name: 'Gulf Board EM', category: 'Middle East', description: 'Gulf Cooperation Council Emergency Medicine training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Medical license pathway (Approbation)', pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist residency training (Facharzt)', pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training program (MOHH)'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Internal Medicine': [
    // UK training pathways
    { name: 'JRCPTB Higher Specialty Training', category: 'United Kingdom', description: 'Higher Specialty Training program (ST4-CCT)', pathwayId: 'mrcp-imt' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'CESR Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABIM Residency', category: 'United States', description: 'ACGME-accredited residency (3 years)', pathwayId: 'abim-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'ECFMG certification pathway for IMGs', pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Training', category: 'Australia/NZ', description: 'Specialist training program (Basic + Advanced)', pathwayId: 'racp-training' },
    { name: 'Expedited Specialist Pathway', category: 'Australia', description: 'Fast-track specialist recognition pathway (2025)'  , pathwayId: 'au-expedited-specialist' },
    { name: 'Staff Specialist / SMO', category: 'Australia', description: 'Senior Medical Officer / Staff Specialist', pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs', pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Hospitalist', category: 'Canada', description: 'Hospitalist / Clinical Associate', pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Medicine', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Internal Medicine', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Medical Officer (Non-Training)', category: 'India', description: 'Medical Officer / Non-Training Service', pathwayId: 'in-medical-officer' },
    { name: 'MRCPI Pathway', category: 'Ireland', description: 'Membership of Royal College of Physicians Ireland', pathwayId: 'ie-rcpi-hst' },
    { name: 'NCHD (Non-Training)', category: 'Ireland', description: 'Registrar / SHO Service Post', pathwayId: 'ie-nchd-pathway' },
    { name: 'Gulf Board Internal Medicine', category: 'Middle East', description: 'GCC Internal Medicine training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)', pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training', pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Surgery': [
    // UK training pathways
    { name: 'JCST Higher Surgical Training', category: 'United Kingdom', description: 'Core (CT1-2) & Higher (ST3-8) surgical training', pathwayId: 'hst-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABS Residency', category: 'United States', description: 'ACGME-accredited residency (5 years)', pathwayId: 'abs-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates', pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACS Fellowship', category: 'Australia/NZ', description: 'Specialist training program (SET)', pathwayId: 'racs-fellowship' },
    { name: 'Career Medical Officer (Surgery)', category: 'Australia', description: 'Non-specialist surgical role', pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs', pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Surgical Assistant', category: 'Canada', description: 'Non-residency surgical support role' , pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Surgery', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB General Surgery', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Medical Officer (Non-Training)', category: 'India', description: 'Medical Officer / Non-Training Service', pathwayId: 'in-medical-officer' },
    { name: 'FRCSI Pathway', category: 'Ireland', description: 'Fellowship of Royal College of Surgeons Ireland', pathwayId: 'ie-rcsi-hst' },
    { name: 'Surgical Registrar (Non-Scheme)', category: 'Ireland', description: 'Service post (Non-Training)', pathwayId: 'ie-nchd-pathway' },
    { name: 'Gulf Board Surgery', category: 'Middle East', description: 'GCC General Surgery training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Pediatrics': [
    // UK training pathways
    { name: 'RCPCH Run-through Training', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST8)', pathwayId: 'mrcpch-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABP Residency', category: 'United States', description: 'ACGME-accredited residency (3 years)', pathwayId: 'abp-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Paediatrics', category: 'Australia/NZ', description: 'Specialist training program (Basic + Advanced)' , pathwayId: 'racp-training' },
    { name: 'Paediatric CMO', category: 'Australia', description: 'Career Medical Officer in Paediatrics' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Paediatric Hospitalist', category: 'Canada', description: 'Non-residency paediatric role', pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Paediatrics', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Paediatrics', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Medical Officer (Non-Training)', category: 'India', description: 'Medical Officer / Non-Training Service', pathwayId: 'in-medical-officer' },
    { name: 'RCPI Paediatrics', category: 'Ireland', description: 'RCPI Paediatrics training', pathwayId: 'ie-rcpi-paediatrics' },
    { name: 'Gulf Board Paediatrics', category: 'Middle East', description: 'GCC Paediatric training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Psychiatry': [
    // UK training pathways
    { name: 'RCPsych Higher Specialty Training', category: 'United Kingdom', description: 'Core (CT1-3) & Higher (ST4-6) specialty training', pathwayId: 'mrcpsych-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABPN Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)', pathwayId: 'abpn-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RANZCP Fellowship', category: 'Australia/NZ', description: 'Specialist training program leading to FRANZCP', pathwayId: 'ranzcp-fellowship' },
    { name: 'Expedited Specialist Pathway', category: 'Australia', description: 'New 2025 fast-track for specialists from comparable health systems'  , pathwayId: 'au-expedited-specialist' },
    { name: 'Staff Specialist (Psychiatry)', category: 'Australia', description: 'Career Medical Officer / Staff Specialist' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Psychiatry Hospitalist', category: 'Canada', description: 'Non-residency psychiatry role', pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Psychiatry', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Psychiatry', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'College of Psychiatrists', category: 'Ireland', description: 'College of Psychiatrists of Ireland training', pathwayId: 'ie-cpsych-training' },
    { name: 'Gulf Board Psychiatry', category: 'Middle East', description: 'GCC Psychiatry training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Family Medicine': [
    // UK training pathways
    { name: 'MRCGP CCT Training', category: 'United Kingdom', description: 'Run-through GP specialty training (ST1-3)', pathwayId: 'mrcgp-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABFM Residency', category: 'United States', description: 'ACGME-accredited residency (3 years)', pathwayId: 'abfm-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia
    { name: 'RACGP Fellowship', category: 'Australia', description: 'Specialist training program leading to FRACGP', pathwayId: 'racgp-fellowship' },
    { name: 'ACRRM Fellowship', category: 'Australia', description: 'Specialist training program leading to FACRRM' , pathwayId: 'acrrm-fellowship' },
    { name: 'General Practitioner (Non-VR)', category: 'Australia', description: 'Non-Vocationally Registered GP' , pathwayId: 'au-gp-non-vr' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'CFPC Certification', category: 'Canada', description: 'College of Family Physicians of Canada', pathwayId: 'ca-ccfp-residency' },
    { name: 'Family Physician (Provisional)', category: 'Canada', description: 'Provisional license practice', pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Family Medicine', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Family Medicine', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'ICGP Training', category: 'Ireland', description: 'Irish College of General Practitioners' , pathwayId: 'ie-icgp-training' },
    { name: 'Gulf Board Family Medicine', category: 'Middle East', description: 'GCC Family Medicine training', pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)', pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training', pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Anesthesiology': [
    // UK training pathways
    { name: 'RCoA Higher Specialty Training', category: 'United Kingdom', description: 'Core (CT1-2) & Higher (ST3-7) specialty training', pathwayId: 'rcoa-hst' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABA Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)', pathwayId: 'aba-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'ANZCA Fellowship', category: 'Australia/NZ', description: 'Specialist training program leading to FANZCA', pathwayId: 'anzca-fellowship' },
    { name: 'Expedited Specialist Pathway', category: 'Australia', description: 'New 2025 fast-track for specialists from comparable health systems'  , pathwayId: 'au-expedited-specialist' },
    { name: 'Career Medical Officer (Anaesthetics)', category: 'Australia', description: 'Non-specialist anaesthetics role' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Anaesthesia Assistant / Associate', category: 'Canada', description: 'Non-residency anaesthesia role', pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Anaesthesia', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan', pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Anaesthesia', category: 'India', description: 'Diplomate of National Board', pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'CAI Anaesthesia Training', category: 'Ireland', description: 'College of Anaesthesiologists of Ireland', pathwayId: 'ie-cai-training' },
    { name: 'Gulf Board Anaesthesia', category: 'Middle East', description: 'GCC Anaesthesiology training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Radiology': [
    // UK training pathways
    { name: 'RCR Run-through Training', category: 'United Kingdom', description: 'Run-through specialty training (ST1-5)', pathwayId: 'frcr-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABR Residency', category: 'United States', description: 'ACGME-accredited residency (5 years)' , pathwayId: 'us-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RANZCR Fellowship', category: 'Australia/NZ', description: 'Specialist training program leading to FRANZCR' , pathwayId: 'ranzcr-fellowship' },
    { name: 'Staff Specialist (Radiology)', category: 'Australia', description: 'Career Medical Officer / Staff Specialist' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada' , pathwayId: 'ca-rcpsc-residency' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Radiology', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Radiology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Gulf Board Radiology', category: 'Middle East', description: 'GCC Radiology training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Obstetrics & Gynecology': [
    // UK training pathways
    { name: 'RCOG Run-through Training', category: 'United Kingdom', description: 'Run-through specialty training (ST1-7)', pathwayId: 'mrcog-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABOG Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)', pathwayId: 'abog-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RANZCOG Fellowship', category: 'Australia/NZ', description: 'Specialist training program leading to FRANZCOG', pathwayId: 'ranzcog-fellowship' },
    { name: 'Expedited Specialist Pathway', category: 'Australia', description: 'New 2025 fast-track for specialists from comparable health systems'  , pathwayId: 'au-expedited-specialist' },
    { name: 'Career Medical Officer (O&G)', category: 'Australia', description: 'Non-specialist O&G role' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada', pathwayId: 'ca-rcpsc-residency' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Obstetrics & Gynaecology', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Obstetrics & Gynaecology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Gulf Board O&G', category: 'Middle East', description: 'GCC O&G training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Orthopedic Surgery': [
    // UK training pathways
    { name: 'JCST T&O Higher Specialty Training', category: 'United Kingdom', description: 'Higher Specialty Training program (ST3-8)', pathwayId: 'hst-cct' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (formerly CESR)', pathwayId: 'portfolio-pathway' },
    { name: 'CESR-CP', category: 'United Kingdom', description: 'Combined Programme', pathwayId: 'portfolio-pathway' },
    { name: 'MTI Scheme', category: 'United Kingdom', description: 'Medical Training Initiative', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    { name: 'PLAB to Training', category: 'United Kingdom', description: 'PLAB exams to NHS specialty training', pathwayId: 'plab-to-training' },
    // USA
    { name: 'ABOS Residency', category: 'United States', description: 'ACGME-accredited residency (5 years)' , pathwayId: 'us-residency' },
    { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia
    { name: 'AOA Fellowship', category: 'Australia', description: 'Specialist training program (SET)' , pathwayId: 'aoa-fellowship' },
    { name: 'Orthopaedic Registrar (Non-Training)', category: 'Australia', description: 'Non-specialist surgical role' , pathwayId: 'service-post-australia' },
    { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
    // Canada
    { name: 'RCPSC Training', category: 'Canada', description: 'Royal College of Physicians and Surgeons of Canada' , pathwayId: 'ca-rcpsc-residency' },
    { name: 'Surgical Assistant', category: 'Canada', description: 'Non-residency surgical support role' , pathwayId: 'ca-clinical-associate' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other countries
    { name: 'FCPS Orthopaedics', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Orthopaedics', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MD/MS Pathway', category: 'India', description: 'University/NMC MD/MS route', pathwayId: 'in-md-ms' },
    { name: 'Gulf Board Orthopaedics', category: 'Middle East', description: 'GCC Orthopaedic training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
    { name: 'German Medical License', category: 'Germany', description: 'Approbation (License to practice)' , pathwayId: 'de-approbation' },
    { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
    { name: 'Assistenzarzt (Non-Specialist)', category: 'Germany', description: 'Non-specialist clinical doctor', pathwayId: 'de-assistenzarzt' },
    { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
    { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
    { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
    { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
    { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
    { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
    { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
    { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
    { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
    { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH'  , pathwayId: 'sg-residency' },
    { name: 'Conditional Registration (IMG)', category: 'Singapore', description: 'IMG conditional registration pathway', pathwayId: 'sg-conditional-registration' },
    { name: 'Clinical Service (Non-Training)', category: 'Singapore', description: 'Non-training clinical career', pathwayId: 'sg-clinical-service' },
  ],
  'Critical Care / ICU': [
    // UK
    { name: 'FICM ICM Training', category: 'United Kingdom', description: 'Faculty of Intensive Care Medicine training (Stage 1-3)', pathwayId: 'ficm-icm' },
    { name: 'Dual CCT (ICM + Partner)', category: 'United Kingdom', description: 'Dual training with Anaesthetics, Medicine, EM, etc.', pathwayId: 'dual-cct-icm' },
    { name: 'Portfolio Pathway (ICM)', category: 'United Kingdom', description: 'Specialist Registration via Portfolio in ICM', pathwayId: 'portfolio-pathway' },
    { name: 'MTI (Critical Care)', category: 'United Kingdom', description: 'Medical Training Initiative in ICM', pathwayId: 'service-post-united-kingdom' },
    { name: 'Specialty Doctor (SAS)', category: 'United Kingdom', description: 'Staff Grade / Associate Specialist pathway', pathwayId: 'sas-pathway' },

    { name: 'Specialist Grade (SAS)', category: 'United Kingdom', description: 'Autonomous SAS doctor grade (12+ years experience)', pathwayId: 'uk-specialist-grade' },
    // USA
    { name: 'Critical Care Fellowship', category: 'United States', description: 'ACGME-accredited CCM fellowship (1-2 years)', pathwayId: 'ccm-fellowship' },
    { name: 'Pulm/CCM Fellowship', category: 'United States', description: 'Combined Pulmonary and Critical Care fellowship (3 years)', pathwayId: 'pulm-ccm-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'CICM Fellowship', category: 'Australia/NZ', description: 'College of Intensive Care Medicine training', pathwayId: 'amc-standard-pathway' }, // Registry stub needed for CICM
    { name: 'ICU Registrar (Non-Training)', category: 'Australia', description: 'Service registrar role', pathwayId: 'service-post-australia' },
    // Canada
    { name: 'RCPSC Critical Care', category: 'Canada', description: 'Royal College Critical Care Medicine' , pathwayId: 'ca-rcpsc-residency' },
    { name: 'Practice-Ready Assessment', category: 'Canada', description: 'Provincial PRA pathway for experienced IMGs', pathwayId: 'ca-practice-ready' },
    // Other
    { name: 'FCPS Critical Care', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DrNB Critical Care', category: 'India', description: 'Doctorate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'EDIC Pathway', category: 'Europe', description: 'European Diploma in Intensive Care' , pathwayId: 'edic-pathway' },
    { name: 'EU Specialist Recognition', category: 'Europe', description: 'EU Directive mutual recognition', pathwayId: 'eu-specialist-recognition' },
    { name: 'European Clinical Career', category: 'Europe', description: 'Non-training clinical work in EU', pathwayId: 'eu-clinical-service' },
    { name: 'Gulf Board Critical Care', category: 'Middle East', description: 'GCC Critical Care training' , pathwayId: 'me-arab-board' },
    { name: 'DHA Licensing (Dubai)', category: 'Middle East', description: 'Dubai Health Authority licensing', pathwayId: 'me-dha-licensing' },
    { name: 'DOH Licensing (Abu Dhabi)', category: 'Middle East', description: 'Abu Dhabi DOH licensing', pathwayId: 'me-doh-abudhabi' },
    { name: 'QCHP Licensing (Qatar)', category: 'Middle East', description: 'Qatar Council licensing', pathwayId: 'me-qatar-qchp' },
    { name: 'MOH Licensing (Kuwait)', category: 'Middle East', description: 'Kuwait MOH licensing', pathwayId: 'me-kuwait-moh' },
    { name: 'Gulf Clinical Career', category: 'Middle East', description: 'Non-training specialist/consultant role', pathwayId: 'me-gulf-service' },

    { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
  ],
  'Cardiology': [
    // UK
    { name: 'ST3+ Cardiology', category: 'United Kingdom', description: 'Higher Specialty Training in Cardiology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Cardiology Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (3 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Cardiology' , pathwayId: 'racp-training' },
    // Other
    { name: 'FCPS Cardiology', category: 'Pakistan', description: 'CPSP Cardiology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Cardiology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'DM Cardiology', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Gastroenterology': [
    // UK
    { name: 'ST3+ Gastroenterology', category: 'United Kingdom', description: 'Higher Specialty Training in Gastro & Hep' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'GI Fellowship', category: 'United States', description: 'Gastroenterology fellowship (3 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Gastroenterology' , pathwayId: 'racp-training' },
    // Other
    { name: 'FCPS Gastroenterology', category: 'Pakistan', description: 'CPSP Gastroenterology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Gastroenterology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'DM Gastroenterology', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Pulmonology': [
    // UK
    { name: 'ST3+ Respiratory Med', category: 'United Kingdom', description: 'Higher Specialty Training in Respiratory Medicine' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Pulm/CCM Fellowship', category: 'United States', description: 'Combined Pulmonary and Critical Care (3 years)' , pathwayId: 'pulm-ccm-fellowship' },
    { name: 'Pulmonary Fellowship', category: 'United States', description: 'Pulmonary Disease fellowship (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Respiratory Medicine' , pathwayId: 'racp-training' },
    // Other
    { name: 'FCPS Pulmonology', category: 'Pakistan', description: 'CPSP Pulmonology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Respiratory Diseases', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'DM Pulmonary Medicine', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Neurology': [
    // UK
    { name: 'ST3+ Neurology', category: 'United Kingdom', description: 'Higher Specialty Training in Neurology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Neurology Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Neurology' , pathwayId: 'racp-training' },
    // Other
    { name: 'FCPS Neurology', category: 'Pakistan', description: 'CPSP Neurology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Neurology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'DM Neurology', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Oncology': [
    // UK
    { name: 'ST3+ Medical Oncology', category: 'United Kingdom', description: 'Higher Specialty Training in Medical Oncology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'ST3+ Clinical Oncology', category: 'United Kingdom', description: 'Higher Specialty Training in Clinical Oncology (RCR)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Hem/Onc Fellowship', category: 'United States', description: 'Hematology and Oncology fellowship (3 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Medical Oncology' , pathwayId: 'racp-training' },
    // Other
    { name: 'FCPS Medical Oncology', category: 'Pakistan', description: 'CPSP Oncology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Medical Oncology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'DM Medical Oncology', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Neurosurgery': [
    // UK
    { name: 'ST1 Run-through', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST8)'  , pathwayId: 'uk-run-through-training' },
    { name: 'ST3+ Neurosurgery', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST8)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Neurosurgery Residency', category: 'United States', description: 'ACGME-accredited residency (7 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'SET Neurosurgery', category: 'Australia/NZ', description: 'RACS SET training in Neurosurgery' , pathwayId: 'racs-fellowship' },
    // Other
    { name: 'FCPS Neurosurgery', category: 'Pakistan', description: 'CPSP Neurosurgery training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Neurosurgery', category: 'India', description: 'Diplomate of National Board (6 year direct)' , pathwayId: 'in-dnb-broad' },
    { name: 'MCh Neurosurgery', category: 'India', description: 'Doctorate of Medicine (3 year)' , pathwayId: 'in-dm-mch' },
  ],
  'Plastic Surgery': [
    // UK
    { name: 'ST3+ Plastic Surgery', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST8)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Integrated Plastics', category: 'United States', description: 'Integrated residency (6 years)' , pathwayId: 'us-residency' },
    { name: 'Independent Plastics', category: 'United States', description: 'Fellowship after Gen Surg (3 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'SET Plastic Surgery', category: 'Australia/NZ', description: 'RACS SET training in Plastic Surgery' , pathwayId: 'racs-fellowship' },
    // Other
    { name: 'FCPS Plastic Surgery', category: 'Pakistan', description: 'CPSP Plastic Surgery training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Plastic Surgery', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MCh Plastic Surgery', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Cardiothoracic Surgery': [
    // UK
    { name: 'ST1 Run-through', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST8)'  , pathwayId: 'uk-run-through-training' },
    { name: 'ST3+ Cardiothoracic', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST8)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Integrated CT Surgery', category: 'United States', description: 'Integrated residency (6 years)' , pathwayId: 'us-residency' },
    { name: 'CT Fellowship', category: 'United States', description: 'Fellowship after Gen Surg (2-3 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'SET Cardiothoracic', category: 'Australia/NZ', description: 'RACS SET training in CT Surgery' , pathwayId: 'racs-fellowship' },
    // Other
    { name: 'FCPS Cardiac Surgery', category: 'Pakistan', description: 'CPSP Cardiac Surgery training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB CT Surgery', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MCh CT Surgery', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Vascular Surgery': [
    // UK
    { name: 'ST3+ Vascular Surgery', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST8)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Integrated Vascular', category: 'United States', description: 'Integrated residency (5 years)' , pathwayId: 'us-residency' },
    { name: 'Vascular Fellowship', category: 'United States', description: 'Fellowship after Gen Surg (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'SET Vascular Surgery', category: 'Australia/NZ', description: 'RACS SET training in Vascular Surgery' , pathwayId: 'racs-fellowship' },
    // Other
    { name: 'FCPS Vascular Surgery', category: 'Pakistan', description: 'CPSP Vascular Surgery training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Vascular Surgery', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MCh Vascular Surgery', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Urology': [
    // UK
    { name: 'ST3+ Urology', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST7)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    // USA
    { name: 'Urology Residency', category: 'United States', description: 'ACGME-accredited residency (5 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    // Australia/NZ
    { name: 'SET Urology', category: 'Australia/NZ', description: 'RACS SET training in Urology' , pathwayId: 'racs-fellowship' },
    // Other
    { name: 'FCPS Urology', category: 'Pakistan', description: 'CPSP Urology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB Urology', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
    { name: 'MCh Urology', category: 'India', description: 'Doctorate of Medicine (Super Specialty)' , pathwayId: 'in-dm-mch' },
  ],
  'Dermatology': [
    { name: 'ST3+ Dermatology', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST6)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Dermatology Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    { name: 'FACD Training', category: 'Australia/NZ', description: 'Australasian College of Dermatologists training' , pathwayId: 'facd-training' },
    { name: 'FCPS Dermatology', category: 'Pakistan', description: 'CPSP Dermatology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MD Dermatology', category: 'India', description: 'Diplomate of National Board / MD' , pathwayId: 'in-dnb-broad' },
  ],
  'Ophthalmology': [
    { name: 'ST1 Run-through', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST7)'  , pathwayId: 'uk-run-through-training' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Ophthalmology Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    { name: 'RANZCO Training', category: 'Australia/NZ', description: 'Royal Australian and NZ College of Ophthalmologists' , pathwayId: 'ranzco-training' },
    { name: 'FCPS Ophthalmology', category: 'Pakistan', description: 'CPSP Ophthalmology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MS Ophthalmology', category: 'India', description: 'Diplomate of National Board / MS' , pathwayId: 'in-dnb-broad' },
  ],
  'ENT (Otolaryngology)': [
    { name: 'ST3+ ENT', category: 'United Kingdom', description: 'Higher Specialty Training (ST3-ST8)' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'ENT Residency', category: 'United States', description: 'ACGME-accredited residency (5 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    { name: 'SET Otolaryngology', category: 'Australia/NZ', description: 'RACS SET training in ENT' , pathwayId: 'racs-fellowship' },
    { name: 'FCPS ENT', category: 'Pakistan', description: 'CPSP ENT training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MS ENT', category: 'India', description: 'Diplomate of National Board / MS' , pathwayId: 'in-dnb-broad' },
  ],
  'Pathology': [
    { name: 'ST1 Histopathology', category: 'United Kingdom', description: 'Run-through specialty training (ST1-ST5)' , pathwayId: 'uk-run-through-training' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Pathology Residency', category: 'United States', description: 'AP/CP Integrated residency (4 years)' , pathwayId: 'us-residency' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    { name: 'RCPA Training', category: 'Australia/NZ', description: 'Royal College of Pathologists of Australasia' , pathwayId: 'rcpa-training' },
    { name: 'FCPS Histopathology', category: 'Pakistan', description: 'CPSP Histopathology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MD Pathology', category: 'India', description: 'Diplomate of National Board / MD' , pathwayId: 'in-dnb-broad' },
  ],
  'Nephrology': [
    { name: 'ST3+ Nephrology', category: 'United Kingdom', description: 'Higher Specialty Training in Nephrology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Nephrology Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'IMG Clinical Career', category: 'United States', description: 'Non-residency clinical practice / residency prep', pathwayId: 'us-img-clinical' },
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Nephrology' , pathwayId: 'racp-training' },
    { name: 'FCPS Nephrology', category: 'Pakistan', description: 'CPSP Nephrology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/DM Nephrology', category: 'India', description: 'Diplomate of National Board / DM' , pathwayId: 'in-dm-mch' },
  ],
  'Infectious Disease': [
    { name: 'ST3+ Infectious Diseases', category: 'United Kingdom', description: 'Higher Specialty Training in ID' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'ID Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Infectious Diseases' , pathwayId: 'racp-training' },
    { name: 'FCPS Infectious Diseases', category: 'Pakistan', description: 'CPSP Infectious Diseases training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/DM Infectious Diseases', category: 'India', description: 'Diplomate of National Board / DM' , pathwayId: 'in-dm-mch' },
  ],
  'Rheumatology': [
    { name: 'ST3+ Rheumatology', category: 'United Kingdom', description: 'Higher Specialty Training in Rheumatology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Rheumatology Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Rheumatology' , pathwayId: 'racp-training' },
    { name: 'FCPS Rheumatology', category: 'Pakistan', description: 'CPSP Rheumatology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/DM Rheumatology', category: 'India', description: 'Diplomate of National Board / DM' , pathwayId: 'in-dm-mch' },
  ],
  'Endocrinology': [
    { name: 'ST3+ Endo & Diabetes', category: 'United Kingdom', description: 'Higher Specialty Training in Endocrinology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Endocrine Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (2 years)' , pathwayId: 'us-fellowship' },
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Endocrinology' , pathwayId: 'racp-training' },
    { name: 'FCPS Endocrinology', category: 'Pakistan', description: 'CPSP Endocrinology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/DM Endocrinology', category: 'India', description: 'Diplomate of National Board / DM' , pathwayId: 'in-dm-mch' },
  ],
  'Hematology': [
    { name: 'ST3+ Haematology', category: 'United Kingdom', description: 'Higher Specialty Training in Haematology' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Hem/Onc Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (3 years)' , pathwayId: 'us-fellowship' },
    { name: 'RACP/RCPA Joint Training', category: 'Australia/NZ', description: 'Joint training in Clinical & Lab Haematology' , pathwayId: 'racp-rcpa-joint-training' },
    { name: 'FCPS Haematology', category: 'Pakistan', description: 'CPSP Haematology training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/DM Haematology', category: 'India', description: 'Diplomate of National Board / DM' , pathwayId: 'in-dm-mch' },
  ],
  'Geriatric Medicine': [
    { name: 'ST3+ Geriatric Medicine', category: 'United Kingdom', description: 'Higher Specialty Training in Geriatrics' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Geriatrics Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (1 year)' , pathwayId: 'us-fellowship' },
    { name: 'RACP Advanced Training', category: 'Australia/NZ', description: 'Advanced training in Geriatrics' , pathwayId: 'racp-training' },
    { name: 'FCPS Geriatrics', category: 'Pakistan', description: 'CPSP Geriatrics training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MD Geriatrics', category: 'India', description: 'Diplomate of National Board / MD' , pathwayId: 'in-dnb-broad' },
  ],
  'Palliative Medicine': [
    { name: 'ST3+ Palliative Med', category: 'United Kingdom', description: 'Higher Specialty Training in Palliative Medicine' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'HPM Fellowship', category: 'United States', description: 'Hospice & Palliative Medicine fellowship (1 year)' , pathwayId: 'us-fellowship' },
    { name: 'RACP FAChPM', category: 'Australia/NZ', description: 'Chapter of Palliative Medicine training' , pathwayId: 'racp-fachpm' },
    { name: 'FCPS Palliative Med', category: 'Pakistan', description: 'CPSP Palliative Medicine training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB/MD Palliative Med', category: 'India', description: 'Diplomate of National Board / MD' , pathwayId: 'in-dnb-broad' },
  ],
  'Rehabilitation Medicine / PM&R': [
    { name: 'ST3+ Rehab Medicine', category: 'United Kingdom', description: 'Higher Specialty Training in Rehab Medicine' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'PM&R Residency', category: 'United States', description: 'ACGME-accredited residency (4 years)' , pathwayId: 'us-residency' },
    { name: 'AFRM Training', category: 'Australia/NZ', description: 'Australasian Faculty of Rehabilitation Medicine' , pathwayId: 'afrm-training' },
    { name: 'FCPS Rehab Medicine', category: 'Pakistan', description: 'CPSP Rehab Medicine training' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
    { name: 'DNB PM&R', category: 'India', description: 'Diplomate of National Board' , pathwayId: 'in-dnb-broad' },
  ],
  'Sports Medicine': [
    { name: 'ST3+ Sport & Exercise', category: 'United Kingdom', description: 'Higher Specialty Training in SEM' , pathwayId: 'uk-hst-st3-plus' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
    { name: 'Sports Med Fellowship', category: 'United States', description: 'ACGME-accredited fellowship (1 year)' , pathwayId: 'us-fellowship' },
    { name: 'ACSEP Training', category: 'Australia/NZ', description: 'Australasian College of Sport and Exercise Physicians' , pathwayId: 'acsep-training' },
  ],
  'Public Health': [
    { name: 'Public Health Training', category: 'United Kingdom', description: 'Specialty Training in Public Health (ST1-ST5)' , pathwayId: 'uk-run-through-training' },
    { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio (UKPHR)' , pathwayId: 'portfolio-pathway' },
    { name: 'Prev Med Residency', category: 'United States', description: 'Preventive Medicine residency' , pathwayId: 'us-residency' },
    { name: 'AFPHM Training', category: 'Australia/NZ', description: 'Australasian Faculty of Public Health Medicine' , pathwayId: 'afphm-training' },
    { name: 'Community Medicine', category: 'Pakistan', description: 'FCPS Community Medicine' , pathwayId: 'pk-fcps-residency' },
    { name: 'MCPS Diploma', category: 'Pakistan', description: 'Member CPSP diploma route', pathwayId: 'pk-mcps-diploma' },
    { name: 'Medical Officer (Non-Training)', category: 'Pakistan', description: 'Non-training clinical career (BPS grades)', pathwayId: 'pk-medical-officer' },
  ],
};

// Milestones organized by career path - only relevant milestones per path
export const milestonesByCareerPath: Record<string, Milestone[]> = {
  // UK Pathways
  'Run-through Training': [
    { name: 'MRCEM Primary', category: 'Exam', description: 'Basic science knowledge exam' },
    { name: 'MRCEM SBA', category: 'Exam', description: 'Single Best Answer clinical exam' },
    { name: 'MRCEM OSCE', category: 'Exam', description: 'Objective Structured Clinical Examination' },
    { name: 'FRCEM SBA', category: 'Exam', description: 'Fellowship SBA examination' },
    { name: 'FRCEM OSCE', category: 'Exam', description: 'Fellowship clinical examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST1 Entry', category: 'Training', description: 'Specialty Training Year 1 entry' },
    { name: 'ARCP Progression', category: 'Training', description: 'Annual Review of Competence Progression' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'ACCS Core Training': [
    { name: 'MRCEM Primary', category: 'Exam', description: 'Basic science knowledge exam' },
    { name: 'MRCEM SBA', category: 'Exam', description: 'Single Best Answer clinical exam' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ACCS Entry', category: 'Training', description: 'Acute Care Common Stem program entry' },
    { name: 'ARCP Progression', category: 'Training', description: 'Annual Review of Competence Progression' },
  ],
  'Portfolio Pathway': [
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    // UK Specialty Exams - users should select relevant ones for their specialty
    { name: 'MRCEM Primary', category: 'Exam', description: 'Membership of Royal College of Emergency Medicine - Primary' },
    { name: 'MRCEM SBA', category: 'Exam', description: 'MRCEM Single Best Answer' },
    { name: 'MRCEM OSCE', category: 'Exam', description: 'MRCEM Objective Structured Clinical Examination' },
    { name: 'FRCEM SBA', category: 'Exam', description: 'Fellowship RCEM Single Best Answer' },
    { name: 'FRCEM OSCE', category: 'Exam', description: 'Fellowship RCEM Clinical Examination' },
    { name: 'MRCP Part 1', category: 'Exam', description: 'Membership of Royal College of Physicians Part 1' },
    { name: 'MRCP Part 2', category: 'Exam', description: 'Membership of Royal College of Physicians Part 2' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    { name: 'MRCS Part A', category: 'Exam', description: 'Membership of Royal College of Surgeons Part A' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Membership of Royal College of Surgeons Part B OSCE' },
    { name: 'FRCS', category: 'Exam', description: 'Fellowship of Royal College of Surgeons Exit Exam' },
    { name: 'MRCPCH Part 1', category: 'Exam', description: 'Membership of Royal College of Paediatrics Part 1' },
    { name: 'MRCPCH Part 2', category: 'Exam', description: 'Membership of Royal College of Paediatrics Part 2' },
    { name: 'MRCPCH Clinical', category: 'Exam', description: 'MRCPCH Clinical Examination' },
    { name: 'MRCPsych Paper A', category: 'Exam', description: 'Membership of Royal College of Psychiatrists Paper A' },
    { name: 'MRCPsych Paper B', category: 'Exam', description: 'Membership of Royal College of Psychiatrists Paper B' },
    { name: 'MRCPsych CASC', category: 'Exam', description: 'Clinical Assessment of Skills and Competencies' },
    { name: 'FRCA Primary', category: 'Exam', description: 'Fellowship of Royal College of Anaesthetists Primary' },
    { name: 'FRCA Final', category: 'Exam', description: 'Fellowship of Royal College of Anaesthetists Final' },
    { name: 'FRCR Part 1', category: 'Exam', description: 'Fellowship of Royal College of Radiologists Part 1' },
    { name: 'FRCR Part 2A', category: 'Exam', description: 'FRCR Part 2A Written' },
    { name: 'FRCR Part 2B', category: 'Exam', description: 'FRCR Part 2B Rapid Reporting and Oral' },
    { name: 'MRCOG Part 1', category: 'Exam', description: 'Membership of Royal College of O&G Part 1' },
    { name: 'MRCOG Part 2', category: 'Exam', description: 'Membership of Royal College of O&G Part 2' },
    { name: 'MRCOG Part 3', category: 'Exam', description: 'Membership of Royal College of O&G Part 3 Clinical' },
    // Portfolio milestones
    { name: 'Portfolio Completion', category: 'Document', description: 'Comprehensive evidence of Knowledge, Skills & Experience (KSEs)' },
    { name: 'Portfolio Application', category: 'Document', description: 'Specialist registration application submitted to GMC' },
    { name: 'Specialist Registration', category: 'Registration', description: 'Added to GMC Specialist Register' },
  ],
  'Higher Specialty Training': [
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Core Training Completion', category: 'Training', description: 'Completion of Core Training or equivalent (CREST)' },
    { name: 'ST3/ST4 Entry', category: 'Training', description: 'Entry into Higher Specialty Training' },
    // UK Specialty Exams - Emergency Medicine
    { name: 'MRCEM Primary', category: 'Exam', description: 'Membership of Royal College of Emergency Medicine - Primary' },
    { name: 'MRCEM SBA', category: 'Exam', description: 'MRCEM Single Best Answer' },
    { name: 'MRCEM OSCE', category: 'Exam', description: 'MRCEM Objective Structured Clinical Examination' },
    { name: 'FRCEM SBA', category: 'Exam', description: 'Fellowship RCEM Single Best Answer' },
    { name: 'FRCEM OSCE', category: 'Exam', description: 'Fellowship RCEM Clinical Examination' },
    // UK Specialty Exams - Medicine
    { name: 'MRCP Part 1', category: 'Exam', description: 'Membership of Royal College of Physicians Part 1' },
    { name: 'MRCP Part 2', category: 'Exam', description: 'Membership of Royal College of Physicians Part 2' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    // UK Specialty Exams - Surgery
    { name: 'MRCS Part A', category: 'Exam', description: 'Membership of Royal College of Surgeons Part A' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Membership of Royal College of Surgeons Part B OSCE' },
    { name: 'FRCS', category: 'Exam', description: 'Fellowship of Royal College of Surgeons Exit Exam' },
    // UK Specialty Exams - Paediatrics
    { name: 'MRCPCH Part 1', category: 'Exam', description: 'Membership of Royal College of Paediatrics Part 1' },
    { name: 'MRCPCH Part 2', category: 'Exam', description: 'Membership of Royal College of Paediatrics Part 2' },
    { name: 'MRCPCH Clinical', category: 'Exam', description: 'MRCPCH Clinical Examination' },
    // UK Specialty Exams - Psychiatry
    { name: 'MRCPsych Paper A', category: 'Exam', description: 'Membership of Royal College of Psychiatrists Paper A' },
    { name: 'MRCPsych Paper B', category: 'Exam', description: 'Membership of Royal College of Psychiatrists Paper B' },
    { name: 'MRCPsych CASC', category: 'Exam', description: 'Clinical Assessment of Skills and Competencies' },
    // UK Specialty Exams - Anaesthetics
    { name: 'FRCA Primary', category: 'Exam', description: 'Fellowship of Royal College of Anaesthetists Primary' },
    { name: 'FRCA Final', category: 'Exam', description: 'Fellowship of Royal College of Anaesthetists Final' },
    // UK Specialty Exams - Radiology
    { name: 'FRCR Part 1', category: 'Exam', description: 'Fellowship of Royal College of Radiologists Part 1' },
    { name: 'FRCR Part 2A', category: 'Exam', description: 'FRCR Part 2A Written' },
    { name: 'FRCR Part 2B', category: 'Exam', description: 'FRCR Part 2B Rapid Reporting and Oral' },
    // UK Specialty Exams - O&G
    { name: 'MRCOG Part 1', category: 'Exam', description: 'Membership of Royal College of O&G Part 1' },
    { name: 'MRCOG Part 2', category: 'Exam', description: 'Membership of Royal College of O&G Part 2' },
    { name: 'MRCOG Part 3', category: 'Exam', description: 'Membership of Royal College of O&G Part 3 Clinical' },
    // Training milestones
    { name: 'ARCP Progression', category: 'Training', description: 'Annual Review of Competence Progression' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'CESR-CP': [
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Training Post', category: 'Training', description: 'Secured approved training position' },
    { name: 'Portfolio Building', category: 'Document', description: 'Building evidence for combined programme' },
    { name: 'Combined Programme Application', category: 'Document', description: 'Combined programme application' },
  ],
  'Expedited Specialist Pathway': [
    { name: 'Specialist Recognition', category: 'Certification', description: 'Recognition as specialist in home country' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Provisional/Limited registration' },
    // Australian College Exams - users should select relevant ones
    { name: 'ACEM Primary', category: 'Exam', description: 'Australasian College for Emergency Medicine Primary' },
    { name: 'ACEM Fellowship Exam', category: 'Exam', description: 'FACEM Fellowship Examination' },
    { name: 'RACP Written Exam', category: 'Exam', description: 'Royal Australasian College of Physicians Written' },
    { name: 'RACP Clinical Exam', category: 'Exam', description: 'Royal Australasian College of Physicians Clinical' },
    { name: 'RANZCP Written', category: 'Exam', description: 'Royal Australian and NZ College of Psychiatrists Written' },
    { name: 'RANZCP OSCE', category: 'Exam', description: 'Royal Australian and NZ College of Psychiatrists OSCE' },
    { name: 'ANZCA Primary', category: 'Exam', description: 'Australian and NZ College of Anaesthetists Primary' },
    { name: 'ANZCA Final', category: 'Exam', description: 'Australian and NZ College of Anaesthetists Final' },
    { name: 'RANZCOG Written', category: 'Exam', description: 'Royal Australian and NZ College of O&G Written' },
    { name: 'RANZCOG Oral', category: 'Exam', description: 'Royal Australian and NZ College of O&G Oral' },
    { name: 'Supervised Practice', category: 'Training', description: 'Period of supervised practice in Australia' },
    { name: 'Fellowship Assessment', category: 'Certification', description: 'College assessment for fellowship' },
  ],
  'MTI Scheme': [
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Visa Sponsorship', category: 'Immigration', description: 'Tier 5 visa sponsorship secured' },
    { name: 'MTI Training Post', category: 'Training', description: 'Medical Training Initiative placement' },
  ],
  'MRCP to CCT Pathway': [
    { name: 'MRCP Part 1', category: 'Exam', description: 'Written knowledge examination' },
    { name: 'MRCP Part 2', category: 'Exam', description: 'Written clinical examination' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'IMT Entry', category: 'Training', description: 'Internal Medicine Training entry' },
    { name: 'Specialty Training', category: 'Training', description: 'Higher specialty training commenced' },
  ],
  'MRCS to FRCS CCT': [
    { name: 'MRCS Part A', category: 'Exam', description: 'Written surgical sciences examination' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Clinical OSCE examination' },
    { name: 'FRCS', category: 'Exam', description: 'Fellowship specialty exit examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'CST Entry', category: 'Training', description: 'Core Surgical Training entry' },
    { name: 'ST3+ Entry', category: 'Training', description: 'Higher surgical training entry' },
  ],
  'PLAB to Training': [
    { name: 'PLAB 1', category: 'Exam', description: 'Professional Linguistic Assessment Board Part 1' },
    { name: 'PLAB 2', category: 'Exam', description: 'Professional Linguistic Assessment Board Part 2' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'NHS Employment', category: 'Training', description: 'Secured NHS employment' },
    { name: 'Specialty Application', category: 'Training', description: 'Applied for specialty training' },
  ],
  // Retaining old key for backward compatibility or linking it to Portfolio Pathway if needed
  'CESR Pathway': [
    { name: 'Redirect', category: 'Info', description: 'Renamed to Portfolio Pathway' }
  ],
  'MRCPCH to CCT': [
    { name: 'MRCPCH Part 1', category: 'Exam', description: 'Foundation of Practice examination' },
    { name: 'MRCPCH Part 2', category: 'Exam', description: 'Theory and Science examination' },
    { name: 'MRCPCH Clinical', category: 'Exam', description: 'Clinical examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Paediatric Training Entry', category: 'Training', description: 'Paediatric specialty training entry' },
  ],
  'MRCPsych to CCT': [
    { name: 'MRCPsych Paper A', category: 'Exam', description: 'Written paper on core psychiatry' },
    { name: 'MRCPsych Paper B', category: 'Exam', description: 'Written paper on clinical topics' },
    { name: 'MRCPsych CASC', category: 'Exam', description: 'Clinical Assessment of Skills and Competencies' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Core Training Entry', category: 'Training', description: 'Psychiatry core training entry' },
  ],
  'MRCGP CCT Training': [
    { name: 'MRCGP AKT', category: 'Exam', description: 'Applied Knowledge Test' },
    { name: 'MRCGP RCA', category: 'Exam', description: 'Recorded Consultation Assessment' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'GPST Entry', category: 'Training', description: 'GP Specialty Training entry' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'FRCA to CCT': [
    { name: 'FRCA Primary', category: 'Exam', description: 'Primary FRCA examination' },
    { name: 'FRCA Final', category: 'Exam', description: 'Final FRCA examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Anaesthetic Training Entry', category: 'Training', description: 'Anaesthetics specialty training entry' },
  ],
  'FRCR to CCT': [
    { name: 'FRCR Part 1', category: 'Exam', description: 'Physics and anatomy examination' },
    { name: 'FRCR Part 2A', category: 'Exam', description: 'Written examination' },
    { name: 'FRCR Part 2B', category: 'Exam', description: 'Rapid reporting and oral examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Radiology Training Entry', category: 'Training', description: 'Radiology specialty training entry' },
  ],
  'MRCOG to CCT': [
    { name: 'MRCOG Part 1', category: 'Exam', description: 'Basic sciences examination' },
    { name: 'MRCOG Part 2', category: 'Exam', description: 'Written clinical examination' },
    { name: 'MRCOG Part 3', category: 'Exam', description: 'Clinical assessment examination' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'O&G Training Entry', category: 'Training', description: 'Obstetrics & Gynaecology training entry' },
  ],
  'FRCS Trauma & Ortho CCT': [
    { name: 'MRCS Part A', category: 'Exam', description: 'Written surgical sciences examination' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Clinical OSCE examination' },
    { name: 'FRCS T&O', category: 'Exam', description: 'Trauma & Orthopaedics fellowship exam' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'T&O Training Entry', category: 'Training', description: 'Trauma & Orthopaedics training entry' },
  ],

  // USA Pathways
  'ABEM Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'ABEM Board Certification', category: 'Certification', description: 'American Board of Emergency Medicine certified' },
  ],
  'ABIM Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'ABIM Board Certification', category: 'Certification', description: 'American Board of Internal Medicine certified' },
  ],
  'ABS Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABS Qualifying Exam', category: 'Exam', description: 'Written qualifying examination' },
    { name: 'ABS Certifying Exam', category: 'Exam', description: 'Oral certifying examination' },
  ],
  'ECFMG Pathway': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Visa Sponsorship', category: 'Immigration', description: 'J-1 or H-1B visa sponsorship secured' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
  ],
  'ABP Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABP Certification', category: 'Certification', description: 'American Board of Pediatrics certified' },
  ],
  'ABPN Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABPN Board Certification', category: 'Certification', description: 'American Board of Psychiatry and Neurology certified' },
  ],
  'ABFM Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABFM Certification', category: 'Certification', description: 'American Board of Family Medicine certified' },
  ],
  'ABA Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABA Board Certification', category: 'Certification', description: 'American Board of Anesthesiology certified' },
  ],
  'ABR Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABR Core Exam', category: 'Exam', description: 'Radiology core examination' },
    { name: 'ABR Certifying Exam', category: 'Certification', description: 'Radiology certifying examination' },
  ],
  'ABOG Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABOG Certification', category: 'Certification', description: 'American Board of Obstetrics and Gynecology certified' },
  ],
  'ABOS Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science medical licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'ECFMG Certification', category: 'Certification', description: 'Educational Commission for Foreign Medical Graduates' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to residency program via NRMP' },
    { name: 'ABOS Part I', category: 'Exam', description: 'Written orthopaedic examination' },
    { name: 'ABOS Part II', category: 'Exam', description: 'Oral orthopaedic examination' },
  ],

  // Australia/NZ Pathways
  'ACEM Fellowship': [
    { name: 'ACEM Primary', category: 'Exam', description: 'Basic sciences examination' },
    { name: 'ACEM Fellowship Exam', category: 'Exam', description: 'Fellowship clinical examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FACEM Completion', category: 'Certification', description: 'Fellow of Australasian College for Emergency Medicine' },
  ],
  'AMC Standard Pathway': [
    { name: 'AMC CAT MCQ', category: 'Exam', description: 'Computer Adaptive Test MCQ examination' },
    { name: 'AMC Clinical', category: 'Exam', description: 'Clinical examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'Workplace-Based Assessment', category: 'Training', description: 'On-the-job clinical assessment' },
  ],
  'RACP Training': [
    { name: 'RACP Written Exam', category: 'Exam', description: 'Written divisional examination' },
    { name: 'RACP Clinical Exam', category: 'Exam', description: 'Clinical examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRACP Completion', category: 'Certification', description: 'Fellow of Royal Australasian College of Physicians' },
  ],
  'RACP Paediatrics': [
    { name: 'RACP Written Exam', category: 'Exam', description: 'Written divisional examination' },
    { name: 'RACP Clinical Exam', category: 'Exam', description: 'Clinical examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRACP Paediatrics', category: 'Certification', description: 'Paediatric division fellowship' },
  ],
  'RACS Fellowship': [
    { name: 'RACS Surgical Sciences', category: 'Exam', description: 'Generic Surgical Sciences Examination' },
    { name: 'RACS Clinical', category: 'Exam', description: 'Fellowship clinical examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRACS Completion', category: 'Certification', description: 'Fellow of Royal Australasian College of Surgeons' },
  ],
  'RANZCP Fellowship': [
    { name: 'RANZCP Written', category: 'Exam', description: 'Written examination' },
    { name: 'RANZCP OSCE', category: 'Exam', description: 'Objective Structured Clinical Examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRANZCP Completion', category: 'Certification', description: 'Fellow of Royal Australian and NZ College of Psychiatrists' },
  ],
  'RACGP Fellowship': [
    { name: 'RACGP AKT', category: 'Exam', description: 'Applied Knowledge Test' },
    { name: 'RACGP KFP', category: 'Exam', description: 'Key Feature Problem examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRACGP Completion', category: 'Certification', description: 'Fellow of Royal Australian College of General Practitioners' },
  ],
  'ANZCA Fellowship': [
    { name: 'ANZCA Primary', category: 'Exam', description: 'Primary examination' },
    { name: 'ANZCA Final', category: 'Exam', description: 'Final examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FANZCA Completion', category: 'Certification', description: 'Fellow of Australian and NZ College of Anaesthetists' },
  ],
  'RANZCR Fellowship': [
    { name: 'RANZCR Part 1', category: 'Exam', description: 'Part 1 examination' },
    { name: 'RANZCR Part 2', category: 'Exam', description: 'Part 2 examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRANZCR Completion', category: 'Certification', description: 'Fellow of Royal Australian and NZ College of Radiologists' },
  ],
  'RANZCOG Fellowship': [
    { name: 'RANZCOG Written', category: 'Exam', description: 'Written examination' },
    { name: 'RANZCOG Oral', category: 'Exam', description: 'Oral examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FRANZCOG Completion', category: 'Certification', description: 'Fellow of Royal Australian and NZ College of O&G' },
  ],
  'AOA Fellowship': [
    { name: 'RACS Surgical Sciences', category: 'Exam', description: 'Generic Surgical Sciences Examination' },
    { name: 'AOA Training', category: 'Training', description: 'Australian Orthopaedic Association training' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'FAOrthA Completion', category: 'Certification', description: 'Fellow of Australian Orthopaedic Association' },
  ],

  // Canada Pathways
  'RCPSC Training': [
    { name: 'NAC OSCE', category: 'Exam', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Exam', description: 'Medical Council of Canada Qualifying Exam Part 1' },

    { name: 'LMCC Certification', category: 'Certification', description: 'Licentiate of Medical Council of Canada' },
    { name: 'Provincial Registration', category: 'Registration', description: 'Provincial medical licensing' },
  ],
  'RCPS-EM Training': [
    { name: 'NAC OSCE', category: 'Exam', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Exam', description: 'Medical Council of Canada Qualifying Exam Part 1' },
    { name: 'Provincial Registration', category: 'Registration', description: 'Provincial medical licensing' },
    { name: 'RCPS-EM Certification', category: 'Certification', description: 'Royal College Emergency Medicine certification' },
  ],
  'CCFP-EM Training': [
    { name: 'NAC OSCE', category: 'Exam', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Exam', description: 'Medical Council of Canada Qualifying Exam Part 1' },
    { name: 'CCFP Certification', category: 'Certification', description: 'Certification in Family Practice' },
    { name: 'CCFP-EM Enhanced Skills', category: 'Certification', description: 'Emergency Medicine enhanced skills' },
  ],
  'CFPC Certification': [
    { name: 'NAC OSCE', category: 'Exam', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Exam', description: 'Medical Council of Canada Qualifying Exam Part 1' },
    { name: 'CFPC Certification', category: 'Certification', description: 'College of Family Physicians of Canada certification' },
    { name: 'Provincial Registration', category: 'Registration', description: 'Provincial medical licensing' },
  ],

  // Pakistan Pathways
  'FCPS Emergency Medicine': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination (Theory + TOACS)' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
    { name: 'FCPS Completion', category: 'Certification', description: 'Fellowship of College of Physicians and Surgeons' },
  ],
  'FCPS Medicine': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Surgery': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Paediatrics': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Psychiatry': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Family Medicine': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Anaesthesia': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Radiology': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Obstetrics & Gynaecology': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],
  'FCPS Orthopaedics': [
    { name: 'FCPS Part 1', category: 'Exam', description: 'Basic sciences MCQ examination' },
    { name: 'Mandatory Workshops', category: 'Training', description: 'BLS, Research, IT, Communication Skills' },
    { name: 'IMM Examination', category: 'Exam', description: 'Intermediate Module examination' },
    { name: 'FCPS Part 2', category: 'Exam', description: 'Clinical and practical examination' },
    { name: 'PMDC Registration', category: 'Registration', description: 'Pakistan Medical and Dental Council registration' },
  ],

  // India Pathways
  'DNB Emergency Medicine': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Internal Medicine': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB General Surgery': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Paediatrics': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Psychiatry': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Family Medicine': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Anaesthesia': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Radiology': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Obstetrics & Gynaecology': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],
  'DNB Orthopaedics': [
    { name: 'DNB Theory', category: 'Exam', description: 'Written theory examination' , pathwayId: 'in-dnb-broad' },
    { name: 'DNB Practical', category: 'Exam', description: 'Clinical practical examination' , pathwayId: 'in-dnb-broad' },
    { name: 'NMC Registration', category: 'Registration', description: 'National Medical Commission registration' },
  ],

  // Ireland Pathways
  'MCEM/FCEM Pathway': [
    { name: 'MCEM Part A', category: 'Exam', description: 'Basic sciences examination' },
    { name: 'MCEM Part B', category: 'Exam', description: 'Clinical knowledge examination' },
    { name: 'MCEM Part C', category: 'Exam', description: 'Clinical OSCE examination' },
    { name: 'FCEM', category: 'Exam', description: 'Fellowship examination' },
    { name: 'Irish Medical Council Registration', category: 'Registration', description: 'Ireland medical registration' },
  ],
  'MRCPI Pathway': [
    { name: 'MRCPI Part 1', category: 'Exam', description: 'Written examination' },
    { name: 'MRCPI Part 2', category: 'Exam', description: 'Clinical examination' },
    { name: 'Irish Medical Council Registration', category: 'Registration', description: 'Ireland medical registration' },
  ],
  'FRCSI Pathway': [
    { name: 'MRCSI Part A', category: 'Exam', description: 'Written surgical sciences examination' },
    { name: 'MRCSI Part B', category: 'Exam', description: 'Clinical OSCE examination' },
    { name: 'FRCSI', category: 'Exam', description: 'Fellowship examination' },
    { name: 'Irish Medical Council Registration', category: 'Registration', description: 'Ireland medical registration' },
  ],
  'ICGP Training': [
    { name: 'MICGP Exam', category: 'Exam', description: 'Membership examination' },
    { name: 'Irish Medical Council Registration', category: 'Registration', description: 'Ireland medical registration' },
    { name: 'ICGP Completion', category: 'Certification', description: 'Irish College of General Practitioners certification' },
  ],

  // Middle East Pathways
  'Gulf Board EM': [
    { name: 'Gulf Board Part 1', category: 'Exam', description: 'Part 1 written examination' },
    { name: 'Gulf Board Part 2', category: 'Exam', description: 'Part 2 clinical examination' },
    { name: 'DHA/HAAD/MOH License', category: 'Registration', description: 'Gulf medical licensing authority' },
  ],
  'Gulf Board Internal Medicine': [
    { name: 'Gulf Board Part 1', category: 'Exam', description: 'Part 1 written examination' },
    { name: 'Gulf Board Part 2', category: 'Exam', description: 'Part 2 clinical examination' },
    { name: 'DHA/HAAD/MOH License', category: 'Registration', description: 'Gulf medical licensing authority' },
  ],
  'Gulf Board Surgery': [
    { name: 'Gulf Board Part 1', category: 'Exam', description: 'Part 1 written examination' },
    { name: 'Gulf Board Part 2', category: 'Exam', description: 'Part 2 clinical examination' },
    { name: 'DHA/HAAD/MOH License', category: 'Registration', description: 'Gulf medical licensing authority' },
  ],

  // Germany Pathways
  'German Medical License': [
    { name: 'German B2 Certificate', category: 'Language', description: 'General German proficiency' },
    { name: 'Fachsprachenprüfung', category: 'Exam', description: 'Medical German terminology exam (C1 level)' },
    { name: 'Kenntnisprüfung', category: 'Exam', description: 'Knowledge exam (equivalence test) if required' },
    { name: 'Approbation', category: 'Registration', description: 'Full German medical license' },
  ],
  'Facharzt Training': [
    { name: 'Approbation', category: 'Registration', description: 'Full German medical license' },
    { name: 'Residency Position', category: 'Training', description: 'Assistenzarzt position secured' },
    { name: 'Logbook Completion', category: 'Training', description: 'Documentation of clinical rotations/procedures' },
    { name: 'Facharztprüfung', category: 'Exam', description: 'Specialist examination' },
  ],

  // Singapore Pathways
  'Singapore Residency': [
    { name: 'SMC Registration', category: 'Registration', description: 'Singapore Medical Council (Conditional/Prov)' },
    { name: 'MOHH Employment', category: 'Training', description: 'Offer from MOH Holdings' },
    { name: 'Residency Match', category: 'Training', description: 'Successful match into residency program' },
    { name: 'Specialist Accreditation', category: 'Certification', description: 'Specialist Accreditation Board (SAB)' },
  ],

  // Critical Care Pathways
  'FICM ICM Training': [
    { name: 'FICM Primary', category: 'Exam', description: 'Faculty of Intensive Care Medicine Primary' },
    { name: 'FICM Final', category: 'Exam', description: 'Faculty of Intensive Care Medicine Final' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Stage 1 Training', category: 'Training', description: 'Core training years (CT1-CT2/3)' },
    { name: 'Stage 2 Training', category: 'Training', description: 'Higher specialty training (ST3-ST6)' },
    { name: 'Stage 3 Training', category: 'Training', description: 'Advanced training year (ST7)' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Dual CCT (ICM + Partner)': [
    { name: 'FICM Primary', category: 'Exam', description: 'Faculty of Intensive Care Medicine Primary' },
    { name: 'FICM Final', category: 'Exam', description: 'Faculty of Intensive Care Medicine Final' },
    // Partner exams usually added by user via "Exams" section, or generic placeholders
    { name: 'Partner Specialty Exam', category: 'Exam', description: 'Primary exam for partner specialty (e.g. FRCA/MRCP)' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'Dual Training Post', category: 'Training', description: 'Accepted onto Dual CCT programme' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Pulm/CCM Fellowship': [
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'IM Board Certification', category: 'Certification', description: 'ABIM Internal Medicine Certified' },
    { name: 'Fellowship Match', category: 'Training', description: 'Matched to Pulm/CCM fellowship' },
    { name: 'Pulmonary Board Exam', category: 'Exam', description: 'ABIM Pulmonary Disease exam' },
    { name: 'Critical Care Board Exam', category: 'Exam', description: 'ABIM Critical Care Medicine exam' },
  ],
  'Critical Care Fellowship': [
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'Primary Board Cert', category: 'Certification', description: 'Board certified in primary specialty (IM, EM, Anes)' },
    { name: 'Fellowship Match', category: 'Training', description: 'Matched to CCM fellowship' },
    { name: 'Critical Care Board Exam', category: 'Exam', description: 'ABIM/ABA Critical Care Medicine exam' },
  ],
  'CICM Fellowship': [
    { name: 'CICM First Part', category: 'Exam', description: 'Basic sciences examination' },
    { name: 'CICM Second Part', category: 'Exam', description: 'Fellowship examination' },
    { name: 'AHPRA Registration', category: 'Registration', description: 'Australian Health Practitioner Regulation Agency' },
    { name: 'Foundation Training', category: 'Training', description: 'Initial foundation years' },
    { name: 'Core Training', category: 'Training', description: 'Core training completion' },
    { name: 'Transition Year', category: 'Training', description: 'Transition year completion' },
    { name: 'General Training', category: 'Training', description: 'General training completion' },
  ],

  // Medical Sub-specialty Pathways (Generic Template)
  'ST3+ Cardiology': [
    { name: 'MRCP Part 1', category: 'Exam', description: 'Membership of Royal College of Physicians Part 1' },
    { name: 'MRCP Part 2', category: 'Exam', description: 'Membership of Royal College of Physicians Part 2' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'EECC (European Exam)', category: 'Exam', description: 'European Examination in Core Cardiology' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Cardiology Fellowship': [
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'ABIM Board Certification', category: 'Certification', description: 'Internal Medicine Board Certification' },
    { name: 'Fellowship Match', category: 'Training', description: 'Matched to Cardiology fellowship' },
    { name: 'Cardiology Board Exam', category: 'Exam', description: 'ABIM Cardiovascular Disease exam' },
  ],
  'ST3+ Gastroenterology': [
    { name: 'MRCP Part 1', category: 'Exam', description: 'Membership of Royal College of Physicians Part 1' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'ESEGH Exam', category: 'Exam', description: 'Specialty Certificate Examination in Gastro & Hep' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'GI Fellowship': [
    { name: 'USMLE Step 3', category: 'Exam', description: 'Clinical management licensing exam' },
    { name: 'ABIM Board Certification', category: 'Certification', description: 'Internal Medicine Board Certification' },
    { name: 'Fellowship Match', category: 'Training', description: 'Matched to GI fellowship' },
    { name: 'GI Board Exam', category: 'Exam', description: 'ABIM Gastroenterology exam' },
  ],

  // Surgical Sub-specialty Pathways
  'ST3+ Neurosurgery': [
    { name: 'MRCS Part A', category: 'Exam', description: 'Membership of Royal College of Surgeons Part A' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Membership of Royal College of Surgeons Part B' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'FRCS (Neuro)', category: 'Exam', description: 'Intercollegiate Specialty Examination in Neurosurgery' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Neurosurgery Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science licensing exam' },
    { name: 'USMLE Step 2 CK', category: 'Exam', description: 'Clinical knowledge licensing exam' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to Neurosurgery residency' },
    { name: 'ABNS Primary Exam', category: 'Exam', description: 'Written board examination' },
    { name: 'ABNS Oral Exam', category: 'Exam', description: 'Oral board certification exam' },
  ],
  'ST3+ Plastic Surgery': [
    { name: 'MRCS Part A', category: 'Exam', description: 'Membership of Royal College of Surgeons Part A' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Membership of Royal College of Surgeons Part B' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'FRCS (Plast)', category: 'Exam', description: 'Intercollegiate Specialty Examination in Plastic Surgery' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Integrated Plastics': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science licensing exam' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to Integrated Plastics residency' },
    { name: 'ABPS Written Exam', category: 'Exam', description: 'American Board of Plastic Surgery Written' },
    { name: 'ABPS Oral Exam', category: 'Exam', description: 'American Board of Plastic Surgery Oral' },
  ],

  // Standalone Specialties
  'ST3+ Dermatology': [
    { name: 'MRCP Part 1', category: 'Exam', description: 'Membership of Royal College of Physicians Part 1' },
    { name: 'MRCP PACES', category: 'Exam', description: 'Practical Assessment of Clinical Examination Skills' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'SCE Dermatology', category: 'Exam', description: 'Specialty Certificate Examination in Dermatology' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Dermatology Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science licensing exam' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to Dermatology residency' },
    { name: 'ABD CORE Exam', category: 'Exam', description: 'American Board of Dermatology CORE' },
    { name: 'ABD APPLIED Exam', category: 'Exam', description: 'American Board of Dermatology APPLIED' },
  ],
  'ST1 Run-through': [
    // This is a generic key used by Neuro, Opth, etc. We should make it specific or generic enough.
    // Since it's reused, let's add generic run-through milestones.
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST1 Entry', category: 'Training', description: 'Specialty Training Year 1 entry' },
    { name: 'Membership Exam', category: 'Exam', description: 'Relevant Royal College Membership Exam' },
    { name: 'Fellowship Exam', category: 'Exam', description: 'Relevant Royal College Fellowship Exam' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'Ophthalmology Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science licensing exam' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to Ophthalmology residency' },
    { name: 'OKAP Exam', category: 'Exam', description: 'Ophthalmic Knowledge Assessment Program' },
    { name: 'ABO Written Exam', category: 'Exam', description: 'American Board of Ophthalmology Written' },
    { name: 'ABO Oral Exam', category: 'Exam', description: 'American Board of Ophthalmology Oral' },
  ],
  'ST3+ ENT': [
    { name: 'MRCS Part A', category: 'Exam', description: 'Membership of Royal College of Surgeons Part A' },
    { name: 'MRCS Part B', category: 'Exam', description: 'Membership of Royal College of Surgeons Part B' },
    { name: 'GMC Registration', category: 'Registration', description: 'UK General Medical Council registration' },
    { name: 'ST3 Entry', category: 'Training', description: 'Higher Specialty Training entry' },
    { name: 'FRCS (ORL-HNS)', category: 'Exam', description: 'Intercollegiate Specialty Examination in Otolaryngology' },
    { name: 'CCT Completion', category: 'Training', description: 'Certificate of Completion of Training' },
  ],
  'ENT Residency': [
    { name: 'USMLE Step 1', category: 'Exam', description: 'Basic science licensing exam' },
    { name: 'Residency Match', category: 'Training', description: 'Matched to ENT residency' },
    { name: 'ABXZ Qualifying Exam', category: 'Exam', description: 'American Board of Otolaryngology Qualifying' },
    { name: 'ABXZ Certifying Exam', category: 'Exam', description: 'American Board of Otolaryngology Certifying' },
  ],
};

/**
 * Mapping of specialty to relevant specialty exams (UK, Australia, etc.)
 * Used to filter milestones in generic pathways like 'HST CCT Training' or 'Portfolio Pathway'
 */
export const examsBySpecialty: Record<string, string[]> = {
  'Emergency Medicine': [
    'MRCEM Primary', 'MRCEM SBA', 'MRCEM OSCE', 'FRCEM SBA', 'FRCEM OSCE',
    'ACEM Primary', 'ACEM Fellowship Exam',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Internal Medicine': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'RACP Written Exam', 'RACP Clinical Exam',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Surgery': [
    'MRCS Part A', 'MRCS Part B', 'FRCS',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Pediatrics': [
    'MRCPCH Part 1', 'MRCPCH Part 2', 'MRCPCH Clinical',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Psychiatry': [
    'MRCPsych Paper A', 'MRCPsych Paper B', 'MRCPsych CASC',
    'RANZCP Written', 'RANZCP OSCE',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Anesthesiology': [
    'FRCA Primary', 'FRCA Final',
    'ANZCA Primary', 'ANZCA Final',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Radiology': [
    'FRCR Part 1', 'FRCR Part 2A', 'FRCR Part 2B',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Obstetrics & Gynecology': [
    'MRCOG Part 1', 'MRCOG Part 2', 'MRCOG Part 3',
    'RANZCOG Written', 'RANZCOG Oral',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Orthopedic Surgery': [
    'FRCS Trauma & Ortho CCT', 'FRCS T&O', 'MRCS Part A', 'MRCS Part B',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Family Medicine': [
    'MRCGP Part 1', 'MRCGP Part 2', 'MRCGP Clinical',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Critical Care / ICU': [
    'FICM Primary', 'FICM Final', 'EDIC Part 1', 'EDIC Part 2',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Cardiology': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'EECC (European Exam)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Gastroenterology': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'ESEGH (European Exam)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Pulmonology': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'HERMES (European Exam)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Neurology': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK', 'RITE Exam'
  ],
  'Oncology': [
    'MRCP Part 1', 'MRCP Part 2', 'MRCP PACES',
    'FRCR Part 1 (Onc)', 'FRCR Part 2 (Onc)',
    'ESMO Exam',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination'
  ],
  'Neurosurgery': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (Neuro)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Plastic Surgery': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (Plast)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Cardiothoracic Surgery': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (C-Th)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Vascular Surgery': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (Vasc)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Urology': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (Urol)',
    'FCPS Part 1', 'FCPS Part 2', 'IMM Examination',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Dermatology': [
    'MRCP (Specialty Cert)', 'FCPS Part 1',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Ophthalmology': [
    'FRCOphth Part 1', 'FRCOphth Part 2',
    'FCPS Part 1', 'FCOphth',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'ENT (Otolaryngology)': [
    'MRCS Part A', 'MRCS Part B', 'FRCS (ORL-HNS)',
    'FCPS Part 1', 'DOHNS',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Pathology': [
    'FRCPath Part 1', 'FRCPath Part 2',
    'FCPS Part 1',
    'USMLE Step 1', 'USMLE Step 2 CK'
  ],
  'Nephrology': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'ESENeph', 'FCPS Part 1'],
  'Infectious Disease': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'FCPS Part 1'],
  'Rheumatology': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'ESE-Rheum', 'FCPS Part 1'],
  'Endocrinology': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'ESE-Endo', 'FCPS Part 1'],
  'Hematology': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'FRCPath 1', 'FRCPath 2', 'FCPS Part 1'],
  'Geriatric Medicine': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'SCE Geriatrics', 'FCPS Part 1'],
  'Palliative Medicine': ['MRCP Part 1', 'MRCP Part 2', 'MRCP PACES', 'SCE Palliative', 'FCPS Part 1'],
  'Rehabilitation Medicine / PM&R': ['MRCP Part 1', 'MRCP Part 2', 'ABPMR Part 1'],
  'Sports Medicine': ['MFSEM Part 1', 'MFSEM Part 2', 'DipSM'],
  'Public Health': ['Diplomate Exam (DFPH)', 'MFPH Final', 'MPH']
};

// Common milestones - language tests and general career items
export const commonMilestones: Milestone[] = [
  // Language Tests
  { name: 'IELTS Academic', category: 'Language', description: 'International English Language Testing System' },
  { name: 'OET', category: 'Language', description: 'Occupational English Test' },
  { name: 'TOEFL iBT', category: 'Language', description: 'Test of English as a Foreign Language' },
  // General Career Milestones
  { name: 'CV/Portfolio Updated', category: 'Document', description: 'Professional documents prepared' },
  { name: 'Reference Letters', category: 'Document', description: 'Professional references obtained' },
];

// Default career pathways for specialties not in the mapping
export const defaultCareerPaths: CareerPath[] = [
  { name: 'Specialty Training (UK)', category: 'United Kingdom', description: 'NHS Specialty Training Program' },
  { name: 'Portfolio Pathway', category: 'United Kingdom', description: 'Specialist Registration via Portfolio' , pathwayId: 'portfolio-pathway' },
  { name: 'MTI Scheme (UK)', category: 'United Kingdom', description: 'Medical Training Initiative' },
  { name: 'Residency / Fellowship (USA)', category: 'United States', description: 'ACGME accredited program' },
  { name: 'ECFMG Pathway', category: 'United States', description: 'Educational Commission for Foreign Medical Graduates' , pathwayId: 'ecfmg-pathway' },
  { name: 'Specialist Training (Aus)', category: 'Australia', description: 'College specialist training program' },
  { name: 'AMC Standard Pathway', category: 'Australia', description: 'Australian Medical Council pathway for IMGs' , pathwayId: 'amc-standard-pathway' },
  { name: 'Residency (Canada)', category: 'Canada', description: 'RCPSC specialty training' },
  { name: 'FCPS Training', category: 'Pakistan', description: 'College of Physicians and Surgeons Pakistan' },
  { name: 'DNB/MD Training', category: 'India', description: 'Diplomate of National Board / MD' , pathwayId: 'in-dnb-broad' },
  { name: 'Gulf Board Training', category: 'Middle East', description: 'Gulf Cooperation Council specialty training' },

  { name: 'Saudi Board (SCFHS)', category: 'Saudi Arabia', description: 'Saudi Commission for Health Specialties board training', pathwayId: 'me-saudi-board' },
  { name: 'EU Specialty Training', category: 'Europe', description: 'European specialty recognition pathway' },
  { name: 'Medical License/Approbation', category: 'Germany', description: 'License to practice' },
  { name: 'Facharzt Training', category: 'Germany', description: 'Specialist medical training' , pathwayId: 'de-facharzt' },
  { name: 'French Internat (EDN/ECOS)', category: 'France', description: 'Main specialist training (DES)', pathwayId: 'fr-internat-edn' },
  { name: 'PAE Authorization', category: 'France', description: 'Non-EU doctor authorization (EVC exam)', pathwayId: 'fr-pae' },
  { name: 'FFI Clinical Post', category: 'France', description: 'Non-training hospital post', pathwayId: 'fr-ffi' },
  { name: 'MIR Residency', category: 'Spain', description: 'National MIR exam and residency', pathwayId: 'es-mir-residency' },
  { name: 'Specialist Title Recognition', category: 'Spain', description: 'Direct specialist qualification recognition', pathwayId: 'es-specialist-recognition' },
  { name: 'Clinical Career (Non-MIR)', category: 'Spain', description: 'Non-specialist clinical practice', pathwayId: 'es-clinical-career' },
  { name: 'SSM Specialist Training', category: 'Italy', description: 'National SSM exam and specialty training', pathwayId: 'it-ssm-specialist' },
  { name: 'Specialist Title Recognition', category: 'Italy', description: 'Direct specialist qualification recognition', pathwayId: 'it-specialist-recognition' },
  { name: 'Clinical Career (Non-SSM)', category: 'Italy', description: 'Non-specialist clinical employment', pathwayId: 'it-clinical-career' },
  { name: 'Singapore Residency', category: 'Singapore', description: 'Residency training via MOHH' },
  { name: 'Other', category: 'Other', description: 'Custom career pathway' },
];

// Helper function to get career pathways for a specialty
export function getCareerPathsForSpecialty(specialty: string): CareerPath[] {
  return careerPathsBySpecialty[specialty] || defaultCareerPaths;
}

// Helper function to get milestones for selected career pathways - ONLY returns relevant milestones
export function getMilestonesForCareerPaths(careerPaths: string[]): Milestone[] {
  const milestones: Milestone[] = [];
  const addedNames = new Set<string>();

  // Check if any selected path is a custom/unknown path
  const hasCustomPath = careerPaths.some(path => !milestonesByCareerPath[path]);

  // If custom pathways are selected, show ALL milestones from all career pathways
  if (hasCustomPath) {
    Object.values(milestonesByCareerPath).forEach(pathMilestones => {
      pathMilestones.forEach(m => {
        if (!addedNames.has(m.name)) {
          milestones.push(m);
          addedNames.add(m.name);
        }
      });
    });
  } else {
    // Only add path-specific milestones for selected paths
    careerPaths.forEach(path => {
      const pathMilestones = milestonesByCareerPath[path] || [];
      pathMilestones.forEach(m => {
        if (!addedNames.has(m.name)) {
          milestones.push(m);
          addedNames.add(m.name);
        }
      });
    });
  }

  // Add common milestones (language tests, general career items)
  commonMilestones.forEach(m => {
    if (!addedNames.has(m.name)) {
      milestones.push(m);
      addedNames.add(m.name);
    }
  });

  return milestones;
}
