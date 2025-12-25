import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import Table from '../../components/Table';
import Link from 'next/link';

export default function ContentManagement() {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: 'all', sort: 'year', order: 'desc', platform: 'all' });
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
    const router = useRouter();

    const fetchContent = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        try {
            const query = new URLSearchParams({
                type_filter: filters.type,
                sort_by: filters.sort,
                order: filters.order,
                platform_filter: filters.platform,
                page: pagination.page,
                limit: 15
            }).toString();

            const response = await fetch(`http://localhost:8000/admin/content-list?${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch content');

            const data = await response.json();
            setContent(data.data);
            setPagination({ ...pagination, total: data.total, pages: data.pages });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [router, filters, pagination.page]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:8000/admin/content/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Delete failed');

            setContent(content.filter(item => item._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="admin-page">
            <Head>
                <title>Manage Content | CINE NEST Admin</title>
            </Head>

            <AdminSidebar />

            <div className="main-wrapper">
                <AdminTopBar />

                <main className="dashboard-body">
                    <header className="page-header">
                        <div className="header-info">
                            <h1>Content Management</h1>
                            <p>Add, edit, or remove movies and shows</p>
                        </div>
                        <Link href="/admin/create" className="add-btn">
                            + Create New Content
                        </Link>
                    </header>

                    <div className="filters-bar">
                        <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                            <option value="all">All Content Types</option>
                            <option value="movie">Movies</option>
                            <option value="series">TV Shows & Series</option>
                        </select>
                        <select onChange={(e) => setFilters({ ...filters, platform: e.target.value })}>
                            <option value="all">All Platforms</option>
                            <option value="Netflix">Netflix</option>
                            <option value="Prime Video">Prime Video</option>
                            <option value="Hulu">Hulu</option>
                            <option value="Disney+">Disney+</option>
                        </select>
                        <select onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                            <option value="year">Sort by Year</option>
                            <option value="title">Sort by Name</option>
                            <option value="imdb">Sort by Rating</option>
                        </select>
                        <select onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
                            <option value="desc">Newest / Highest</option>
                            <option value="asc">Oldest / Lowest</option>
                        </select>
                    </div>

                    {error && <div className="error-bar">{error}</div>}

                    <div className="table-container">
                        <Table headers={['Title', 'Platform', 'Details', 'Rating', 'Actions']}>
                            {content.map((item) => (
                                <tr key={item._id}>
                                    <td className="font-bold">
                                        <div className="media-flex">
                                            {item.thumbnail ? <img src={item.thumbnail} className="thumb-mini" /> : null}
                                            {item.title}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge">{item.platform || 'General'}</span>
                                    </td>
                                    <td>
                                        <div className="meta-cell">
                                            <span>{item.year}</span>
                                            <span className="type-meta">{item.type}</span>
                                        </div>
                                    </td>
                                    <td className="rating">⭐ {item.imdb}</td>
                                    <td>
                                        <div className="actions">
                                            <button
                                                onClick={() => router.push(`/admin/edit/${item._id}`)}
                                                className="edit-btn"
                                            >Edit</button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="del-btn"
                                            >Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        >
                            Previous
                        </button>
                        <span>Page {pagination.page} of {pagination.pages}</span>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        >
                            Next
                        </button>
                    </div>

                    {content.length === 0 && !loading && (
                        <div className="empty-state">No content found in the database.</div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { padding: 2rem; }
                .page-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-end; 
                    margin-bottom: 2rem; 
                }
                h1 { font-size: 2rem; margin: 0; font-weight: 800; }
                p { color: #666; margin-top: 5px; }
                
                .add-btn {
                    background: #e50914;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: 0.3s;
                    font-size: 0.9rem;
                }
                .add-btn:hover { background: #b20710; }

                .filters-bar {
                     display: flex;
                     gap: 15px;
                     margin-bottom: 20px;
                }
                .filters-bar select {
                    background: #111;
                    color: white;
                    border: 1px solid #333;
                    padding: 8px 12px;
                    border-radius: 6px;
                    outline: none;
                    cursor: pointer;
                }
                .filters-bar select:hover { border-color: #555; }

                .table-container {
                    background: #111;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #1a1a1a;
                }

                .font-bold { font-weight: 700; font-size: 0.95rem; }
                .media-flex { display: flex; align-items: center; gap: 10px; }
                .thumb-mini { width: 30px; height: 30px; border-radius: 4px; object-fit: cover; }
                
                .rating { color: #fbbf24; font-weight: 600; }
                .badge {
                    background: #e5091420;
                    color: #e50914;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    margin-right: 6px;
                }
                .meta-cell { display: flex; flex-direction: column; font-size: 0.8rem; color: #888; }
                .type-meta { font-size: 0.75rem; text-transform: uppercase; color: #555; }
                
                .actions { display: flex; gap: 8px; }
                .edit-btn, .del-btn {
                    background: transparent;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 4px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: 0.3s;
                }
                .edit-btn:hover { border-color: #e50914; color: #e50914; }
                .del-btn:hover { border-color: #ef4444; color: #ef4444; }
                
                .pagination { display: flex; justify-content: flex-end; align-items: center; gap: 20px; margin-top: 20px; color: #888; font-size: 0.9rem; }
                .pagination button {
                    background: #222; border: 1px solid #333; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;
                }
                .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
                .pagination button:not(:disabled):hover { background: #333; }

                .empty-state { text-align: center; padding: 4rem; color: #666; }
                .error-bar { background: #ef444420; color: #ef4444; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
            `}</style>
        </div>
    );
}

