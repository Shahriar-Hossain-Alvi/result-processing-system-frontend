import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './app/routes/Routes.jsx'
import ThemeProvider from './provider/ThemeProvider.jsx'

// create tanstack query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3
    }
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {/* <AuthProvider> Auth Provider + axios interceptor + useNavigate */}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} /> {/* router provider(Routes are here) */}
      </QueryClientProvider>
      {/* </AuthProvider> */}
    </ThemeProvider>
  </StrictMode>,
)
