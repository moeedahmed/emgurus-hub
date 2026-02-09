import { PathwayDefinition } from '../pathwayRequirements';

export const middleEastPathways: PathwayDefinition[] = [
    {
        id: 'me-arab-board',
        name: 'Arab Board',
        description: 'Arab Board of Health Specializations residency training',
        targetRole: 'Consultant / Specialist',
        estimatedDuration: '4-6 years',
        country: 'Middle East',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, resourceUrl: 'https://www.arab-board.org/', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, resourceUrl: 'https://www.dataflowgroup.com/', evidenceTypes: ['verification_report'] },
            { name: 'Arab Board Part 1', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://www.arab-board.org/', evidenceTypes: ['exam_result'] },
            { name: 'Residency Training', category: 'Training', isRequired: true, order: 4, description: 'Accredited training program', resourceUrl: 'https://www.arab-board.org/', evidenceTypes: ['training_certificate'] },
            { name: 'Arab Board Part 2 (Final)', category: 'Exam', isRequired: true, order: 5, description: 'Written and Clinical', resourceUrl: 'https://www.arab-board.org/', evidenceTypes: ['exam_result'] },
            { name: 'Specialist Certification', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://www.arab-board.org/', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'me-saudi-board',
        name: 'Saudi Board (SCFHS)',
        description: 'Saudi Commission for Health Specialties training program',
        targetRole: 'Consultant / Specialist',
        estimatedDuration: '4-5 years',
        country: 'Saudi Arabia',
        requirements: [
            { name: 'SMLE Exam', category: 'Exam', isRequired: true, order: 1, description: 'Saudi Medical Licensing Exam', resourceUrl: 'https://scfhs.org.sa/en/SMLE', evidenceTypes: ['exam_result'] },
            { name: 'SCFHS Classification', category: 'Registration', isRequired: true, order: 2, resourceUrl: 'https://scfhs.org.sa/en', evidenceTypes: ['registration_certificate'] },
            { name: 'Saudi Board Part 1', category: 'Exam', isRequired: true, order: 3, resourceUrl: 'https://scfhs.org.sa/en/MESPS', evidenceTypes: ['exam_result'] },
            { name: 'Residency Training', category: 'Training', isRequired: true, order: 4, resourceUrl: 'https://scfhs.org.sa/en', evidenceTypes: ['training_certificate'] },
            { name: 'Saudi Board Final Exam', category: 'Exam', isRequired: true, order: 5, resourceUrl: 'https://scfhs.org.sa/en/MESPS', evidenceTypes: ['exam_result'] },
            { name: 'Board Certification', category: 'Certification', isRequired: true, order: 6, resourceUrl: 'https://scfhs.org.sa/en', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'me-dha-licensing',
        name: 'DHA Licensing (Dubai)',
        description: 'Dubai Health Authority professional licensing pathway',
        targetRole: 'Licensed Practitioner (Dubai)',
        estimatedDuration: '3-6 months',
        country: 'UAE (Dubai)',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognized institution', resourceUrl: 'https://www.dha.gov.ae/en/HealthRegulation/Pages/Licensing.aspx', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', resourceUrl: 'https://www.dataflowgroup.com/', evidenceTypes: ['verification_report'] },
            { name: 'DHA Licensing Exam', category: 'Exam', isRequired: true, order: 3, description: 'Prometric/CBT examination', resourceUrl: 'https://www.dha.gov.ae/en/HealthRegulation/Pages/ExamPolicies.aspx', evidenceTypes: ['exam_result'] },
            { name: 'DHA License', category: 'Registration', isRequired: true, order: 4, description: 'Dubai Health Authority professional license', resourceUrl: 'https://www.dha.gov.ae/en/HealthRegulation/Pages/Licensing.aspx', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Privileges', category: 'Training', isRequired: true, order: 5, description: 'Facility-based clinical appointment', resourceUrl: 'https://www.dha.gov.ae/en/HealthRegulation/Pages/Licensing.aspx', evidenceTypes: ['appointment_letter'] },
        ]
    },
    {
        id: 'me-doh-abudhabi',
        name: 'DOH Licensing (Abu Dhabi)',
        description: 'Abu Dhabi Department of Health professional licensing pathway',
        targetRole: 'Licensed Practitioner (Abu Dhabi)',
        estimatedDuration: '3-6 months',
        country: 'UAE (Abu Dhabi)',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognized institution', resourceUrl: 'https://www.doh.gov.ae/en/health-regulation/health-professionals', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', resourceUrl: 'https://www.dataflowgroup.com/', evidenceTypes: ['verification_report'] },
            { name: 'DOH Assessment Exam', category: 'Exam', isRequired: true, order: 3, description: 'Assessment exam if required by DOH', resourceUrl: 'https://www.doh.gov.ae/en/health-regulation', evidenceTypes: ['exam_result'] },
            { name: 'DOH License', category: 'Registration', isRequired: true, order: 4, description: 'Abu Dhabi Department of Health license', resourceUrl: 'https://www.doh.gov.ae/en/health-regulation/health-professionals', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Privileges', category: 'Training', isRequired: true, order: 5, description: 'Facility-based clinical appointment', resourceUrl: 'https://www.doh.gov.ae/en/health-regulation/health-professionals', evidenceTypes: ['appointment_letter'] },
        ]
    },
    {
        id: 'me-qatar-qchp',
        name: 'QCHP Licensing (Qatar)',
        description: 'Qatar Council for Healthcare Practitioners licensing pathway',
        targetRole: 'Licensed Practitioner (Qatar)',
        estimatedDuration: '3-6 months',
        country: 'Qatar',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognized institution', resourceUrl: 'https://www.qchp.org.qa/en/Pages/default.aspx', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', resourceUrl: 'https://www.dataflowgroup.com/', evidenceTypes: ['verification_report'] },
            { name: 'Prometric Exam', category: 'Exam', isRequired: true, order: 3, description: 'Qatar Prometric assessment', resourceUrl: 'https://www.prometric.com/test-takers/search/medical', evidenceTypes: ['exam_result'] },
            { name: 'QCHP License', category: 'Registration', isRequired: true, order: 4, description: 'Qatar Council professional license', resourceUrl: 'https://www.qchp.org.qa/en/Pages/default.aspx', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Privileges', category: 'Training', isRequired: true, order: 5, description: 'Facility-based clinical appointment', resourceUrl: 'https://www.qchp.org.qa/en/Pages/default.aspx', evidenceTypes: ['appointment_letter'] },
        ]
    },
    {
        id: 'me-kuwait-moh',
        name: 'MOH Licensing (Kuwait)',
        description: 'Kuwait Ministry of Health professional licensing pathway',
        targetRole: 'Licensed Practitioner (Kuwait)',
        estimatedDuration: '3-6 months',
        country: 'Kuwait',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognized institution', resourceUrl: 'https://www.moh.gov.kw/en/', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', resourceUrl: 'https://www.dataflowgroup.com/', evidenceTypes: ['verification_report'] },
            { name: 'Kuwait Board Exam', category: 'Exam', isRequired: true, order: 3, description: 'Prometric assessment for Kuwait', resourceUrl: 'https://www.prometric.com/test-takers/search/medical', evidenceTypes: ['exam_result'] },
            { name: 'MOH License', category: 'Registration', isRequired: true, order: 4, description: 'Kuwait Ministry of Health license', resourceUrl: 'https://www.moh.gov.kw/en/', evidenceTypes: ['registration_certificate'] },
            { name: 'Clinical Appointment', category: 'Training', isRequired: true, order: 5, description: 'Hospital or clinic appointment', resourceUrl: 'https://www.moh.gov.kw/en/', evidenceTypes: ['appointment_letter'] },
        ]
    },
    {
        id: 'sa-clinical-service',
        name: 'Non-Training Clinical Career — Saudi Arabia',
        description: 'Non-training clinical career in Saudi Arabia (Specialist, Consultant roles)',
        targetRole: 'Senior Specialist / Consultant',
        estimatedDuration: 'Ongoing',
        country: 'Saudi Arabia',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognised institution', evidenceTypes: ['degree_certificate'], resourceUrl: 'https://scfhs.org.sa/en' },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', evidenceTypes: ['verification_report'], resourceUrl: 'https://www.dataflowgroup.com/' },
            { name: 'SCFHS Classification', category: 'Registration', isRequired: true, order: 3, description: 'Professional classification by Saudi Commission for Health Specialties', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://scfhs.org.sa/en' },
            { name: 'Specialist Appointment', category: 'Training', isRequired: true, order: 4, description: 'Hospital-based specialist or consultant role', evidenceTypes: ['appointment_letter'] },
            { name: 'Privileging & Credentialing', category: 'Document', isRequired: true, order: 5, description: 'Annual renewal of clinical privileges', evidenceTypes: ['appraisal_evidence'], resourceUrl: 'https://scfhs.org.sa/en' },
            { name: 'CME Requirements', category: 'Document', isRequired: true, order: 6, description: 'Continuing medical education credits', evidenceTypes: ['certificate'], resourceUrl: 'https://scfhs.org.sa/en' },
        ]
    },
    {
        id: 'ae-clinical-service',
        name: 'Non-Training Clinical Career — UAE',
        description: 'Non-training clinical career in United Arab Emirates (DHA/DOH licensed)',
        targetRole: 'Senior Specialist / Consultant',
        estimatedDuration: 'Ongoing',
        country: 'United Arab Emirates',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognised institution', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', evidenceTypes: ['verification_report'], resourceUrl: 'https://www.dataflowgroup.com/' },
            { name: 'DHA/DOH License', category: 'Registration', isRequired: true, order: 3, description: 'Professional license from DHA (Dubai) or DOH (Abu Dhabi)', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.dha.gov.ae/en/HealthRegulation/Pages/Licensing.aspx' },
            { name: 'Specialist Appointment', category: 'Training', isRequired: true, order: 4, description: 'Hospital-based specialist or consultant role', evidenceTypes: ['appointment_letter'] },
            { name: 'Privileging & Credentialing', category: 'Document', isRequired: true, order: 5, description: 'Annual renewal of clinical privileges', evidenceTypes: ['appraisal_evidence'] },
            { name: 'CME Requirements', category: 'Document', isRequired: true, order: 6, description: 'Continuing medical education credits', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'qa-clinical-service',
        name: 'Non-Training Clinical Career — Qatar',
        description: 'Non-training clinical career in Qatar (QCHP licensed)',
        targetRole: 'Senior Specialist / Consultant',
        estimatedDuration: 'Ongoing',
        country: 'Qatar',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognised institution', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', evidenceTypes: ['verification_report'], resourceUrl: 'https://www.dataflowgroup.com/' },
            { name: 'QCHP License', category: 'Registration', isRequired: true, order: 3, description: 'Professional license from Qatar Council for Healthcare Practitioners', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.qchp.org.qa/en/Pages/default.aspx' },
            { name: 'Specialist Appointment', category: 'Training', isRequired: true, order: 4, description: 'Hospital-based specialist or consultant role', evidenceTypes: ['appointment_letter'] },
            { name: 'Privileging & Credentialing', category: 'Document', isRequired: true, order: 5, description: 'Annual renewal of clinical privileges', evidenceTypes: ['appraisal_evidence'] },
            { name: 'CME Requirements', category: 'Document', isRequired: true, order: 6, description: 'Continuing medical education credits', evidenceTypes: ['certificate'] },
        ]
    },
    {
        id: 'kw-clinical-service',
        name: 'Non-Training Clinical Career — Kuwait',
        description: 'Non-training clinical career in Kuwait (MOH licensed)',
        targetRole: 'Senior Specialist / Consultant',
        estimatedDuration: 'Ongoing',
        country: 'Kuwait',
        requirements: [
            { name: 'Primary Medical Qualification', category: 'Registration', isRequired: true, order: 1, description: 'Medical degree from recognised institution', evidenceTypes: ['degree_certificate'] },
            { name: 'Dataflow Verification', category: 'Registration', isRequired: true, order: 2, description: 'Primary source credential verification', evidenceTypes: ['verification_report'], resourceUrl: 'https://www.dataflowgroup.com/' },
            { name: 'MOH License', category: 'Registration', isRequired: true, order: 3, description: 'Professional license from Kuwait Ministry of Health', evidenceTypes: ['registration_certificate'], resourceUrl: 'https://www.moh.gov.kw/en/' },
            { name: 'Specialist Appointment', category: 'Training', isRequired: true, order: 4, description: 'Hospital-based specialist or consultant role', evidenceTypes: ['appointment_letter'] },
            { name: 'Privileging & Credentialing', category: 'Document', isRequired: true, order: 5, description: 'Annual renewal of clinical privileges', evidenceTypes: ['appraisal_evidence'] },
            { name: 'CME Requirements', category: 'Document', isRequired: true, order: 6, description: 'Continuing medical education credits', evidenceTypes: ['certificate'] },
        ]
    }
];
