import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'; 
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/Aboutpage';
import ArticlesPage, { loader as ArticleLoader } from './pages/ArticlesPage';
import ArticlesListPage from './pages/ArticlesListPage';
import Layout from './Layout';
import NotFoundPage from './pages/NotFoundPage'; 
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/articles',
      element: <ArticlesListPage />
    },
    {
      path: '/articles/:name',
      element: <ArticlesPage />,
      loader: ArticleLoader,
    },
    {
      path: '/login',
      element: <LoginPage />
    },    {
      path: '/create-account',
      element: <CreateAccountPage />
    },
  ]
}]



const router = createBrowserRouter(routes);

function App() { 
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
