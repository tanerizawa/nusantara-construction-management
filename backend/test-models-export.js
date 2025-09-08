const { models } = require('./models');
console.log('Available models:', Object.keys(models));
console.log('JournalEntry in models:', 'JournalEntry' in models);
console.log('models.JournalEntry:', !!models.JournalEntry);
