import { PathwayDefinition } from '../pathwayRequirements';

export const italyPathways: PathwayDefinition[] = [
    {
        id: 'it-ssm-specialist',
        name: 'SSM Specialist Training',
        description: 'Scuola di Specializzazione in Medicina — Italian specialist training via national SSM exam and university-based training',
        targetRole: 'Medico Specialista (Specialist)',
        estimatedDuration: '5-7 years',
        country: 'Italy',
        requirements: [
            { name: 'Italian Language (C1 CLIQ)', category: 'Language', isRequired: true, order: 1, description: 'C1 level Italian via CLIQ certification (CELI, CILS, or PLIDA)', resourceUrl: 'https://www.istruzione.it/', evidenceTypes: ['exam_result'] },
            { name: 'Degree Recognition (Ministry of Health)', category: 'Document', isRequired: true, order: 2, description: 'Ministerial decree recognizing foreign medical degree', resourceUrl: 'https://www.salute.gov.it/portale/professioniSanitarie/homeProfessioniSanitarie.jsp', evidenceTypes: ['degree_certificate'] },
            { name: 'Ordine dei Medici Registration', category: 'Registration', isRequired: true, order: 3, description: 'Registration with provincial medical council', resourceUrl: 'https://portale.fnomceo.it/', evidenceTypes: ['registration_certificate'] },
            { name: 'SSM National Exam', category: 'Exam', isRequired: true, order: 4, description: 'Concorso Nazionale di Specializzazione national specialist entry exam', resourceUrl: 'https://www.mur.gov.it/it', evidenceTypes: ['exam_result'] },
            { name: 'SSM Ranking and Allocation', category: 'Training', isRequired: true, order: 5, description: 'National ranking and specialty/university allocation', resourceUrl: 'https://www.mur.gov.it/it', evidenceTypes: ['appointment_letter'] },
            { name: 'SSM Specialty Training', category: 'Training', isRequired: true, order: 6, description: '4-5 years of specialist training (Scuola di Specializzazione)', resourceUrl: 'https://www.mur.gov.it/it', evidenceTypes: ['training_certificate'] },
            { name: 'Diploma di Specializzazione', category: 'Certification', isRequired: true, order: 7, description: 'Final specialist qualification', resourceUrl: 'https://www.mur.gov.it/it', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'it-gp-training',
        name: 'GP Training (Corso di Formazione)',
        description: 'Corso di Formazione Specifica in Medicina Generale — 3-year general practice training program',
        targetRole: 'Medico di Medicina Generale (GP)',
        estimatedDuration: '4-5 years',
        country: 'Italy',
        requirements: [
            { name: 'Italian Language (C1 CLIQ)', category: 'Language', isRequired: true, order: 1, description: 'C1 level Italian certification', resourceUrl: 'https://www.istruzione.it/', evidenceTypes: ['exam_result'] },
            { name: 'Degree Recognition', category: 'Document', isRequired: true, order: 2, description: 'Ministerial decree recognizing foreign medical degree', resourceUrl: 'https://www.salute.gov.it/portale/professioniSanitarie/homeProfessioniSanitarie.jsp', evidenceTypes: ['degree_certificate'] },
            { name: 'Ordine dei Medici Registration', category: 'Registration', isRequired: true, order: 3, description: 'Registration with provincial medical council', resourceUrl: 'https://portale.fnomceo.it/', evidenceTypes: ['registration_certificate'] },
            { name: 'GP Course Entry Exam', category: 'Exam', isRequired: true, order: 4, description: 'Regional competitive exam for corso di formazione', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['exam_result'] },
            { name: 'Corso di Formazione (3 Years)', category: 'Training', isRequired: true, order: 5, description: '3-year GP-specific training with clinical placements', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['training_certificate'] },
            { name: 'GP Qualification (Attestato)', category: 'Certification', isRequired: true, order: 6, description: 'Attestato di Formazione Specifica in Medicina Generale', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'it-specialist-recognition',
        name: 'Specialist Title Recognition',
        description: 'Direct recognition of existing specialist qualifications from another country via Ministry of Health decree',
        targetRole: 'Medico Specialista (Specialist)',
        estimatedDuration: '6-18 months',
        country: 'Italy',
        requirements: [
            { name: 'Italian Language (C1 CLIQ)', category: 'Language', isRequired: true, order: 1, description: 'C1 level Italian certification', resourceUrl: 'https://www.istruzione.it/', evidenceTypes: ['exam_result'] },
            { name: 'Degree Recognition', category: 'Document', isRequired: true, order: 2, description: 'Ministerial decree recognizing foreign medical degree', resourceUrl: 'https://www.salute.gov.it/portale/professioniSanitarie/homeProfessioniSanitarie.jsp', evidenceTypes: ['degree_certificate'] },
            { name: 'Specialist Recognition Application', category: 'Document', isRequired: true, order: 3, description: 'Application to Ministry of Health for specialist title recognition', resourceUrl: 'https://www.salute.gov.it/portale/professioniSanitarie/homeProfessioniSanitarie.jsp', evidenceTypes: ['application'] },
            { name: 'Ministry Assessment', category: 'Document', isRequired: true, order: 4, description: 'Assessment of specialist qualification equivalence', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['assessment_report'] },
            { name: 'Ordine dei Medici Registration', category: 'Registration', isRequired: true, order: 5, description: 'Registration with provincial medical council', resourceUrl: 'https://portale.fnomceo.it/', evidenceTypes: ['registration_certificate'] },
            { name: 'Specialist Title Decree', category: 'Certification', isRequired: true, order: 6, description: 'Ministerial decree granting specialist recognition', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'it-clinical-career',
        name: 'Clinical Career (Non-SSM)',
        description: 'Non-specialist clinical employment with Ordine registration but without specialist training',
        targetRole: 'Medico / Clinical Doctor',
        estimatedDuration: 'Ongoing',
        country: 'Italy',
        requirements: [
            { name: 'Italian Language (C1 CLIQ)', category: 'Language', isRequired: true, order: 1, description: 'C1 level Italian certification', resourceUrl: 'https://www.istruzione.it/', evidenceTypes: ['exam_result'] },
            { name: 'Degree Recognition', category: 'Document', isRequired: true, order: 2, description: 'Ministerial decree recognizing foreign medical degree', resourceUrl: 'https://www.salute.gov.it/portale/professioniSanitarie/homeProfessioniSanitarie.jsp', evidenceTypes: ['degree_certificate'] },
            { name: 'Ordine dei Medici Registration', category: 'Registration', isRequired: true, order: 3, description: 'Registration with provincial medical council', resourceUrl: 'https://portale.fnomceo.it/', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Employment', category: 'Training', isRequired: true, order: 4, description: 'Employment in hospital or ambulatory setting', resourceUrl: 'https://www.salute.gov.it/', evidenceTypes: ['appointment_letter'] },
            { name: 'ECM Credits', category: 'Document', isRequired: true, order: 5, description: 'Educazione Continua in Medicina — mandatory continuing education', resourceUrl: 'https://ape.agenas.it/', evidenceTypes: ['certificate'] },
        ]
    }
];
