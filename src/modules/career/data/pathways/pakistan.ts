import { PathwayDefinition } from '../pathwayRequirements';

export const pakistanPathways: PathwayDefinition[] = [
    {
        id: 'pk-fcps-residency',
        name: 'FCPS Residency',
        description: 'College of Physicians and Surgeons Pakistan (CPSP) Fellowship — full journey from MBBS to Fellowship',
        targetRole: 'Consultant / Specialist',
        estimatedDuration: '4-5 years (post House Job)',
        country: 'Pakistan',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification from a PMC-recognised institution', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'House Job', category: 'Training', isRequired: true, order: 2, description: '1-year mandatory rotating internship', evidenceTypes: ['training_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'PMDC Registration', category: 'Registration', isRequired: true, order: 3, description: 'Full registration with Pakistan Medical & Dental Council after completion of House Job', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'FCPS Part 1', category: 'Exam', isRequired: true, order: 4, description: 'Basic sciences exam conducted by CPSP', evidenceTypes: ['exam_result'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
            { name: 'RTMC Registration', category: 'Registration', isRequired: true, order: 5, description: 'Training registration with CPSP via Regional Training Monitoring Committee', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.cpsp.edu.pk/' },
            { name: 'FCPS Residency Induction', category: 'Training', isRequired: true, order: 6, description: 'Matching into CPSP-accredited training institution', evidenceTypes: ['appointment_letter'], resourceUrl: 'https://www.cpsp.edu.pk/' },
            { name: 'IMM Examination', category: 'Exam', isRequired: true, order: 7, description: 'Intermediate Module examination', evidenceTypes: ['exam_result'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
            { name: 'Mandatory Workshops', category: 'Training', isRequired: true, order: 8, description: 'BLS, ACLS, Research Methodology, IT', evidenceTypes: ['certificate'], resourceUrl: 'https://www.cpsp.edu.pk/' },
            { name: 'Thesis / Research Paper', category: 'Document', isRequired: true, order: 9, evidenceTypes: ['thesis_approval'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
            { name: 'FCPS Part 2 Theory', category: 'Exam', isRequired: true, order: 10, evidenceTypes: ['exam_result'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
            { name: 'FCPS Part 2 Clinical (TOACS)', category: 'Exam', isRequired: true, order: 11, evidenceTypes: ['exam_result'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
            { name: 'Fellowship Award', category: 'Certification', isRequired: true, order: 12, evidenceTypes: ['certificate'], resourceUrl: 'https://www.cpsp.edu.pk/fcps.php' },
        ]
    },
    {
        id: 'pk-mcps-diploma',
        name: 'MCPS Diploma',
        description: 'Member of College of Physicians and Surgeons — shorter postgraduate diploma route',
        targetRole: 'General Practitioner / Medical Officer with Diploma',
        estimatedDuration: '2 years',
        country: 'Pakistan',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification from a PMC-recognised institution', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'PMC Registration', category: 'Registration', isRequired: true, order: 2, description: 'Full registration with Pakistan Medical Commission', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'MCPS Training', category: 'Training', isRequired: true, order: 3, description: '2-year supervised training in CPSP-accredited hospital', evidenceTypes: ['training_certificate'], resourceUrl: 'https://www.cpsp.edu.pk/mcps.php' },
            { name: 'MCPS Examination', category: 'Exam', isRequired: true, order: 4, description: 'Written and Clinical examination', evidenceTypes: ['exam_result'], resourceUrl: 'https://www.cpsp.edu.pk/mcps.php' },
            { name: 'MCPS Diploma', category: 'Certification', isRequired: true, order: 5, evidenceTypes: ['certificate'], resourceUrl: 'https://www.cpsp.edu.pk/mcps.php' },
        ]
    },
    {
        id: 'pk-medical-officer',
        name: 'Medical Officer (Non-Training)',
        description: 'Non-training clinical career in public or private sector (BPS grades)',
        targetRole: 'Senior Medical Officer / Consultant (BPS)',
        estimatedDuration: 'Ongoing',
        country: 'Pakistan',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification from a PMC-recognised institution', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'House Job Completion', category: 'Training', isRequired: true, order: 2, description: '1-year mandatory rotating internship', evidenceTypes: ['training_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'PMC Full Registration', category: 'Registration', isRequired: true, order: 3, description: 'Full registration with Pakistan Medical Commission', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.pmc.gov.pk/' },
            { name: 'Medical Officer Appointment', category: 'Training', isRequired: true, order: 4, description: 'BPS-17/18 government or private sector appointment', evidenceTypes: ['appointment_letter'] },
            { name: 'Postgraduate Diploma', category: 'Exam', isRequired: false, order: 5, description: 'Optional (MCPS, Diploma courses)', evidenceTypes: ['certificate'], resourceUrl: 'https://www.cpsp.edu.pk/mcps.php' },
            { name: 'Senior Medical Officer', category: 'Training', isRequired: false, order: 6, description: 'BPS-18/19 promotion', evidenceTypes: ['appointment_letter'] },
            { name: 'Annual Performance Review', category: 'Document', isRequired: true, order: 7, description: 'Annual appraisal and ACR', evidenceTypes: ['appraisal_evidence'] },
        ]
    }
];
