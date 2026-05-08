export const DEPARTMENTS = ['CSE', 'IT', 'AIML', 'AIDS', 'CSBS', 'ECE', 'EEE', 'MECH', 'CIVIL'] as const;

export type Department = (typeof DEPARTMENTS)[number];
