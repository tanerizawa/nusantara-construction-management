// Barrel export for modular Projects page
// This provides backward compatibility with the old Projects.js import

export { default } from './ProjectList';
export { default as ProjectList } from './ProjectList';

// Re-export hooks for potential reuse
export { 
  useProjectFilters, 
  useProjectBulkActions, 
  useProjectActions 
} from './hooks';
