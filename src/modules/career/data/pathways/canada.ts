import { PathwayDefinition } from '../pathwayRequirements';

export const canadaPathways: PathwayDefinition[] = [
    {
        id: 'ca-rcpsc-residency',
        name: 'RCPSC Residency',
        description: 'Royal College of Physicians and Surgeons of Canada accredited residency',
        targetRole: 'Specialist Physician / Surgeon',
        estimatedDuration: '5 years',
        country: 'Canada',
        requirements: [
            { name: 'MCCQE Part 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://mcc.ca/examinations/mccqe-part-i/', evidenceTypes: ['exam_result'] },
            { name: 'Language Proficiency (IELTS/OET)', category: 'Language', isRequired: true, order: 2, resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['exam_result'] },
            { name: 'CaRMS Match', category: 'Training', isRequired: true, order: 3, description: 'Matched via Canadian Resident Matching Service', resourceUrl: 'https://www.carms.ca/', evidenceTypes: ['appointment_letter'] },
            { name: 'Residency Training', category: 'Training', isRequired: true, order: 4, description: '4-5 years of specialty training', resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['training_certificate'] },
            { name: 'RCPSC Written Exam', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['exam_result'] },
            { name: 'RCPSC Applied Exam', category: 'Exam', isRequired: true, order: 6, description: 'OSCE or Oral exam', resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['exam_result'] },
            { name: 'FRCPC/FRCSC Fellowship', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ca-ccfp-residency',
        name: 'CCFP Certification',
        description: 'College of Family Physicians of Canada (CFPC) accredited residency',
        targetRole: 'Family Physician',
        estimatedDuration: '2 years',
        country: 'Canada',
        requirements: [
            { name: 'MCCQE Part 1', category: 'Exam', isRequired: true, order: 1, resourceUrl: 'https://mcc.ca/examinations/mccqe-part-i/', evidenceTypes: ['exam_result'] },
            { name: 'CaRMS Match', category: 'Training', isRequired: true, order: 2, description: 'Matched to Family Medicine residency', resourceUrl: 'https://www.carms.ca/', evidenceTypes: ['appointment_letter'] },
            { name: 'FM Residency', category: 'Training', isRequired: true, order: 3, description: '2 years of training', resourceUrl: 'https://www.cfpc.ca/en/education-professional-development/examinations', evidenceTypes: ['training_certificate'] },
            { name: 'SAMPs Exam', category: 'Exam', isRequired: true, order: 4, description: 'Short Answer Management Problems', resourceUrl: 'https://www.cfpc.ca/en/education-professional-development/examinations', evidenceTypes: ['exam_result'] },
            { name: 'SOO Exam', category: 'Exam', isRequired: true, order: 5, description: 'Simulated Office Orals', resourceUrl: 'https://www.cfpc.ca/en/education-professional-development/examinations', evidenceTypes: ['exam_result'] },
            { name: 'CCFP Certification', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.cfpc.ca/en/education-professional-development/examinations', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ca-clinical-associate',
        name: 'Clinical Associate / Hospitalist',
        description: 'Non-training clinical career in Canadian healthcare (Hospitalist, Clinical Associate)',
        targetRole: 'Clinical Associate / Hospitalist',
        estimatedDuration: 'Ongoing',
        country: 'Canada',
        requirements: [
            { name: 'Medical Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['degree_certificate'] },
            { name: 'Language Proficiency', category: 'Language', isRequired: true, order: 2, description: 'IELTS/CELPiP/OET as required by province', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['exam_result'] },
            { name: 'MCCQE Part 1', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://mcc.ca/examinations/mccqe-part-i/', evidenceTypes: ['exam_result'] },
            { name: 'Provincial Licensing', category: 'Registration', isRequired: true, order: 4, description: 'Registration with provincial medical college', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Associate Appointment', category: 'Training', isRequired: true, order: 5, description: 'Hospital-based clinical position', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['appointment_letter'] },
            { name: 'MCCQE Part 2', category: 'Exam', isRequired: true, order: 6, description: 'Required within supervised practice period', resourceUrl: 'https://mcc.ca/examinations/mccqe-part-ii/', evidenceTypes: ['exam_result'] },
            { name: 'Independent Practice', category: 'Registration', isRequired: true, order: 7, description: 'Full independent licensure', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['registration_certificate'] },
            { name: 'Annual Revalidation', category: 'Document', isRequired: true, order: 8, description: 'Continuing professional development and revalidation', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['appraisal_evidence'] },
        ]
    },
    {
        id: 'ca-practice-ready',
        name: 'Practice-Ready Assessment (PRA)',
        description: 'Provincial Practice-Ready Assessment pathway for experienced IMGs',
        targetRole: 'Independent Practitioner (Provincial License)',
        estimatedDuration: '1-2 years',
        country: 'Canada',
        requirements: [
            { name: 'Medical Degree', category: 'Registration', isRequired: true, order: 1, description: 'Primary medical qualification', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['degree_certificate'] },
            { name: 'MCCQE Part 1', category: 'Exam', isRequired: true, order: 2, resourceUrl: 'https://mcc.ca/examinations/mccqe-part-i/', evidenceTypes: ['exam_result'] },
            { name: 'Language Proficiency', category: 'Language', isRequired: true, order: 3, description: 'English or French proficiency', resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['exam_result'] },
            { name: 'PRA Application', category: 'Document', isRequired: true, order: 4, description: 'Acceptance into provincial PRA program', resourceUrl: 'https://www.royalcollege.ca/en/for-physicians-and-learners/practice-ready-assessment.html', evidenceTypes: ['application'] },
            { name: 'Supervised Assessment Period', category: 'Training', isRequired: true, order: 5, description: '12-24 weeks clinical assessment', resourceUrl: 'https://www.royalcollege.ca/en/for-physicians-and-learners/practice-ready-assessment.html', evidenceTypes: ['training_certificate'] },
            { name: 'Provincial Registration', category: 'Registration', isRequired: true, order: 6, description: 'Practice-ready certificate issued', resourceUrl: 'https://www.royalcollege.ca/en/for-physicians-and-learners/practice-ready-assessment.html', evidenceTypes: ['registration_certificate'] },
            { name: 'Independent Practice License', category: 'Certification', isRequired: true, order: 7, resourceUrl: 'https://mcc.ca/examinations/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'ca-rcpsc-fellowship',
        name: 'RCPSC Subspecialty Fellowship',
        description: 'Royal College subspecialty fellowship after primary residency completion',
        targetRole: 'Subspecialist Physician',
        estimatedDuration: '1-3 years',
        country: 'Canada',
        requirements: [
            { name: 'FRCPC/FRCSC Certification', category: 'Registration', isRequired: true, order: 1, description: 'Primary specialty certification complete', resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['certificate'] },
            { name: 'Fellowship Match', category: 'Training', isRequired: true, order: 2, description: 'Matched to accredited subspecialty program', resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['appointment_letter'] },
            { name: 'Subspecialty Training', category: 'Training', isRequired: true, order: 3, description: '1-3 years of subspecialty training', resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['training_certificate'] },
            { name: 'Subspecialty Exam', category: 'Exam', isRequired: true, order: 4, resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['exam_result'] },
            { name: 'Subspecialty Certification', category: 'Certification', isRequired: true, order: 5, resourceUrl: 'https://www.royalcollege.ca/en/credentials-and-examinations.html', evidenceTypes: ['certificate'] },
        ]
    }
];
