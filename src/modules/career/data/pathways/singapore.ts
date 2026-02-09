import { PathwayDefinition } from '../pathwayRequirements';

export const singaporePathways: PathwayDefinition[] = [
    {
        id: 'sg-residency',
        name: 'Singapore Residency',
        description: 'Singapore MOHH residency training pathway',
        targetRole: 'Specialist / Consultant',
        estimatedDuration: '5-7 years',
        country: 'Singapore',
        requirements: [
            { name: 'Medical Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['degree_certificate'] },
            { name: 'SMC Provisional Registration', category: 'Registration', isRequired: true, order: 2, description: 'Singapore Medical Council provisional registration', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['registration_certificate'] },
            { name: 'Residency Application', category: 'Training', isRequired: true, order: 3, description: 'Apply via MOHH residency system', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['application'] },
            { name: 'Residency Match', category: 'Training', isRequired: true, order: 4, description: 'Matched to residency program', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['appointment_letter'] },
            { name: 'Residency Training', category: 'Training', isRequired: true, order: 5, description: '3-6 years depending on specialty', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['training_certificate'] },
            { name: 'Exit Examination', category: 'Exam', isRequired: true, order: 6, description: 'College/Board exit exams', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['exam_result'] },
            { name: 'SMC Full Registration', category: 'Registration', isRequired: true, order: 7, description: 'Full registration with SMC', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['registration_certificate'] },
            { name: 'Specialist Accreditation', category: 'Certification', isRequired: true, order: 8, description: 'SAB (Specialist Accreditation Board) listing', resourceUrl: 'https://www.healthprofessionals.gov.sg/sab/specialist-accreditation', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'sg-conditional-registration',
        name: 'Conditional Registration (IMG)',
        description: 'Conditional registration pathway for International Medical Graduates in Singapore',
        targetRole: 'Registered Medical Practitioner',
        estimatedDuration: '1-4 years',
        country: 'Singapore',
        requirements: [
            { name: 'Medical Degree Verification', category: 'Registration', isRequired: true, order: 1, description: 'Primary source verification of qualifications', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['degree_certificate'] },
            { name: 'SMC Application', category: 'Registration', isRequired: true, order: 2, description: 'Application to Singapore Medical Council', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc/conditional-registration', evidenceTypes: ['application'] },
            { name: 'Conditional Registration', category: 'Registration', isRequired: true, order: 3, description: 'Practice under supervision in approved institution', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc/conditional-registration', evidenceTypes: ['registration_certificate'] },
            { name: 'Supervised Practice', category: 'Training', isRequired: true, order: 4, description: '2-4 years supervised clinical practice', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc/conditional-registration', evidenceTypes: ['training_certificate'] },
            { name: 'SMC Full Registration', category: 'Registration', isRequired: true, order: 5, description: 'Full registration upon satisfactory completion', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['registration_certificate'] },
        ]
    },
    {
        id: 'sg-specialist-portfolio',
        name: 'Specialist Accreditation (Portfolio)',
        description: 'Specialist registration via portfolio assessment for experienced doctors',
        targetRole: 'Specialist (SAB Accredited)',
        estimatedDuration: 'Variable',
        country: 'Singapore',
        requirements: [
            { name: 'SMC Full Registration', category: 'Registration', isRequired: true, order: 1, description: 'Full registration with Singapore Medical Council', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['registration_certificate'] },
            { name: 'Specialist Application', category: 'Document', isRequired: true, order: 2, description: 'SAB portfolio submission with evidence of training and experience', resourceUrl: 'https://www.healthprofessionals.gov.sg/sab/specialist-accreditation', evidenceTypes: ['portfolio'] },
            { name: 'College Assessment', category: 'Document', isRequired: true, order: 3, description: 'Relevant specialty college review', resourceUrl: 'https://www.healthprofessionals.gov.sg/sab/specialist-accreditation', evidenceTypes: ['assessment_report'] },
            { name: 'Supervised Upskilling', category: 'Training', isRequired: false, order: 4, description: 'If required by assessing college', resourceUrl: 'https://www.healthprofessionals.gov.sg/sab/specialist-accreditation', evidenceTypes: ['training_certificate'] },
            { name: 'Specialist Accreditation', category: 'Certification', isRequired: true, order: 5, description: 'SAB specialist register listing', resourceUrl: 'https://www.healthprofessionals.gov.sg/sab/specialist-accreditation', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'sg-clinical-service',
        name: 'Clinical Service (Non-Training)',
        description: 'Non-training clinical career in Singapore healthcare system',
        targetRole: 'Senior Medical Officer / Staff Physician',
        estimatedDuration: 'Ongoing',
        country: 'Singapore',
        requirements: [
            { name: 'Medical Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['degree_certificate'] },
            { name: 'SMC Registration', category: 'Registration', isRequired: true, order: 2, description: 'Full or conditional registration', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['registration_certificate'] },
            { name: 'Hospital Appointment', category: 'Training', isRequired: true, order: 3, description: 'Medical Officer / Registrar role', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['appointment_letter'] },
            { name: 'Senior Medical Officer', category: 'Training', isRequired: false, order: 4, description: 'Career progression to senior roles', resourceUrl: 'https://www.physician.mohh.com.sg/', evidenceTypes: ['appointment_letter'] },
            { name: 'Privileging & Credentialing', category: 'Document', isRequired: true, order: 5, description: 'Annual review and credentialing', resourceUrl: 'https://www.smc.gov.sg/becoming-a-doctor/registering-with-smc', evidenceTypes: ['appraisal_evidence'] },
        ]
    },
];
