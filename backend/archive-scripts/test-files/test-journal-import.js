const { JournalEntry } = require('./models');
console.log('JournalEntry imported:', !!JournalEntry);
if (JournalEntry) {
  console.log('JournalEntry methods:', Object.getOwnPropertyNames(JournalEntry));
  console.log('findAndCountAll method:', typeof JournalEntry.findAndCountAll);
} else {
  console.log('JournalEntry is undefined!');
}
