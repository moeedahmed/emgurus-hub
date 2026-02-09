import { PathwayDefinition } from '../pathwayRequirements';

export const indiaPathways: PathwayDefinition[] = [
    {
        id: 'in-dnb-broad',
        name: 'DNB Broad Specialty',
        description: 'Diplomate of National Board (National Board of Examinations)',
        targetRole: 'Consultant / Specialist',
        estimatedDuration: '3 years',
        country: 'India',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['degree_certificate'] },
            { name: 'NMC/State Registration', category: 'Registration', isRequired: true, order: 2, resourceUrl: 'https://www.nmc.org.in/information-desk/for-doctors/', evidenceTypes: ['registration_certificate'] },
            { name: 'NEET PG Exam', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'DNB Training', category: 'Training', isRequired: true, order: 4, description: '3 years residency in NBE accredited hospital', resourceUrl: 'https://natboard.edu.in/dnb-programmes', evidenceTypes: ['training_certificate'] },
            { name: 'Thesis Submission', category: 'Document', isRequired: true, order: 5, resourceUrl: 'https://natboard.edu.in/dnb-programmes', evidenceTypes: ['thesis_approval'] },
            { name: 'FAT Examination', category: 'Exam', isRequired: true, order: 6, description: 'Formative Assessment Test', resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'DNB Final Theory', category: 'Exam', isRequired: true, order: 7, resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'DNB Final Practical', category: 'Exam', isRequired: true, order: 8, resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'DNB Qualification', category: 'Certification', isRequired: true, order: 9, resourceUrl: 'https://natboard.edu.in/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'in-md-ms',
        name: 'MD/MS Pathway',
        description: 'Doctor of Medicine / Master of Surgery (University/NMC recognized)',
        targetRole: 'Specialist',
        estimatedDuration: '3 years',
        country: 'India',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['degree_certificate'] },
            { name: 'NMC/State Registration', category: 'Registration', isRequired: true, order: 2, resourceUrl: 'https://www.nmc.org.in/information-desk/for-doctors/', evidenceTypes: ['registration_certificate'] },
            { name: 'NEET PG Exam', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'Residency Training', category: 'Training', isRequired: true, order: 4, description: '3 years residency', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['training_certificate'] },
            { name: 'Thesis Approval', category: 'Document', isRequired: true, order: 5, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['thesis_approval'] },
            { name: 'University Final Exam', category: 'Exam', isRequired: true, order: 6, description: 'Theory and Practical', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['exam_result'] },
            { name: 'Specialist Degree', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'in-dm-mch',
        name: 'DM/MCh Super Specialty',
        description: 'Doctorate of Medicine / Magister Chirurgiae',
        targetRole: 'Super Specialist / Consultant',
        estimatedDuration: '3 years',
        country: 'India',
        requirements: [
            { name: 'MD/MS/DNB Qualification', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['certificate'] },
            { name: 'NEET SS / INI SS', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://natboard.edu.in/examinations', evidenceTypes: ['exam_result'] },
            { name: 'Super Specialty Residency', category: 'Training', isRequired: true, order: 3, description: '3 years training', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['training_certificate'] },
            { name: 'Final SS Exam', category: 'Exam', isRequired: true, order: 4, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['exam_result'] },
            { name: 'Super Specialist Qualification', category: 'Certification', isRequired: true, order: 5, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'in-medical-officer',
        name: 'Medical Officer (Non-Training)',
        description: 'Non-training clinical career in the Indian healthcare system (Medical Officer, Senior Resident, CMO) under NMC/State Medical Council registration',
        targetRole: 'Senior Medical Officer / CMO',
        estimatedDuration: 'Ongoing',
        country: 'India',
        requirements: [
            { name: 'MBBS Degree', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['degree_certificate'] },
            { name: 'Internship Completion', category: 'Training', isRequired: true, order: 2, description: 'Mandatory rotating internship', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['training_certificate'] },
            { name: 'NMC/State Council Registration', category: 'Registration', isRequired: true, order: 3, description: 'Registration with NMC or State Medical Council', resourceUrl: 'https://www.nmc.org.in/information-desk/for-doctors/', evidenceTypes: ['registration_certificate'] },
            { name: 'Service Post Appointment', category: 'Training', isRequired: true, order: 4, description: 'Medical Officer appointment in government or private hospital', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['appointment_letter'] },
            { name: 'Senior Resident Promotion', category: 'Training', isRequired: false, order: 5, description: 'Promotion to Senior Resident if applicable', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['appointment_letter'] },
            { name: 'Departmental Appraisal', category: 'Document', isRequired: true, order: 6, description: 'Annual performance appraisal', resourceUrl: 'https://www.nmc.org.in/', evidenceTypes: ['appraisal_evidence'] },
        ]
    }
];
