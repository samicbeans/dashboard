import DetailView from './routes/DetailView';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Layout from './routes/Layout.jsx';
import NotFound from './routes/NotFound.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index={true} element={<App />} />
      <Route index={false} path="/eventDetails/:id" element={<DetailView />} />
      <Route path="*" element={ <NotFound /> }/>
    </Route>
  </Routes>
</BrowserRouter>
)
