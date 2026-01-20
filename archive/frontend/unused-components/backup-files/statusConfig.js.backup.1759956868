/**
 * Document status configuration
 * Defines status colors and display text
 */
export const documentStatusConfig = {
  approved: { color: 'green', text: 'Disetujui' },
  review: { color: 'yellow', text: 'Review' },
  draft: { color: 'gray', text: 'Draft' },
  published: { color: 'blue', text: 'Published' }
};

export const getStatusInfo = (status) => {
  return documentStatusConfig[status] || documentStatusConfig.draft;
};
