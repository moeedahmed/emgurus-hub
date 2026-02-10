-- EMGurus Hub — Exam Module Seed Data
-- 1 exam, 5 topics, 10 sample published questions

-- ============================================================
-- Exam: MRCEM Primary
-- ============================================================
INSERT INTO public.exam_exams (id, name, board, curriculum, format_prompt)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'MRCEM Primary',
  'Royal College of Emergency Medicine',
  'MRCEM Primary Curriculum 2024',
  'Generate single-best-answer MCQ questions for the MRCEM Primary exam. Each question should have a clinical vignette stem with 5 options (A-E). Focus on basic sciences applied to emergency medicine.'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Topics (5 root topics for MRCEM Primary)
-- ============================================================
INSERT INTO public.exam_topics (id, exam_id, name, slug, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Anatomy', 'anatomy', 'Gross anatomy, surface anatomy, and neuroanatomy relevant to emergency medicine'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Physiology', 'physiology', 'Organ system physiology with emphasis on cardiovascular, respiratory, and renal systems'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Pharmacology', 'pharmacology', 'Emergency pharmacology including analgesics, anaesthetics, and resuscitation drugs'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Microbiology', 'microbiology', 'Clinical microbiology, common pathogens, and antimicrobial therapy'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Pathology', 'pathology', 'General and systemic pathology relevant to emergency presentations')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Questions (10 sample published questions)
-- ============================================================
INSERT INTO public.exam_questions (id, exam_id, topic_id, stem, options, correct_answer, difficulty_level, status, source_type, per_option_explanations) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'A 45-year-old man presents with a stab wound to the left posterior triangle of the neck. Which nerve is most at risk of injury?',
  '[{"key":"A","text":"Phrenic nerve"},{"key":"B","text":"Spinal accessory nerve"},{"key":"C","text":"Vagus nerve"},{"key":"D","text":"Hypoglossal nerve"},{"key":"E","text":"Long thoracic nerve"}]',
  'B',
  'C1',
  'published',
  'human',
  '{"A":"The phrenic nerve lies deep within the anterior triangle, not the posterior triangle.","B":"Correct. The spinal accessory nerve crosses the posterior triangle superficially and is most vulnerable to injury here.","C":"The vagus nerve runs within the carotid sheath in the anterior triangle.","D":"The hypoglossal nerve is found deep in the submandibular region.","E":"The long thoracic nerve runs on the chest wall, not through the posterior triangle."}'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'A patient presents with inability to extend the wrist after a mid-shaft humeral fracture. Which nerve is most likely injured?',
  '[{"key":"A","text":"Median nerve"},{"key":"B","text":"Ulnar nerve"},{"key":"C","text":"Radial nerve"},{"key":"D","text":"Musculocutaneous nerve"},{"key":"E","text":"Axillary nerve"}]',
  'C',
  'C1',
  'published',
  'human',
  '{"A":"The median nerve is not closely related to the humeral shaft.","B":"The ulnar nerve runs behind the medial epicondyle, not the mid-shaft.","C":"Correct. The radial nerve spirals around the mid-shaft of the humerus in the radial groove and is most vulnerable here.","D":"The musculocutaneous nerve pierces the coracobrachialis muscle.","E":"The axillary nerve is at risk with surgical neck fractures, not mid-shaft."}'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'A 60-year-old woman with heart failure has an ejection fraction of 30%. Which of the following best describes the Frank-Starling mechanism in this patient?',
  '[{"key":"A","text":"The heart is operating on the ascending limb of the curve"},{"key":"B","text":"The heart is operating on the flat/descending portion of the curve"},{"key":"C","text":"The Frank-Starling mechanism is not applicable in heart failure"},{"key":"D","text":"Increased preload will always improve cardiac output"},{"key":"E","text":"The curve shifts to the left compared to normal"}]',
  'B',
  'C2',
  'published',
  'human',
  '{"A":"The ascending limb represents normal physiologic reserve — this patient has passed that point.","B":"Correct. In heart failure with EF 30%, the ventricle is dilated and operates on the flat/descending portion where increased preload does not improve output.","C":"The mechanism still applies but the curve is shifted rightward and downward.","D":"On the descending limb, increased preload worsens pulmonary congestion without improving output.","E":"The curve shifts to the right and downward in heart failure, not left."}'
),
(
  'c0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'Which of the following causes a right shift in the oxygen-haemoglobin dissociation curve?',
  '[{"key":"A","text":"Alkalosis"},{"key":"B","text":"Hypothermia"},{"key":"C","text":"Decreased 2,3-DPG"},{"key":"D","text":"Increased CO2"},{"key":"E","text":"Carbon monoxide poisoning"}]',
  'D',
  'C1',
  'published',
  'human',
  '{"A":"Alkalosis causes a left shift (increased O2 affinity).","B":"Hypothermia causes a left shift.","C":"Decreased 2,3-DPG causes a left shift.","D":"Correct. Increased CO2 (Bohr effect) causes a right shift, facilitating O2 unloading at tissues.","E":"CO poisoning shifts the curve to the left and changes its shape."}'
),
(
  'c0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'A patient in the emergency department requires rapid sequence intubation. Which induction agent is most appropriate for a haemodynamically unstable trauma patient?',
  '[{"key":"A","text":"Propofol"},{"key":"B","text":"Thiopentone"},{"key":"C","text":"Ketamine"},{"key":"D","text":"Midazolam"},{"key":"E","text":"Etomidate"}]',
  'C',
  'C2',
  'published',
  'human',
  '{"A":"Propofol causes significant hypotension and is avoided in unstable patients.","B":"Thiopentone also causes marked cardiovascular depression.","C":"Correct. Ketamine maintains sympathetic tone and blood pressure, making it ideal for haemodynamically unstable patients.","D":"Midazolam has unpredictable onset and can cause hypotension.","E":"Etomidate is haemodynamically neutral but associated with adrenal suppression; ketamine is generally preferred in trauma."}'
),
(
  'c0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'Which of the following analgesics acts primarily by inhibiting cyclooxygenase (COX) enzymes?',
  '[{"key":"A","text":"Morphine"},{"key":"B","text":"Paracetamol"},{"key":"C","text":"Ibuprofen"},{"key":"D","text":"Tramadol"},{"key":"E","text":"Gabapentin"}]',
  'C',
  'C1',
  'published',
  'human',
  '{"A":"Morphine acts on mu-opioid receptors, not COX enzymes.","B":"Paracetamol''s mechanism is not fully understood; COX inhibition plays a minor role centrally.","C":"Correct. Ibuprofen is a non-selective NSAID that works primarily by inhibiting COX-1 and COX-2 enzymes.","D":"Tramadol acts on opioid receptors and inhibits serotonin/noradrenaline reuptake.","E":"Gabapentin modulates calcium channels; it has no COX activity."}'
),
(
  'c0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000004',
  'A 25-year-old presents with fever, neck stiffness, and a petechial rash. CSF shows gram-negative diplococci. What is the most likely causative organism?',
  '[{"key":"A","text":"Streptococcus pneumoniae"},{"key":"B","text":"Neisseria meningitidis"},{"key":"C","text":"Haemophilus influenzae"},{"key":"D","text":"Listeria monocytogenes"},{"key":"E","text":"Escherichia coli"}]',
  'B',
  'C1',
  'published',
  'human',
  '{"A":"S. pneumoniae is gram-positive diplococci, not gram-negative.","B":"Correct. Gram-negative diplococci with petechial rash and meningism is classic for Neisseria meningitidis (meningococcal meningitis).","C":"H. influenzae is gram-negative coccobacilli, not diplococci.","D":"Listeria is a gram-positive rod.","E":"E. coli is a gram-negative rod, not diplococci."}'
),
(
  'c0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000004',
  'Which antimicrobial agent is the first-line treatment for Clostridioides difficile infection?',
  '[{"key":"A","text":"Metronidazole"},{"key":"B","text":"Vancomycin (oral)"},{"key":"C","text":"Fidaxomicin"},{"key":"D","text":"Ciprofloxacin"},{"key":"E","text":"Amoxicillin"}]',
  'C',
  'C2',
  'published',
  'human',
  '{"A":"Metronidazole is no longer first-line per updated guidelines due to lower cure rates.","B":"Oral vancomycin is an effective alternative but fidaxomicin is now preferred first-line.","C":"Correct. Fidaxomicin is the current first-line treatment per IDSA/SHEA 2021 guidelines due to lower recurrence rates.","D":"Fluoroquinolones are a risk factor for C. diff, not a treatment.","E":"Amoxicillin has no role in C. difficile treatment."}'
),
(
  'c0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000005',
  'A 70-year-old presents with acute chest pain. Troponin is elevated. Which of the following best describes the pathological process in an acute myocardial infarction?',
  '[{"key":"A","text":"Coagulative necrosis"},{"key":"B","text":"Liquefactive necrosis"},{"key":"C","text":"Caseous necrosis"},{"key":"D","text":"Fat necrosis"},{"key":"E","text":"Fibrinoid necrosis"}]',
  'A',
  'C1',
  'published',
  'human',
  '{"A":"Correct. Acute MI causes coagulative necrosis — the tissue architecture is initially preserved despite cell death due to ischaemia.","B":"Liquefactive necrosis is typical of brain infarcts and abscesses.","C":"Caseous necrosis is characteristic of tuberculosis.","D":"Fat necrosis occurs in acute pancreatitis and breast tissue trauma.","E":"Fibrinoid necrosis is seen in malignant hypertension and vasculitis."}'
),
(
  'c0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000005',
  'Which type of hypersensitivity reaction is responsible for anaphylaxis?',
  '[{"key":"A","text":"Type I (immediate)"},{"key":"B","text":"Type II (cytotoxic)"},{"key":"C","text":"Type III (immune complex)"},{"key":"D","text":"Type IV (delayed)"},{"key":"E","text":"Type V (stimulatory)"}]',
  'A',
  'C1',
  'published',
  'human',
  '{"A":"Correct. Anaphylaxis is a Type I (immediate) hypersensitivity reaction mediated by IgE and mast cell degranulation.","B":"Type II involves IgG/IgM against cell surface antigens (e.g., haemolytic transfusion reactions).","C":"Type III involves immune complex deposition (e.g., serum sickness).","D":"Type IV is T-cell mediated and takes 48-72 hours (e.g., contact dermatitis).","E":"Type V is not a standard Gell and Coombs classification; sometimes used for stimulatory antibodies (e.g., Graves disease)."}'
)
ON CONFLICT (id) DO NOTHING;
