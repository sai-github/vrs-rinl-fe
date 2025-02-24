export const formatToDisplayDate = (date: Date) => {
  return date
    .toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .split('/')
    .join('-');
};

export const formatDateForInput = (date: Date | null | undefined): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};