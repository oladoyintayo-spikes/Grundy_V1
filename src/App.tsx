import { ErrorBoundary } from './components/ErrorBoundary'
import GrundyPrototype from './GrundyPrototype'

function App() {
  return (
    <ErrorBoundary>
      <GrundyPrototype />
    </ErrorBoundary>
  )
}

export default App
