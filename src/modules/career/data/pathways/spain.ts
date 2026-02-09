import { PathwayDefinition } from '../pathwayRequirements';

export const spainPathways: PathwayDefinition[] = [
    {
        id: 'es-mir-residency',
        name: 'MIR Residency',
        description: 'Médico Interno Residente — main specialist training pathway via national MIR exam and residency',
        targetRole: 'Médico Especialista (Specialist)',
        estimatedDuration: '5-8 years (including homologation)',
        country: 'Spain',
        requirements: [
            { name: 'Spanish Language (B2-C1)', category: 'Language', isRequired: true, order: 1, description: 'DELE B2 or C1 certification', resourceUrl: 'https://examenes.cervantes.es/en/dele/what-is-it', evidenceTypes: ['exam_result'] },
            { name: 'Degree Homologation (MEC)', category: 'Document', isRequired: true, order: 2, description: 'Recognition of foreign medical degree by Ministry of Education', resourceUrl: 'https://www.universidades.gob.es/homologacion-de-titulos-extranjeros/', evidenceTypes: ['degree_certificate'] },
            { name: 'Colegiación', category: 'Registration', isRequired: true, order: 3, description: 'Registration with the Colegio Oficial de Médicos', resourceUrl: 'https://www.cgcom.es/', evidenceTypes: ['registration_certificate'] },
            { name: 'MIR Exam', category: 'Exam', isRequired: true, order: 4, description: 'Médico Interno Residente national exam (210 MCQs)', resourceUrl: 'https://www.sanidad.gob.es/areas/formacionEspecializada/home.htm', evidenceTypes: ['exam_result'] },
            { name: 'MIR Ranking and Specialty Selection', category: 'Training', isRequired: true, order: 5, description: 'National ranking and specialty/hospital selection', resourceUrl: 'https://www.sanidad.gob.es/areas/formacionEspecializada/home.htm', evidenceTypes: ['appointment_letter'] },
            { name: 'MIR Residency Training', category: 'Training', isRequired: true, order: 6, description: '4-5 year specialty residency', resourceUrl: 'https://www.sanidad.gob.es/areas/formacionEspecializada/home.htm', evidenceTypes: ['training_certificate'] },
            { name: 'Título de Especialista', category: 'Certification', isRequired: true, order: 7, description: 'Official specialist title from Ministry of Education', resourceUrl: 'https://www.universidades.gob.es/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'es-specialist-recognition',
        name: 'Specialist Title Recognition',
        description: 'Direct recognition of existing specialist qualifications from another country via Ministry of Education',
        targetRole: 'Médico Especialista (Specialist)',
        estimatedDuration: '1-3 years',
        country: 'Spain',
        requirements: [
            { name: 'Spanish Language (B2-C1)', category: 'Language', isRequired: true, order: 1, description: 'DELE B2 or C1 certification', resourceUrl: 'https://examenes.cervantes.es/en/dele/what-is-it', evidenceTypes: ['exam_result'] },
            { name: 'Degree Homologation (MEC)', category: 'Document', isRequired: true, order: 2, description: 'Recognition of foreign medical degree', resourceUrl: 'https://www.universidades.gob.es/homologacion-de-titulos-extranjeros/', evidenceTypes: ['degree_certificate'] },
            { name: 'Specialist Title Equivalence Application', category: 'Document', isRequired: true, order: 3, description: 'Application to MEC for specialist title recognition', resourceUrl: 'https://www.universidades.gob.es/homologacion-de-titulos-extranjeros/', evidenceTypes: ['application'] },
            { name: 'MEC Assessment', category: 'Document', isRequired: true, order: 4, description: 'Ministry assessment of specialist qualification equivalence', resourceUrl: 'https://www.universidades.gob.es/', evidenceTypes: ['assessment_report'] },
            { name: 'Colegiación', category: 'Registration', isRequired: true, order: 5, description: 'Registration with the Colegio Oficial de Médicos', resourceUrl: 'https://www.cgcom.es/', evidenceTypes: ['registration_certificate'] },
            { name: 'Título de Especialista', category: 'Certification', isRequired: true, order: 6, description: 'Official specialist title recognition', resourceUrl: 'https://www.universidades.gob.es/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'es-clinical-career',
        name: 'Clinical Career (Non-MIR)',
        description: 'Non-specialist clinical practice for doctors with homologated degree but without MIR specialist training',
        targetRole: 'Médico / Clinical Doctor',
        estimatedDuration: 'Ongoing',
        country: 'Spain',
        requirements: [
            { name: 'Spanish Language (B2-C1)', category: 'Language', isRequired: true, order: 1, description: 'DELE B2 or C1 certification', resourceUrl: 'https://examenes.cervantes.es/en/dele/what-is-it', evidenceTypes: ['exam_result'] },
            { name: 'Degree Homologation (MEC)', category: 'Document', isRequired: true, order: 2, description: 'Recognition of foreign medical degree', resourceUrl: 'https://www.universidades.gob.es/homologacion-de-titulos-extranjeros/', evidenceTypes: ['degree_certificate'] },
            { name: 'Colegiación', category: 'Registration', isRequired: true, order: 3, description: 'Registration with the Colegio Oficial de Médicos', resourceUrl: 'https://www.cgcom.es/', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Employment', category: 'Training', isRequired: true, order: 4, description: 'Employment as médico in hospital or primary care', resourceUrl: 'https://www.sanidad.gob.es/', evidenceTypes: ['appointment_letter'] },
            { name: 'Continuing Professional Development', category: 'Document', isRequired: true, order: 5, description: 'Ongoing CPD and recertification requirements', resourceUrl: 'https://www.cgcom.es/', evidenceTypes: ['certificate'] },
        ]
    }
];
