import { PathwayDefinition } from '../pathwayRequirements';

export const francePathways: PathwayDefinition[] = [
    {
        id: 'fr-internat-edn',
        name: 'French Internat (EDN/ECOS)',
        description: 'Standard French specialist training via EDN knowledge exam and ECOS clinical exam leading to DES residency',
        targetRole: 'M\u00e9decin Sp\u00e9cialiste (Specialist)',
        estimatedDuration: '4-8 years',
        country: 'France',
        requirements: [
            { name: 'French Language (B2+)', category: 'Language', isRequired: true, order: 1, description: 'DELF B2 or TCF minimum', resourceUrl: 'https://www.france-education-international.fr/en/hub/delf-dalf', evidenceTypes: ['exam_result'] },
            { name: 'Diploma Equivalence', category: 'Document', isRequired: true, order: 2, description: 'Recognition of foreign medical degree by university', resourceUrl: 'https://www.conseil-national.medecin.fr/lordre-medecins/linscription-lordre/medecin-diplome-hors-union-europeenne', evidenceTypes: ['degree_certificate'] },
            { name: 'EDN Exam (Knowledge)', category: 'Exam', isRequired: true, order: 3, description: '\u00c9preuves D\u00e9mat\u00e9rialis\u00e9es Nationales', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['exam_result'] },
            { name: 'ECOS Exam (Clinical)', category: 'Exam', isRequired: true, order: 4, description: 'Examens Cliniques Objectifs Structur\u00e9s', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['exam_result'] },
            { name: 'Specialty Ranking and Allocation', category: 'Training', isRequired: true, order: 5, description: 'National ranking and DES specialty assignment', resourceUrl: 'https://www.cng.sante.fr/', evidenceTypes: ['appointment_letter'] },
            { name: 'DES Residency Training', category: 'Training', isRequired: true, order: 6, description: 'Dipl\u00f4me d\'\u00c9tudes Sp\u00e9cialis\u00e9es, 3-6 years', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['training_certificate'] },
            { name: 'Ordre des M\u00e9decins Registration', category: 'Registration', isRequired: true, order: 7, description: 'Registration with CNOM', resourceUrl: 'https://www.conseil-national.medecin.fr/lordre-medecins/linscription-lordre', evidenceTypes: ['registration_certificate'] },
            { name: 'DES Diploma', category: 'Certification', isRequired: true, order: 8, description: 'Final specialist diploma', resourceUrl: 'https://www.conseil-national.medecin.fr/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'fr-pae',
        name: 'PAE Authorization (Non-EU Doctors)',
        description: 'Proc\u00e9dure d\'Autorisation d\'Exercice for non-EU doctors to practice medicine in France',
        targetRole: 'M\u00e9decin Autoris\u00e9 (Authorized Doctor)',
        estimatedDuration: '3-5 years',
        country: 'France',
        requirements: [
            { name: 'French Language (B2+)', category: 'Language', isRequired: true, order: 1, description: 'DELF B2 or TCF minimum', resourceUrl: 'https://www.france-education-international.fr/en/hub/delf-dalf', evidenceTypes: ['exam_result'] },
            { name: 'Diploma Equivalence', category: 'Document', isRequired: true, order: 2, description: 'Recognition of foreign medical degree', resourceUrl: 'https://www.conseil-national.medecin.fr/lordre-medecins/linscription-lordre/medecin-diplome-hors-union-europeenne', evidenceTypes: ['degree_certificate'] },
            { name: 'EVC Exam', category: 'Exam', isRequired: true, order: 3, description: '\u00c9preuves de V\u00e9rification des Connaissances', resourceUrl: 'https://www.cng.sante.fr/concours-examens/epreuves-de-verification-des-connaissances-evc', evidenceTypes: ['exam_result'] },
            { name: 'Probationary Period', category: 'Training', isRequired: true, order: 4, description: '2-3 years supervised clinical practice in French hospital', resourceUrl: 'https://www.cng.sante.fr/', evidenceTypes: ['training_certificate'] },
            { name: 'CNG Authorization', category: 'Registration', isRequired: true, order: 5, description: 'Final authorization to practice from Centre National de Gestion', resourceUrl: 'https://www.cng.sante.fr/', evidenceTypes: ['registration_certificate'] },
            { name: 'Ordre des M\u00e9decins Registration', category: 'Registration', isRequired: true, order: 6, description: 'Registration with CNOM', resourceUrl: 'https://www.conseil-national.medecin.fr/lordre-medecins/linscription-lordre', evidenceTypes: ['registration_certificate'] },
        ]
    },
    {
        id: 'fr-dfms',
        name: 'DFMS/DFMSA Formation',
        description: 'Dipl\u00f4me de Formation M\u00e9dicale Sp\u00e9cialis\u00e9e for foreign doctors seeking specialist training or advanced skills in France',
        targetRole: 'Specialist Trainee / Fellow',
        estimatedDuration: '1-2 years',
        country: 'France',
        requirements: [
            { name: 'French Language (B2+)', category: 'Language', isRequired: true, order: 1, description: 'DELF B2 or TCF minimum', resourceUrl: 'https://www.france-education-international.fr/en/hub/delf-dalf', evidenceTypes: ['exam_result'] },
            { name: 'University Application', category: 'Document', isRequired: true, order: 2, description: 'Application to French university commission for DFMS/DFMSA', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['application'] },
            { name: 'DFMS/DFMSA Selection', category: 'Training', isRequired: true, order: 3, description: 'Competitive selection via university commission', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['appointment_letter'] },
            { name: 'Clinical Training Period', category: 'Training', isRequired: true, order: 4, description: '1-2 years supervised specialist formation', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['training_certificate'] },
            { name: 'DFMS/DFMSA Certificate', category: 'Certification', isRequired: true, order: 5, description: 'Certificate of completion', resourceUrl: 'https://www.education.gouv.fr/les-etudes-de-sante-11800', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'fr-ffi',
        name: 'FFI Clinical Post (Non-Training)',
        description: 'Faisant Fonction d\'Interne acting-intern hospital post for non-training clinical employment',
        targetRole: 'FFI / Clinical Doctor',
        estimatedDuration: 'Ongoing',
        country: 'France',
        requirements: [
            { name: 'French Language (B2+)', category: 'Language', isRequired: true, order: 1, description: 'DELF B2 or TCF minimum', resourceUrl: 'https://www.france-education-international.fr/en/hub/delf-dalf', evidenceTypes: ['exam_result'] },
            { name: 'Diploma Verification', category: 'Document', isRequired: true, order: 2, description: 'Verification of foreign medical degree', resourceUrl: 'https://www.conseil-national.medecin.fr/lordre-medecins/linscription-lordre/medecin-diplome-hors-union-europeenne', evidenceTypes: ['degree_certificate'] },
            { name: 'Hospital Appointment (FFI)', category: 'Training', isRequired: true, order: 3, description: 'Faisant Fonction d\'Interne hospital post appointment', resourceUrl: 'https://www.cng.sante.fr/', evidenceTypes: ['appointment_letter'] },
            { name: 'Clinical Service', category: 'Training', isRequired: true, order: 4, description: 'Ongoing clinical employment in hospital', resourceUrl: 'https://www.cng.sante.fr/', evidenceTypes: ['employment_letter'] },
            { name: 'Continuing Medical Education', category: 'Document', isRequired: true, order: 5, description: 'DPC (D\u00e9veloppement Professionnel Continu) requirements', resourceUrl: 'https://www.agencedpc.fr/', evidenceTypes: ['certificate'] },
        ]
    }
];
