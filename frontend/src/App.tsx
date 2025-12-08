import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Videos from './pages/Videos';
import Books from './pages/Books';
import AddItem from './pages/AddItem';
import Search from './pages/Search';
import ItemDetail from './pages/ItemDetail';

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Videos />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/add" element={<AddItem />} />
                    <Route path="/edit/:id" element={<AddItem />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/view/:type/:id" element={<ItemDetail />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
