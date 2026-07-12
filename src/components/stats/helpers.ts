export function fleschLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

export function gradeLevel(fk: number): string {
  if (fk >= 90) return '5th Grade';
  if (fk >= 80) return '6th Grade';
  if (fk >= 70) return '7th Grade';
  if (fk >= 60) return '8th–9th Grade';
  if (fk >= 50) return '10th–12th Grade';
  if (fk >= 30) return 'College';
  return 'Graduate';
}
