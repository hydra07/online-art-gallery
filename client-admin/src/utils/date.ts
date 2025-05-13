export const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};