try {
  const JournalEntry = require('./models/JournalEntry');
  console.log('Direct JournalEntry import:', !!JournalEntry);
  console.log('Type:', typeof JournalEntry);
  console.log('Methods:', Object.getOwnPropertyNames(JournalEntry).slice(0, 10));
} catch (error) {
  console.error('Direct import error:', error.message);
}
