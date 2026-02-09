// Exams organized by specialty for goal wizard target exam dropdown
// Comprehensive exam list by country/region

export interface ExamOption {
  name: string;
  category: string;
  description?: string;
}

export const examsBySpecialty: Record<string, ExamOption[]> = {
  'Emergency Medicine': [
    // UK
    { name: 'MRCEM Primary', category: 'UK', description: 'First stage of MRCEM' },
    { name: 'MRCEM SBA', category: 'UK', description: 'Single Best Answer exam' },
    { name: 'MRCEM OSCE', category: 'UK', description: 'Clinical skills exam' },
    { name: 'FRCEM', category: 'UK', description: 'Fellowship exam' },
    { name: 'FRCEM SBA', category: 'UK', description: 'Fellowship SBA examination' },
    { name: 'FRCEM OSCE', category: 'UK', description: 'Fellowship clinical examination' },
    { name: 'MSRA', category: 'UK', description: 'Multi-Specialty Recruitment Assessment' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'USMLE Step 3', category: 'USA', description: 'Clinical practice exam' },
    { name: 'ABEM Written', category: 'USA', description: 'Board certification written' },
    { name: 'ABEM Oral', category: 'USA', description: 'Board certification oral' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'ACEM Primary', category: 'Australia', description: 'Primary examination' },
    { name: 'ACEM Fellowship', category: 'Australia', description: 'Fellowship examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    { name: 'MCCQE Part 2', category: 'Canada', description: 'Medical Council of Canada QE Part 2' },
    // Ireland
    { name: 'MCEM Part A', category: 'Ireland', description: 'Irish MCEM Part A' },
    { name: 'MCEM Part B', category: 'Ireland', description: 'Irish MCEM Part B' },
    { name: 'MCEM Part C', category: 'Ireland', description: 'Irish MCEM Part C' },
    { name: 'FCEM', category: 'Ireland', description: 'Fellowship Irish College of EM' },
    // Europe
    { name: 'European Board Exam (EBEEM)', category: 'Europe', description: 'European Board Exam in Emergency Medicine' },
    // Pakistan
    { name: 'FCPS Part 1 EM', category: 'Pakistan', description: 'Part 1 Emergency Medicine' },
    { name: 'FCPS Part 2 EM', category: 'Pakistan', description: 'Part 2 Emergency Medicine' },
    // India
    { name: 'DNB EM Theory', category: 'India', description: 'Theory examination' },
    { name: 'DNB EM Practical', category: 'India', description: 'Practical examination' },
    // Gulf
    { name: 'Gulf Board EM Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board EM Part 2', category: 'Gulf', description: 'GCC Part 2' },
    { name: 'DHA Exam', category: 'Gulf', description: 'Dubai Health Authority licensing' },
    { name: 'HAAD Exam', category: 'Gulf', description: 'Health Authority Abu Dhabi licensing' },
    { name: 'QCHP Exam', category: 'Gulf', description: 'Qatar Council licensing' },
  ],
  'Internal Medicine': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Multiple choice questions' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Written examination' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    { name: 'MRCP (Specialty Cert)', category: 'UK', description: 'Specialty Certificate Examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'USMLE Step 3', category: 'USA', description: 'Clinical practice exam' },
    { name: 'ABIM Certification', category: 'USA', description: 'Board certification' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACP Written', category: 'Australia', description: 'Written examination' },
    { name: 'RACP Clinical', category: 'Australia', description: 'Clinical examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    { name: 'MCCQE Part 2', category: 'Canada', description: 'Medical Council of Canada QE Part 2' },
    // Ireland
    { name: 'MRCPI Part 1', category: 'Ireland', description: 'RCPI Part 1' },
    { name: 'MRCPI Part 2', category: 'Ireland', description: 'RCPI Part 2' },
    // Pakistan
    { name: 'FCPS Part 1 Medicine', category: 'Pakistan', description: 'Part 1 Medicine' },
    { name: 'FCPS Part 2 Medicine', category: 'Pakistan', description: 'Part 2 Medicine' },
    // Gulf
    { name: 'Gulf Board IM Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board IM Part 2', category: 'Gulf', description: 'GCC Part 2' },
    { name: 'DHA Exam', category: 'Gulf', description: 'Dubai Health Authority licensing' },
    { name: 'HAAD Exam', category: 'Gulf', description: 'Health Authority Abu Dhabi licensing' },
  ],
  'Surgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS', category: 'UK', description: 'Fellowship examination' },
    { name: 'FRCS Specialty', category: 'UK', description: 'Intercollegiate specialty examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'USMLE Step 3', category: 'USA', description: 'Clinical practice exam' },
    { name: 'ABS Qualifying Exam', category: 'USA', description: 'Written qualifying exam' },
    { name: 'ABS Certifying Exam', category: 'USA', description: 'Oral certifying exam' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACS Surgical Sciences', category: 'Australia', description: 'Generic surgical sciences' },
    { name: 'RACS Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACS Fellowship Exam', category: 'Australia', description: 'Fellowship examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Ireland
    { name: 'MRCSI Part A', category: 'Ireland', description: 'RCSI Part A' },
    { name: 'MRCSI Part B', category: 'Ireland', description: 'RCSI Part B' },
    { name: 'FRCSI', category: 'Ireland', description: 'Fellowship RCSI' },
    { name: 'FRCSI Exit Exam', category: 'Ireland', description: 'RCSI fellowship exit examination' },
    // Pakistan
    { name: 'FCPS Part 1 Surgery', category: 'Pakistan', description: 'Part 1 Surgery' },
    { name: 'FCPS Part 2 Surgery', category: 'Pakistan', description: 'Part 2 Surgery' },
    // Gulf
    { name: 'Gulf Board Surgery Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board Surgery Part 2', category: 'Gulf', description: 'GCC Part 2' },
    { name: 'DHA Exam', category: 'Gulf', description: 'Dubai Health Authority licensing' },
  ],
  'Pediatrics': [
    // UK
    { name: 'MRCPCH Part 1', category: 'UK', description: 'Foundation of Practice' },
    { name: 'MRCPCH Part 2', category: 'UK', description: 'Theory and Science' },
    { name: 'MRCPCH Clinical', category: 'UK', description: 'Clinical examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABP Initial Certification', category: 'USA', description: 'Board certification' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACP Paediatrics Written', category: 'Australia', description: 'Written examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 Paediatrics', category: 'Pakistan', description: 'Part 1 Paediatrics' },
    { name: 'FCPS Part 2 Paediatrics', category: 'Pakistan', description: 'Part 2 Paediatrics' },
    // Gulf
    { name: 'Gulf Board Paeds Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board Paeds Part 2', category: 'Gulf', description: 'GCC Part 2' },
  ],
  'Psychiatry': [
    // UK
    { name: 'MRCPsych Paper A', category: 'UK', description: 'Written Paper A' },
    { name: 'MRCPsych Paper B', category: 'UK', description: 'Written Paper B' },
    { name: 'MRCPsych CASC', category: 'UK', description: 'Clinical Assessment of Skills and Competencies' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABPN Psychiatry', category: 'USA', description: 'Board certification' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RANZCP Written', category: 'Australia', description: 'Written examination' },
    { name: 'RANZCP OSCE', category: 'Australia', description: 'Clinical examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 Psychiatry', category: 'Pakistan', description: 'Part 1 Psychiatry' },
    { name: 'FCPS Part 2 Psychiatry', category: 'Pakistan', description: 'Part 2 Psychiatry' },
    // Gulf
    { name: 'Gulf Board Psych Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board Psych Part 2', category: 'Gulf', description: 'GCC Part 2' },
  ],
  'Family Medicine': [
    // UK
    { name: 'MRCGP AKT', category: 'UK', description: 'Applied Knowledge Test (Part 1)' },
    { name: 'MRCGP RCA', category: 'UK', description: 'Recorded Consultation Assessment (RCA/SCA)' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABFM Certification', category: 'USA', description: 'Board certification' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACGP AKT', category: 'Australia', description: 'Applied Knowledge Test' },
    { name: 'RACGP KFP', category: 'Australia', description: 'Key Feature Problem' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    { name: 'CFPC Certification', category: 'Canada', description: 'College of Family Physicians' },
    // Ireland
    { name: 'MICGP Exam', category: 'Ireland', description: 'Irish College of GPs' },
    // Pakistan
    { name: 'FCPS Part 1 FM', category: 'Pakistan', description: 'Part 1 Family Medicine' },
    { name: 'FCPS Part 2 FM', category: 'Pakistan', description: 'Part 2 Family Medicine' },
  ],
  'Anesthesiology': [
    // UK
    { name: 'FRCA Primary', category: 'UK', description: 'Primary examination' },
    { name: 'FRCA Final', category: 'UK', description: 'Final examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABA Basic Exam', category: 'USA', description: 'Basic examination' },
    { name: 'ABA Advanced Exam', category: 'USA', description: 'Advanced examination' },
    { name: 'ABA Applied Exam', category: 'USA', description: 'Applied examination' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'ANZCA Primary', category: 'Australia', description: 'Primary examination' },
    { name: 'ANZCA Final', category: 'Australia', description: 'Final examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 Anaesthesia', category: 'Pakistan', description: 'Part 1 Anaesthesia' },
    { name: 'FCPS Part 2 Anaesthesia', category: 'Pakistan', description: 'Part 2 Anaesthesia' },
    // Gulf
    { name: 'Gulf Board Anaes Part 1', category: 'Gulf', description: 'GCC Part 1' },
    { name: 'Gulf Board Anaes Part 2', category: 'Gulf', description: 'GCC Part 2' },
  ],
  'Radiology': [
    // UK
    { name: 'FRCR Part 1', category: 'UK', description: 'Anatomy and physics' },
    { name: 'FRCR Part 1 (Onc)', category: 'UK', description: 'Clinical oncology Part 1' },
    { name: 'FRCR Part 2A', category: 'UK', description: 'Written examination' },
    { name: 'FRCR Part 2B', category: 'UK', description: 'Reporting examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABR Core Exam', category: 'USA', description: 'Core examination' },
    { name: 'ABR Certifying Exam', category: 'USA', description: 'Certifying examination' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RANZCR Part 1', category: 'Australia', description: 'Part 1 examination' },
    { name: 'RANZCR Part 2', category: 'Australia', description: 'Part 2 examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 Radiology', category: 'Pakistan', description: 'Part 1 Radiology' },
    { name: 'FCPS Part 2 Radiology', category: 'Pakistan', description: 'Part 2 Radiology' },
  ],
  'Obstetrics & Gynecology': [
    // UK
    { name: 'MRCOG Part 1', category: 'UK', description: 'Basic sciences' },
    { name: 'MRCOG Part 2', category: 'UK', description: 'Written examination' },
    { name: 'MRCOG Part 3', category: 'UK', description: 'Clinical examination' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABOG Written', category: 'USA', description: 'Written examination' },
    { name: 'ABOG Oral', category: 'USA', description: 'Oral examination' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RANZCOG Written', category: 'Australia', description: 'Written examination' },
    { name: 'RANZCOG Oral', category: 'Australia', description: 'Oral examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 O&G', category: 'Pakistan', description: 'Part 1 O&G' },
    { name: 'FCPS Part 2 O&G', category: 'Pakistan', description: 'Part 2 O&G' },
  ],
  'Orthopedic Surgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS T&O', category: 'UK', description: 'Trauma & Orthopaedics specialty' },
    { name: 'FRCS Trauma & Ortho CCT', category: 'UK', description: 'CCT-level trauma & orthopaedics exam' },
    { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
    { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
    // USA
    { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
    { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
    { name: 'ABOS Part I', category: 'USA', description: 'Written examination' },
    { name: 'ABOS Part II', category: 'USA', description: 'Oral examination' },
    // Australia
    { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
    { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
    { name: 'RACS Surgical Sciences', category: 'Australia', description: 'Generic surgical sciences' },
    { name: 'AOA Fellowship Exam', category: 'Australia', description: 'Fellowship examination' },
    // Canada
    { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
    { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
    // Pakistan
    { name: 'FCPS Part 1 Ortho', category: 'Pakistan', description: 'Part 1 Orthopaedics' },
    { name: 'FCPS Part 2 Ortho', category: 'Pakistan', description: 'Part 2 Orthopaedics' },
  ],
  'Critical Care / ICU': [
    // UK
    { name: 'FICM Primary', category: 'UK', description: 'Faculty of Intensive Care Medicine Primary' },
    { name: 'FICM Final', category: 'UK', description: 'Faculty of Intensive Care Medicine Final' },
    // Europe
    { name: 'EDIC Part I', category: 'Europe', description: 'European Diploma in Intensive Care Part I' },
    { name: 'EDIC Part II', category: 'Europe', description: 'European Diploma in Intensive Care Part II' },
    // USA
    { name: 'Critical Care Board Exam', category: 'USA', description: 'Board exam in Critical Care Medicine' },
    // Australia
    { name: 'CICM First Part', category: 'Australia', description: 'College of Intensive Care Medicine Part 1' },
    { name: 'CICM Second Part', category: 'Australia', description: 'College of Intensive Care Medicine Part 2' },
  ],
  'Cardiology': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Membership Part 1' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Membership Part 2' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    // Europe
    { name: 'EECC (European Exam)', category: 'Europe', description: 'European Exam in Core Cardiology' },
  ],
  'Gastroenterology': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Membership Part 1' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Membership Part 2' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    // Europe
    { name: 'ESEGH (European Exam)', category: 'Europe', description: 'European Exam in Gastroenterology & Hepatology' },
  ],
  'Pulmonology': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Membership Part 1' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Membership Part 2' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    // Europe
    { name: 'HERMES (European Exam)', category: 'Europe', description: 'European Respiratory HERMES exam' },
    // USA
    { name: 'Pulmonary Board Exam', category: 'USA', description: 'ABIM Pulmonary Disease board exam' },
  ],
  'Neurology': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Membership Part 1' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Membership Part 2' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    // USA
    { name: 'RITE Exam', category: 'USA', description: 'Resident In-Service Training Examination' },
  ],
  'Oncology': [
    // UK
    { name: 'MRCP Part 1', category: 'UK', description: 'Membership Part 1' },
    { name: 'MRCP Part 2', category: 'UK', description: 'Membership Part 2' },
    { name: 'MRCP PACES', category: 'UK', description: 'Clinical skills exam' },
    { name: 'FRCR Part 1 (Onc)', category: 'UK', description: 'Clinical oncology Part 1' },
    { name: 'FRCR Part 2 (Onc)', category: 'UK', description: 'Clinical oncology Part 2' },
    // Europe
    { name: 'ESMO Exam', category: 'Europe', description: 'European Society for Medical Oncology exam' },
  ],
  'Dermatology': [
    // UK
    { name: 'MRCP (Specialty Cert)', category: 'UK', description: 'Specialty Certificate Examination' },
    // USA
    { name: 'ABD CORE Exam', category: 'USA', description: 'American Board of Dermatology Core' },
    { name: 'ABD APPLIED Exam', category: 'USA', description: 'American Board of Dermatology Applied' },
  ],
  'Ophthalmology': [
    // UK
    { name: 'FRCOphth Part 1', category: 'UK', description: 'Royal College of Ophthalmologists Part 1' },
    { name: 'FRCOphth Part 2', category: 'UK', description: 'Royal College of Ophthalmologists Part 2' },
    // USA
    { name: 'OKAP Exam', category: 'USA', description: 'Ophthalmic Knowledge Assessment Program' },
    { name: 'ABO Written Exam', category: 'USA', description: 'American Board of Ophthalmology Written' },
    { name: 'ABO Oral Exam', category: 'USA', description: 'American Board of Ophthalmology Oral' },
    // Australia
    { name: 'RANZCO Examinations', category: 'Australia', description: 'Royal Australian and NZ College of Ophthalmologists' },
    // Pakistan
    { name: 'FCOphth', category: 'Pakistan', description: 'Fellowship in Ophthalmology' },
  ],
  'ENT (Otolaryngology)': [
    // UK
    { name: 'DOHNS', category: 'UK', description: 'Diploma in Otolaryngology Head & Neck Surgery' },
    { name: 'FRCS (ORL-HNS)', category: 'UK', description: 'Fellowship in Otolaryngology' },
    // USA
    { name: 'ABXZ Qualifying Exam', category: 'USA', description: 'American Board of Otolaryngology Qualifying' },
    { name: 'ABXZ Certifying Exam', category: 'USA', description: 'American Board of Otolaryngology Certifying' },
  ],
  'Pathology': [
    // UK
    { name: 'FRCPath Part 1', category: 'UK', description: 'Royal College of Pathologists Part 1' },
    { name: 'FRCPath Part 2', category: 'UK', description: 'Royal College of Pathologists Part 2' },
    // Australia
    { name: 'RCPA Examinations', category: 'Australia', description: 'Royal College of Pathologists of Australasia' },
  ],
  'Public Health': [
    // UK
    { name: 'DFPH', category: 'UK', description: 'Diplomate of Faculty of Public Health' },
    { name: 'MFPH Final', category: 'UK', description: 'Membership of Faculty of Public Health Final' },
    // Australia
    { name: 'AFPHM Assessments', category: 'Australia', description: 'Australasian Faculty of Public Health Medicine' },
  ],
  'Rehabilitation Medicine / PM&R': [
    // USA
    { name: 'ABPMR Part 1', category: 'USA', description: 'American Board of PM&R Part 1' },
    // Australia
    { name: 'AFRM Examinations', category: 'Australia', description: 'Australasian Faculty of Rehabilitation Medicine' },
  ],
  'Sports Medicine': [
    // UK
    { name: 'MFSEM Part 1', category: 'UK', description: 'Membership of the Faculty of Sports & Exercise Medicine Part 1' },
    { name: 'MFSEM Part 2', category: 'UK', description: 'Membership of the Faculty of Sports & Exercise Medicine Part 2' },
    { name: 'DipSM', category: 'UK', description: 'Diploma in Sports Medicine' },
    // Australia
    { name: 'ACSEP Examinations', category: 'Australia', description: 'Australasian College of Sport & Exercise Physicians' },
  ],
  'Palliative Medicine': [
    // UK
    { name: 'SCE Palliative', category: 'UK', description: 'Specialty Certificate Exam in Palliative Medicine' },
    // Australia
    { name: 'FAChPM Assessment', category: 'Australia', description: 'Australasian Chapter of Palliative Medicine assessment' },
  ],
  'Geriatric Medicine': [
    // UK
    { name: 'SCE Geriatrics', category: 'UK', description: 'Specialty Certificate Exam in Geriatric Medicine' },
  ],
  'Endocrinology': [
    // Europe
    { name: 'ESE-Endo', category: 'Europe', description: 'European Exam in Endocrinology' },
  ],
  'Rheumatology': [
    // Europe
    { name: 'ESE-Rheum', category: 'Europe', description: 'European Exam in Rheumatology' },
  ],
  'Hematology': [
    // UK
    { name: 'FRCPath Part 1', category: 'UK', description: 'Royal College of Pathologists Part 1' },
    { name: 'FRCPath Part 2', category: 'UK', description: 'Royal College of Pathologists Part 2' },
  ],
  'Nephrology': [
    // Europe
    { name: 'ESENeph', category: 'Europe', description: 'European Exam in Nephrology' },
  ],
  'Neurosurgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS (Neuro)', category: 'UK', description: 'Intercollegiate Specialty Examination in Neurosurgery' },
    // USA
    { name: 'ABNS Primary Exam', category: 'USA', description: 'American Board of Neurological Surgery Primary' },
    { name: 'ABNS Oral Exam', category: 'USA', description: 'American Board of Neurological Surgery Oral' },
  ],
  'Plastic Surgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS (Plast)', category: 'UK', description: 'Intercollegiate Specialty Examination in Plastic Surgery' },
    // USA
    { name: 'ABPS Written Exam', category: 'USA', description: 'American Board of Plastic Surgery Written' },
    { name: 'ABPS Oral Exam', category: 'USA', description: 'American Board of Plastic Surgery Oral' },
  ],
  'Cardiothoracic Surgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS (C-Th)', category: 'UK', description: 'Intercollegiate Specialty Examination in Cardiothoracic Surgery' },
  ],
  'Urology': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS (Urol)', category: 'UK', description: 'Intercollegiate Specialty Examination in Urology' },
  ],
  'Vascular Surgery': [
    // UK
    { name: 'MRCS Part A', category: 'UK', description: 'Written examination' },
    { name: 'MRCS Part B', category: 'UK', description: 'OSCE examination' },
    { name: 'FRCS (Vasc)', category: 'UK', description: 'Intercollegiate Specialty Examination in Vascular Surgery' },
  ],
  'Global Licensing': [
    // Gulf / Middle East
    { name: 'Arab Board Part 1', category: 'Gulf', description: 'Arab Board Part 1' },
    { name: 'Arab Board Part 2 (Final)', category: 'Gulf', description: 'Arab Board final examination' },
    { name: 'SMLE Exam', category: 'Saudi Arabia', description: 'Saudi Medical Licensing Exam' },
    { name: 'Saudi Board Part 1', category: 'Saudi Arabia', description: 'Saudi Board Part 1' },
    { name: 'Saudi Board Final Exam', category: 'Saudi Arabia', description: 'Saudi Board final examination' },
    // Germany
    { name: 'KP (Kenntnispruefung)', category: 'Germany', description: 'German knowledge exam for licensure' },
    { name: 'Facharztpruefung', category: 'Germany', description: 'German specialist examination' },
    // India
    { name: 'NEET PG Exam', category: 'India', description: 'Postgraduate entrance exam' },
    { name: 'NEET SS / INI SS', category: 'India', description: 'Super-specialty entrance exam' },
    { name: 'DNB Final Theory', category: 'India', description: 'DNB final theory exam' },
    { name: 'DNB Final Practical', category: 'India', description: 'DNB final practical exam' },
    // Pakistan
    { name: 'FCPS Part 1', category: 'Pakistan', description: 'Fellowship Part 1' },
    { name: 'FCPS Part 2 Theory', category: 'Pakistan', description: 'Fellowship Part 2 theory' },
    { name: 'FCPS Part 2 Clinical (TOACS)', category: 'Pakistan', description: 'Fellowship Part 2 clinical' },
    // Canada
    { name: 'RCPSC Written Exam', category: 'Canada', description: 'Royal College written exam' },
    { name: 'RCPSC Applied Exam', category: 'Canada', description: 'Royal College applied/oral exam' },
  ],
};

// Common exams applicable to all specialties
export const commonExams: ExamOption[] = [
  // UK Entry
  { name: 'PLAB 1', category: 'UK', description: 'Professional and Linguistic Assessment Part 1' },
  { name: 'PLAB 2', category: 'UK', description: 'Clinical skills assessment' },
  // USA Entry
  { name: 'USMLE Step 1', category: 'USA', description: 'Basic science exam' },
  { name: 'USMLE Step 2 CK', category: 'USA', description: 'Clinical knowledge exam' },
  { name: 'USMLE Step 3', category: 'USA', description: 'Clinical practice exam' },
  // Australia Entry
  { name: 'AMC CAT MCQ', category: 'Australia', description: 'Computer adaptive test' },
  { name: 'AMC Clinical', category: 'Australia', description: 'Clinical examination' },
  // Canada Entry
  { name: 'NAC OSCE', category: 'Canada', description: 'National Assessment Collaboration OSCE' },
  { name: 'MCCQE Part 1', category: 'Canada', description: 'Medical Council of Canada QE Part 1' },
  { name: 'MCCQE Part 2', category: 'Canada', description: 'Medical Council of Canada QE Part 2' },
  // Gulf Entry
  { name: 'DHA Exam', category: 'Gulf', description: 'Dubai Health Authority licensing exam' },
  { name: 'HAAD Exam', category: 'Gulf', description: 'Health Authority Abu Dhabi licensing' },
  { name: 'MOH Exam', category: 'Gulf', description: 'Saudi Ministry of Health licensing' },
  { name: 'QCHP Exam', category: 'Gulf', description: 'Qatar Council licensing' },
  // Language
  { name: 'OET', category: 'Language', description: 'Occupational English Test' },
  { name: 'IELTS Academic', category: 'Language', description: 'International English Language Testing System' },
  { name: 'TOEFL iBT', category: 'Language', description: 'Test of English as a Foreign Language' },
];

const specialtyAliases: Record<string, string> = {
  'Surgery (General)': 'Surgery',
  'Orthopedics': 'Orthopedic Surgery',
};

// Helper function to get exams for a specialty
export function getExamsForSpecialty(specialty: string): ExamOption[] {
  const resolvedSpecialty = specialtyAliases[specialty] || specialty;
  const specialtyExams = examsBySpecialty[resolvedSpecialty] || [];

  // Combine specialty-specific exams with common exams, avoiding duplicates
  const allExams = [...specialtyExams];
  const existingNames = new Set(specialtyExams.map(e => e.name));

  commonExams.forEach(exam => {
    if (!existingNames.has(exam.name)) {
      allExams.push(exam);
    }
  });

  return allExams;
}

// Helper function to get all exams across all specialties
export function getAllExams(): ExamOption[] {
  const allExamsMap = new Map<string, ExamOption>();

  // Add all specialty-specific exams
  Object.values(examsBySpecialty).forEach(specialtyExams => {
    specialtyExams.forEach(exam => {
      if (!allExamsMap.has(exam.name)) {
        allExamsMap.set(exam.name, exam);
      }
    });
  });

  // Add all common exams
  commonExams.forEach(exam => {
    if (!allExamsMap.has(exam.name)) {
      allExamsMap.set(exam.name, exam);
    }
  });

  return Array.from(allExamsMap.values());
}

// Helper function to group exams by category
export function groupExamsByCategory(exams: ExamOption[]): Record<string, ExamOption[]> {
  return exams.reduce((acc, exam) => {
    const category = exam.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(exam);
    return acc;
  }, {} as Record<string, ExamOption[]>);
}
