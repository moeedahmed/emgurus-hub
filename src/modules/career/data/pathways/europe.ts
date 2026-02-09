import { PathwayDefinition } from '../pathwayRequirements';

export const europePathways: PathwayDefinition[] = [
    {
        id: 'eusem-training',
        name: 'EuSEM Training',
        description: 'European Society for Emergency Medicine aligned pathway (ETR/Curriculum)',
        targetRole: 'Emergency Medicine Specialist (Europe)',
        estimatedDuration: '5 years (typical)',
        country: 'Europe',
        requirements: [
            { name: 'National Medical Registration', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.uems.eu/areas-of-expertise/specialist-training', evidenceTypes: ['registration_certificate'] },
            { name: 'Emergency Medicine Training Entry', category: 'Training', isRequired: true, order: 2, resourceUrl: 'https://eusem.org/education-training/', evidenceTypes: ['appointment_letter'] },
            { name: 'EuSEM ETR / Curriculum Alignment', category: 'Document', isRequired: true, order: 3, description: 'Training aligned to EuSEM European Training Requirements (ETR)', resourceUrl: 'https://eusem.org/education-training/european-curriculum', evidenceTypes: ['portfolio'] },
            { name: 'Workplace Assessments & Logbook', category: 'Document', isRequired: true, order: 4, description: 'Competency tracking and local assessments', resourceUrl: 'https://eusem.org/education-training/', evidenceTypes: ['assessment_report'] },
            { name: 'Core EM Courses (ALS/ATLS/POCUS)', category: 'Certification', isRequired: false, order: 5, resourceUrl: 'https://eusem.org/education-training/', evidenceTypes: ['course_certificate'] },
            { name: 'National EM Training Completion', category: 'Training', isRequired: true, order: 6, resourceUrl: 'https://eusem.org/education-training/', evidenceTypes: ['training_certificate'] },
            { name: 'European Board Exam (EBEEM)', category: 'Exam', isRequired: false, order: 7, resourceUrl: 'https://eusem.org/education-training/', evidenceTypes: ['exam_result'] },
            { name: 'Specialist Recognition / Registration', category: 'Certification', isRequired: true, order: 8, resourceUrl: 'https://www.uems.eu/areas-of-expertise/specialist-training', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'edic-pathway',
        name: 'EDIC Pathway',
        description: 'European Diploma in Intensive Care (EDIC) pathway',
        targetRole: 'Intensive Care Specialist (EDIC)',
        estimatedDuration: '2-4 years',
        country: 'Europe',
        requirements: [
            { name: 'ICU Training / Experience', category: 'Training', isRequired: true, order: 1, resourceUrl: 'https://www.esicm.org/education/edic/', evidenceTypes: ['training_certificate'] },
            { name: 'EDIC Part I', category: 'Exam', isRequired: true, order: 2, description: 'Multiple-choice written examination', resourceUrl: 'https://www.esicm.org/education/edic/edic-part-i/', evidenceTypes: ['exam_result'] },
            { name: 'EDIC Part II', category: 'Exam', isRequired: true, order: 3, description: 'Oral/clinical examination', resourceUrl: 'https://www.esicm.org/education/edic/edic-part-ii/', evidenceTypes: ['exam_result'] },
            { name: 'EDIC Award', category: 'Certification', isRequired: true, order: 4, resourceUrl: 'https://www.esicm.org/education/edic/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'eu-specialist-recognition',
        name: 'EU Specialist Recognition',
        description: 'Mutual recognition of specialist qualifications under EU Directive 2005/36/EC',
        targetRole: 'Specialist Registration (EU Member State)',
        estimatedDuration: '3-12 months',
        country: 'Europe',
        requirements: [
            { name: 'EU/EEA Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from EU/EEA member state', resourceUrl: 'https://single-market-economy.ec.europa.eu/single-market/services/free-movement-professionals/recognition-professional-qualifications-practice/automatic-recognition_en', evidenceTypes: ['degree_certificate'] },
            { name: 'Language Requirement', category: 'Language', isRequired: true, order: 2, description: 'Host country language proficiency', resourceUrl: 'https://www.uems.eu/areas-of-expertise/specialist-training', evidenceTypes: ['exam_result'] },
            { name: 'Competent Authority Application', category: 'Document', isRequired: true, order: 3, description: 'Application to host country competent authority', resourceUrl: 'https://single-market-economy.ec.europa.eu/single-market/services/free-movement-professionals/recognition-professional-qualifications-practice/automatic-recognition_en', evidenceTypes: ['application'] },
            { name: 'Qualification Assessment', category: 'Document', isRequired: true, order: 4, description: 'Assessment under EU Directive 2005/36/EC', resourceUrl: 'https://single-market-economy.ec.europa.eu/single-market/services/free-movement-professionals/recognition-professional-qualifications-practice/automatic-recognition_en', evidenceTypes: ['assessment_report'] },
            { name: 'Specialist Recognition', category: 'Registration', isRequired: true, order: 5, description: 'Entry on host country specialist register', resourceUrl: 'https://www.uems.eu/areas-of-expertise/specialist-training', evidenceTypes: ['registration_certificate'] },
        ]
    },
];
