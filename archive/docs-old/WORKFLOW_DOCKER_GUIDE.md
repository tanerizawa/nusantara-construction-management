# Workflow Development Guide (Docker)

## Quick Start

### 1. Install Dependencies (Docker)
```bash
./install-workflow-deps.sh
```

### 2. Start Development Environment
```bash
./start-workflow-dev.sh
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Workflow Components

### File Structure
```
frontend/src/
├── components/workflow/
│   ├── ProjectRABWorkflow.js
│   ├── ProjectApprovalStatus.js
│   ├── ProjectPurchaseOrders.js
│   ├── ProjectBudgetMonitoring.js
│   ├── ProjectWorkflowSidebar.js
│   └── index.js
├── hooks/
│   └── useWorkflowData.js
├── utils/
│   └── workflowHelpers.js
└── styles/
    └── workflow.css
```

### Component Usage
```jsx
import { ProjectWorkflowSidebar, ProjectRABWorkflow } from '../components/workflow';

const ProjectDetail = ({ projectId }) => (
  <div className="flex">
    <ProjectWorkflowSidebar projectId={projectId} />
    <ProjectRABWorkflow projectId={projectId} />
  </div>
);
```

## Docker Commands

### Install new NPM packages
```bash
docker-compose run --rm frontend npm install <package-name>
```

### Run tests
```bash
docker-compose run --rm frontend npm test
```

### Build for production
```bash
docker-compose run --rm frontend npm run build
```

### Access container shell
```bash
docker-compose exec frontend sh
```

## Development Workflow

1. Make code changes in `frontend/src/`
2. Docker will automatically reload the application
3. View changes at http://localhost:3000
4. Use browser DevTools for debugging

## Important Notes

- ⚠️ **Never install NPM packages outside Docker**
- ⚠️ **All NPM commands should be run inside Docker containers**
- ⚠️ **Use `docker-compose run --rm frontend npm ...` for NPM operations**

## Troubleshooting

### Container not starting?
```bash
docker-compose down
docker-compose up --build
```

### Dependencies not installing?
```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up
```

### Clear everything and restart?
```bash
docker-compose down -v
docker system prune -f
./install-workflow-deps.sh
```
