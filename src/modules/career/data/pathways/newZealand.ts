import { PathwayDefinition } from '../pathwayRequirements';

export const newZealandPathways: PathwayDefinition[] = [
    {
        id: 'nz-mcnz-registration',
        name: 'MCNZ Registration Pathway',
        description: 'Medical Council of New Zealand registration pathway for International Medical Graduates via NZREX Clinical or equivalent examination',
        targetRole: 'Registered Medical Practitioner',
        estimatedDuration: '1-3 years',
        country: 'New Zealand',
        requirements: [
            { name: 'Medical Degree Verification', category: 'Document', isRequired: true, order: 1, description: 'Primary medical qualification listed in World Directory of Medical Schools (WDOMS)', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/' },
            { name: 'Qualifying Examination', category: 'Exam', isRequired: true, order: 2, description: 'NZREX Clinical (OSCE format, 12 assessed stations) or accepted equivalent (PLAB Part 1+2, AMC MCQ+Clinical)', evidenceTypes: ['exam_result'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-exam-nzrex/', alternatives: ['AMC MCQ + Clinical', 'PLAB Part 1 + Part 2'] },
            { name: 'Provisional Registration', category: 'Registration', isRequired: true, order: 3, description: 'Provisional general registration with MCNZ', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-pathways/general-scope/nzrex-clinical-graduates/' },
            { name: 'Prevocational Training (PGY1)', category: 'Training', isRequired: true, order: 4, description: 'Minimum 12 months supervised prevocational training at an accredited provider', evidenceTypes: ['training_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-pathways/general-scope/nzrex-clinical-graduates/' },
            { name: 'General Registration', category: 'Registration', isRequired: true, order: 5, description: 'General scope registration with MCNZ after completion of prevocational training', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-pathways/' },
        ]
    },
    {
        id: 'nz-service-post',
        name: 'Non-Training Clinical Career — New Zealand',
        description: 'Non-training clinical career for doctors working in New Zealand hospitals or general practice',
        targetRole: 'Senior Medical Officer / Staff Specialist',
        estimatedDuration: 'Ongoing',
        country: 'New Zealand',
        requirements: [
            { name: 'Medical Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/' },
            { name: 'MCNZ Registration', category: 'Registration', isRequired: true, order: 2, description: 'Registration with Medical Council of New Zealand', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-pathways/' },
            { name: 'Clinical Appointment', category: 'Training', isRequired: true, order: 3, description: 'Appointment to a clinical position in a District Health Board or private practice', evidenceTypes: ['appointment_letter'] },
            { name: 'Vocational Registration', category: 'Registration', isRequired: false, order: 4, description: 'Vocational registration in a specialist scope (if applicable)', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.mcnz.org.nz/registration/getting-registered/registration-pathways/' },
            { name: 'Continuing Professional Development', category: 'Document', isRequired: true, order: 5, description: 'Ongoing CPD as required by MCNZ for recertification', evidenceTypes: ['appraisal_evidence'], resourceUrl: 'https://www.mcnz.org.nz/registration/maintain-or-renew-your-registration/recertification/' },
        ]
    },
];
