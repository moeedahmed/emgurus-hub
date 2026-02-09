import { PathwayDefinition } from '../pathwayRequirements';

export const usaPathways: PathwayDefinition[] = [
    {
        id: 'abem-residency',
        name: 'ABEM Residency',
        description: 'American Board of Emergency Medicine accredited residency',
        targetRole: 'Emergency Physician (Attending)',
        estimatedDuration: '3-4 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABEM Oral Cert Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.abem.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABEM Certification', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.abem.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'abim-residency',
        name: 'ABIM Residency',
        description: 'American Board of Internal Medicine accredited residency',
        targetRole: 'General Internist / Hospitalist',
        estimatedDuration: '3 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABIM Board Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['exam_result'] },
            { name: 'ABIM Certification', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'abs-residency',
        name: 'ABS Residency',
        description: 'American Board of Surgery accredited residency',
        targetRole: 'General Surgeon',
        estimatedDuration: '5 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABS Qualifying Exam', category: 'Exam', isRequired: true, order: 6, description: 'Written exam', resourceUrl: 'https://www.absurgery.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABS Certifying Exam', category: 'Exam', isRequired: true, order: 7, description: 'Oral exam', resourceUrl: 'https://www.absurgery.org/', evidenceTypes: ['exam_result'] },
            { name: 'General Surgery Board Cert', category: 'Certification', isRequired: true, order: 8, resourceUrl: 'https://www.absurgery.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ecfmg-pathway',
        name: 'ECFMG Pathway',
        description: 'ECFMG certification pathway for International Medical Graduates',
        targetRole: 'US Residency Candidate',
        estimatedDuration: '1-2 years',
        country: 'United States',
        requirements: [
            { name: 'OET Medicine', category: 'Language', isRequired: true, order: 1, description: 'English language proficiency', resourceUrl: 'https://www.occupationalenglishtest.org/', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'Credentials Verification', category: 'Registration', isRequired: true, order: 4, description: 'Diploma verification via EPIC', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['verification_report'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 5, resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'pulm-ccm-fellowship',
        name: 'Pulm/CCM Fellowship',
        description: 'Combined Pulmonary and Critical Care Medicine Fellowship',
        targetRole: 'Pulmonary & Critical Care Attending',
        estimatedDuration: '3 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'IM Board Certification', category: 'Certification', isRequired: true, order: 2, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Fellowship Match', category: 'Training', isRequired: true, order: 3, resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'Pulmonary Board Exam', category: 'Exam', isRequired: true, order: 4, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['exam_result'] },
            { name: 'Critical Care Board Exam', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['exam_result'] },
        ]
    },
    {
        id: 'ccm-fellowship',
        name: 'Critical Care Fellowship',
        description: 'Standalone Critical Care Medicine Fellowship',
        targetRole: 'Critical Care Attending',
        estimatedDuration: '1-2 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'Primary Board Cert', category: 'Certification', isRequired: true, order: 2, description: 'Board certified in primary specialty', resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
            { name: 'Fellowship Match', category: 'Training', isRequired: true, order: 3, resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'Critical Care Board Exam', category: 'Exam', isRequired: true, order: 4, resourceUrl: 'https://www.abim.org/certification/', evidenceTypes: ['exam_result'] },
        ]
    },
    {
        id: 'abp-residency',
        name: 'ABP Residency',
        description: 'American Board of Pediatrics accredited residency',
        targetRole: 'General Pediatrician',
        estimatedDuration: '3 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABP General Pediatrics Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.abp.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABP Certification', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.abp.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'abpn-residency',
        name: 'ABPN Residency',
        description: 'American Board of Psychiatry and Neurology accredited residency',
        targetRole: 'Psychiatrist',
        estimatedDuration: '4 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABPN Certification Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.abpn.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABPN Certification', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.abpn.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'abfm-residency',
        name: 'ABFM Residency',
        description: 'American Board of Family Medicine accredited residency',
        targetRole: 'Family Physician',
        estimatedDuration: '3 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABFM Certification Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.theabfm.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABFM Certification', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.theabfm.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'aba-residency',
        name: 'ABA Residency',
        description: 'American Board of Anesthesiology accredited residency',
        targetRole: 'Anesthesiologist',
        estimatedDuration: '4 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABA Basic Exam', category: 'Exam', isRequired: true, order: 6, resourceUrl: 'https://www.theaba.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABA Advanced Exam', category: 'Exam', isRequired: true, order: 7, resourceUrl: 'https://www.theaba.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABA Applied Exam', category: 'Exam', isRequired: true, order: 8, resourceUrl: 'https://www.theaba.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABA Certification', category: 'Certification', isRequired: true, order: 9, resourceUrl: 'https://www.theaba.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'abog-residency',
        name: 'ABOG Residency',
        description: 'American Board of Obstetrics and Gynecology accredited residency',
        targetRole: 'Obstetrician & Gynecologist',
        estimatedDuration: '4 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'ABOG Qualifying Exam', category: 'Exam', isRequired: true, order: 6, description: 'Written exam', resourceUrl: 'https://www.abog.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABOG Certifying Exam', category: 'Exam', isRequired: true, order: 7, description: 'Oral exam', resourceUrl: 'https://www.abog.org/', evidenceTypes: ['exam_result'] },
            { name: 'ABOG Certification', category: 'Certification', isRequired: true, order: 8, resourceUrl: 'https://www.abog.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'us-residency',
        name: 'US Residency (Generic)',
        description: 'Generic ACGME-accredited residency pathway',
        targetRole: 'Resident Physician',
        estimatedDuration: '3-7 years',
        country: 'United States',
        requirements: [
            { name: 'USMLE Step 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://www.usmle.org/step-exams/step-1', evidenceTypes: ['exam_result'] },
            { name: 'USMLE Step 2 CK', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.usmle.org/step-exams/step-2-ck', evidenceTypes: ['exam_result'] },
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 3, description: 'Required for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched via NRMP', resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'USMLE Step 3', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.usmle.org/step-exams/step-3', evidenceTypes: ['exam_result'] },
            { name: 'Residency Completion', category: 'Training', isRequired: true, order: 6, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
            { name: 'Primary Board Exam', category: 'Exam', isRequired: true, order: 7, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['exam_result'] },
            { name: 'Board Certification', category: 'Certification', isRequired: true, order: 8, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'us-fellowship',
        name: 'US Fellowship (Generic)',
        description: 'Generic ACGME-accredited fellowship pathway',
        targetRole: 'Subspecialist Physician',
        estimatedDuration: '1-3 years',
        country: 'United States',
        requirements: [
            { name: 'Primary Residency Completion', category: 'Training', isRequired: true, order: 1, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
            { name: 'Primary Board Certification', category: 'Certification', isRequired: true, order: 2, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
            { name: 'Fellowship Match', category: 'Training', isRequired: true, order: 3, resourceUrl: 'https://www.nrmp.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'Fellowship Training', category: 'Training', isRequired: true, order: 4, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
            { name: 'Subspecialty Board Exam', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['exam_result'] },
            { name: 'Subspecialty Certification', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'us-img-clinical',
        name: 'IMG Clinical Career (Non-Residency)',
        description: 'IMG pre-residency or non-training clinical pathway (Hospitalist, Research, Clinical Associate)',
        targetRole: 'Clinical Practice / Residency Preparation',
        estimatedDuration: '1-3 years',
        country: 'United States',
        requirements: [
            { name: 'ECFMG Certification', category: 'Certification', isRequired: true, order: 1, description: 'ECFMG certification for IMGs', resourceUrl: 'https://www.ecfmg.org/certification/', evidenceTypes: ['certificate'] },
            { name: 'State Medical License', category: 'Registration', isRequired: true, order: 2, description: 'State-level medical licensure', resourceUrl: 'https://www.fsmb.org/', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Position', category: 'Training', isRequired: true, order: 3, description: 'Hospitalist, clinical associate, or research position', resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'Hospital Privileges', category: 'Document', isRequired: true, order: 4, description: 'Credentialing and hospital privileges', resourceUrl: 'https://www.fsmb.org/', evidenceTypes: ['appointment_letter'] },
            { name: 'Board Eligibility Assessment', category: 'Document', isRequired: false, order: 5, description: 'Board eligibility evaluation if applicable', resourceUrl: 'https://www.acgme.org/', evidenceTypes: ['assessment_report'] },
        ]
    }
];
