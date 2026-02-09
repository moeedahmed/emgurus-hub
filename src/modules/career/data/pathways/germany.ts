import { PathwayDefinition } from '../pathwayRequirements';

export const germanyPathways: PathwayDefinition[] = [
    {
        id: 'de-approbation',
        name: 'German Approbation',
        description: 'Medical Licensure for International Medical Graduates in Germany',
        targetRole: 'Assistenzarzt (Resident)',
        estimatedDuration: '1-2 years',
        country: 'Germany',
        requirements: [
            { name: 'German B2 Certificate', category: 'Language', isRequired: true, order: 1, resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['exam_result'] },
            { name: 'FSP (Fachsprachprüfung)', category: 'Language', isRequired: true, order: 2, description: 'Medical C1 language exam', resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['exam_result'] },
            { name: 'Berufserlaubnis §10', category: 'Registration', isRequired: true, order: 3, description: 'Temporary work permit', resourceUrl: 'https://www.bundesaerztekammer.de/ueber-uns/landesaerztekammern/', evidenceTypes: ['registration_certificate'] },
            { name: 'KP (Kenntnisprüfung)', category: 'Exam', isRequired: true, order: 4, description: 'Medical knowledge equivalency exam', resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['exam_result'] },
            { name: 'Full Approbation', category: 'Registration', isRequired: true, order: 5, description: 'Permanent German Medical License', resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['registration_certificate'] },
        ]
    },
    {
        id: 'de-facharzt',
        name: 'Facharzt Training',
        description: 'Specialist medical training leading to Facharzt title',
        targetRole: 'Facharzt (Specialist)',
        estimatedDuration: '5-6 years',
        country: 'Germany',
        requirements: [
            { name: 'Approbation', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['registration_certificate'] },
            { name: 'Weiterbildung Residency', category: 'Training', isRequired: true, order: 2, description: '5-6 years clinical training', resourceUrl: 'https://www.bundesaerztekammer.de/themen/aerzte/aus-fort-und-weiterbildung/weiterbildung/', evidenceTypes: ['training_certificate'] },
            { name: 'Logbook (eLogbuch)', category: 'Document', isRequired: true, order: 3, description: 'Documented clinical procedures', resourceUrl: 'https://www.bundesaerztekammer.de/themen/aerzte/aus-fort-und-weiterbildung/weiterbildung/', evidenceTypes: ['case_log'] },
            { name: 'Facharztprüfung', category: 'Exam', isRequired: true, order: 4, description: 'Oral specialist examination', resourceUrl: 'https://www.bundesaerztekammer.de/ueber-uns/landesaerztekammern/', evidenceTypes: ['exam_result'] },
            { name: 'Facharzt Diploma', category: 'Certification', isRequired: true, order: 5, resourceUrl: 'https://www.bundesaerztekammer.de/ueber-uns/landesaerztekammern/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'de-assistenzarzt',
        name: 'Assistenzarzt (Non-Specialist)',
        description: 'Non-specialist clinical doctor working in German hospitals without pursuing Facharzt',
        targetRole: 'Assistenzarzt / Clinical Doctor',
        estimatedDuration: 'Ongoing',
        country: 'Germany',
        requirements: [
            { name: 'German B2 Certificate', category: 'Language', isRequired: true, order: 1, resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['exam_result'] },
            { name: 'FSP (Fachsprachprüfung)', category: 'Language', isRequired: true, order: 2, description: 'Medical German C1 exam', resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['exam_result'] },
            { name: 'Berufserlaubnis or Approbation', category: 'Registration', isRequired: true, order: 3, description: 'Temporary permit or full license', resourceUrl: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/arzt-arztin', evidenceTypes: ['registration_certificate'] },
            { name: 'Hospital Employment', category: 'Training', isRequired: true, order: 4, description: 'Assistenzarzt position in hospital', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['appointment_letter'] },
            { name: 'Clinical Practice', category: 'Training', isRequired: true, order: 5, description: 'Ongoing clinical service work', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['employment_letter'] },
            { name: 'Continuing Medical Education', category: 'Document', isRequired: true, order: 6, description: 'CME points and revalidation', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'de-oberarzt',
        name: 'Oberarzt Progression',
        description: 'Post-Facharzt career progression to senior physician and department leadership',
        targetRole: 'Oberarzt / Chefarzt',
        estimatedDuration: '2-5 years post-Facharzt',
        country: 'Germany',
        requirements: [
            { name: 'Facharzt Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Completed specialist certification', resourceUrl: 'https://www.bundesaerztekammer.de/ueber-uns/landesaerztekammern/', evidenceTypes: ['certificate'] },
            { name: 'Oberarzt Appointment', category: 'Training', isRequired: true, order: 2, description: 'Senior physician role', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['appointment_letter'] },
            { name: 'Habilitation', category: 'Document', isRequired: false, order: 3, description: 'Optional academic qualification for university hospitals', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['certificate'] },
            { name: 'Chefarzt / Department Head', category: 'Training', isRequired: false, order: 4, description: 'Optional highest clinical leadership role', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['appointment_letter'] },
            { name: 'Continuing Education', category: 'Document', isRequired: true, order: 5, description: 'CME requirements and professional development', resourceUrl: 'https://www.bundesaerztekammer.de/', evidenceTypes: ['certificate'] },
        ]
    }
];
