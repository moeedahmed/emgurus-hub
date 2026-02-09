import { PathwayDefinition } from '../pathwayRequirements';

export const irelandPathways: PathwayDefinition[] = [
    {
        id: 'ie-rcpi-hst',
        name: 'RCPI HST',
        description: 'Royal College of Physicians of Ireland Higher Specialty Training',
        targetRole: 'Consultant Physician',
        estimatedDuration: '4-6 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC General Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'BST Completion', category: 'Training', isRequired: true, order: 2, description: 'Basic Specialty Training completion', resourceUrl: 'https://www.rcpi.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'MRCPI Examination', category: 'Exam', isRequired: true, order: 3, description: 'Membership of Royal College of Physicians Ireland', resourceUrl: 'https://www.rcpi.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'HST Selection', category: 'Training', isRequired: true, order: 4, description: 'Selection into national training scheme', resourceUrl: 'https://www.rcpi.ie/training/higher-specialist-training/', evidenceTypes: ['appointment_letter'] },
            { name: 'HST Training Years', category: 'Training', isRequired: true, order: 5, description: '4-6 years of higher specialty training', resourceUrl: 'https://www.rcpi.ie/training/higher-specialist-training/', evidenceTypes: ['training_certificate'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 6, description: 'Certificate of Satisfactory Completion of Specialist Training', resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-rcsi-hst',
        name: 'RCSI HST',
        description: 'Royal College of Surgeons in Ireland Higher Surgical Training',
        targetRole: 'Consultant Surgeon',
        estimatedDuration: '6-8 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC General Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'MRCS Part A & B', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://www.rcsi.com/surgery/exams', evidenceTypes: ['exam_result'] },
            { name: 'Core Surgical Training', category: 'Training', isRequired: true, order: 3, description: 'CST years', resourceUrl: 'https://www.rcsi.com/surgery/training', evidenceTypes: ['training_certificate'] },
            { name: 'HST Selection', category: 'Training', isRequired: true, order: 4, description: 'Selection into higher surgical training', resourceUrl: 'https://www.rcsi.com/surgery/training', evidenceTypes: ['appointment_letter'] },
            { name: 'FRCSI Exit Exam', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.rcsi.com/surgery/exams', evidenceTypes: ['exam_result'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-icgp-training',
        name: 'ICGP Training',
        description: 'Irish College of General Practitioners GP Training Scheme',
        targetRole: 'General Practitioner',
        estimatedDuration: '4 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'GP Scheme Selection', category: 'Training', isRequired: true, order: 2, resourceUrl: 'https://www.icgp.ie/go/become_a_gp/training', evidenceTypes: ['appointment_letter'] },
            { name: 'Hospital Training Years', category: 'Training', isRequired: true, order: 3, description: '2 years hospital rotations', resourceUrl: 'https://www.icgp.ie/go/become_a_gp/training', evidenceTypes: ['training_certificate'] },
            { name: 'GP Placement Years', category: 'Training', isRequired: true, order: 4, description: '2 years GP practice placements', resourceUrl: 'https://www.icgp.ie/go/become_a_gp/training', evidenceTypes: ['training_certificate'] },
            { name: 'MICGP Exam', category: 'Exam', isRequired: true, order: 5, description: 'Membership exams (Written & CCT)', resourceUrl: 'https://www.icgp.ie/go/become_a_gp/micgp_exam', evidenceTypes: ['exam_result'] },
            { name: 'Fellowship Award', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.icgp.ie/go/become_a_gp/training', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-nchd-pathway',
        name: 'NCHD Career Pathway',
        description: 'Non-Consultant Hospital Doctor career progression (SHO, Registrar, Senior Registrar)',
        targetRole: 'Senior NCHD / Registrar',
        estimatedDuration: 'Ongoing',
        country: 'Ireland',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['degree_certificate'] },
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 2, description: 'Irish Medical Council registration', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'Intern Year', category: 'Training', isRequired: true, order: 3, description: 'Mandatory internship', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['training_certificate'] },
            { name: 'SHO Appointment', category: 'Training', isRequired: true, order: 4, description: 'Senior House Officer post', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['appointment_letter'] },
            { name: 'Registrar Appointment', category: 'Training', isRequired: true, order: 5, description: 'Registrar-level service post', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['appointment_letter'] },
            { name: 'Senior Registrar', category: 'Training', isRequired: false, order: 6, description: 'Optional progression to Senior Registrar', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['appointment_letter'] },
            { name: 'Annual Competence Assurance', category: 'Document', isRequired: true, order: 7, description: 'IMC Professional Competence Scheme', resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['appraisal_evidence'] },
        ]
    },
    {
        id: 'ie-cai-training',
        name: 'CAI Anaesthesia Training',
        description: 'College of Anaesthesiologists of Ireland Specialist Anaesthesia Training',
        targetRole: 'Consultant Anaesthetist',
        estimatedDuration: '6-7 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'College Selection', category: 'Training', isRequired: true, order: 2, description: 'SAT entry (Specialist Anaesthesia Training)', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['appointment_letter'] },
            { name: 'MCAI Examination', category: 'Exam', isRequired: true, order: 3, description: 'Membership of College of Anaesthesiologists', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'SAT Years 1-3', category: 'Training', isRequired: true, order: 4, description: 'Specialist Anaesthesia Training years 1-3', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'FCAI Primary', category: 'Exam', isRequired: true, order: 5, description: 'Fellowship primary examination', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'SAT Years 4-5', category: 'Training', isRequired: true, order: 6, description: 'Advanced training years', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'FCAI Final', category: 'Exam', isRequired: true, order: 7, description: 'Fellowship final examination', resourceUrl: 'https://www.anaesthesia.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 8, resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-cpsych-training',
        name: 'College of Psychiatrists Training',
        description: 'College of Psychiatrists of Ireland specialist training pathway',
        targetRole: 'Consultant Psychiatrist',
        estimatedDuration: '7 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'BST Selection', category: 'Training', isRequired: true, order: 2, description: 'Basic Specialist Training in Psychiatry', resourceUrl: 'https://www.irishpsychiatry.ie/training/', evidenceTypes: ['appointment_letter'] },
            { name: 'MRCPsych Examinations', category: 'Exam', isRequired: true, order: 3, description: 'Membership examinations (Papers A, B, CASC)', resourceUrl: 'https://www.irishpsychiatry.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'HST Selection', category: 'Training', isRequired: true, order: 4, description: 'Higher Specialty Training entry', resourceUrl: 'https://www.irishpsychiatry.ie/training/', evidenceTypes: ['appointment_letter'] },
            { name: 'HST Training Years', category: 'Training', isRequired: true, order: 5, description: '3-4 years higher specialty training', resourceUrl: 'https://www.irishpsychiatry.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-iaem-training',
        name: 'IAEM Emergency Medicine Training',
        description: 'Irish Association for Emergency Medicine specialist training',
        targetRole: 'Consultant in Emergency Medicine',
        estimatedDuration: '6 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'BST / Core EM Training', category: 'Training', isRequired: true, order: 2, description: '2 years core emergency medicine training', resourceUrl: 'https://www.iaem.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'MCEM Examination', category: 'Exam', isRequired: true, order: 3, description: 'Membership in College of Emergency Medicine', resourceUrl: 'https://www.iaem.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'HST Selection', category: 'Training', isRequired: true, order: 4, description: 'Selection into EM Higher Specialty Training', resourceUrl: 'https://www.iaem.ie/training/', evidenceTypes: ['appointment_letter'] },
            { name: 'HST Training Years', category: 'Training', isRequired: true, order: 5, description: '4 years of higher specialty training', resourceUrl: 'https://www.iaem.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'FCEM Exit Exam', category: 'Exam', isRequired: true, order: 6, description: 'Fellowship exit examination', resourceUrl: 'https://www.iaem.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ie-rcpi-paediatrics',
        name: 'RCPI Paediatrics Training',
        description: 'Royal College of Physicians of Ireland Paediatrics specialty training',
        targetRole: 'Consultant Paediatrician',
        estimatedDuration: '7 years',
        country: 'Ireland',
        requirements: [
            { name: 'IMC Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.medicalcouncil.ie/registration/', evidenceTypes: ['registration_certificate'] },
            { name: 'BST in Paediatrics', category: 'Training', isRequired: true, order: 2, description: 'Basic Specialist Training in Paediatrics', resourceUrl: 'https://www.rcpi.ie/training/', evidenceTypes: ['training_certificate'] },
            { name: 'MRCPI Paediatrics', category: 'Exam', isRequired: true, order: 3, description: 'Membership examination in Paediatrics', resourceUrl: 'https://www.rcpi.ie/training/', evidenceTypes: ['exam_result'] },
            { name: 'HST Selection', category: 'Training', isRequired: true, order: 4, description: 'Higher Specialty Training entry', resourceUrl: 'https://www.rcpi.ie/training/higher-specialist-training/', evidenceTypes: ['appointment_letter'] },
            { name: 'HST Training Years', category: 'Training', isRequired: true, order: 5, description: 'Higher specialty training in Paediatrics', resourceUrl: 'https://www.rcpi.ie/training/higher-specialist-training/', evidenceTypes: ['training_certificate'] },
            { name: 'CSCST', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.medicalcouncil.ie/registration/cscst/', evidenceTypes: ['certificate'] },
        ]
    }
];
