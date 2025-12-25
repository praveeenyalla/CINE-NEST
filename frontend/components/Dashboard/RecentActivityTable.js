
import { useState } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function RecentActivityTable({ items }) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    // Filter logic
    const filteredItems = items?.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.platform.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <section className="table-card">
            <div className="header">
                <h3>Recent Activity</h3>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                        <span>{page} / {totalPages || 1}</span>
                        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>›</button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Media Title</th>
                            <th>Platform</th>
                            <th>Views</th>
                            <th>Rating</th>
                            <th>Release Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.length > 0 ? paginatedItems.map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <div className="media-cell">
                                        <div className="thumb-mini">
                                            {item.thumbnail ? <img src={item.thumbnail} alt="" /> : '🎬'}
                                        </div>
                                        <div className="info">
                                            <span className="title">{item.title}</span>
                                            <span className="subtitle">{item.type}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="platform-badge">{item.platform.split(',')[0]}</span>
                                </td>
                                <td>{item.views?.toLocaleString()}</td>
                                <td className="rating">⭐ {item.imdb || '0.0'}</td>
                                <td>{item.year || 'N/A'}</td>
                                <td>
                                    <div className="btn-group">
                                        <button className="action-btn view" title="View Details"><FaEye /></button>
                                        <button
                                            className="action-btn edit"
                                            title="Edit"
                                            onClick={() => item._id && router.push(`/admin/edit/${item._id}`)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete" title="Delete"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="empty">No activity found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .table-card {
                    background: #191919;
                    border-radius: 12px;
                    border: 1px solid #333;
                    padding: 1.5rem;
                    grid-column: span 2;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                h3 { margin: 0; font-size: 1.1rem; color: #fff; }
                
                .actions { display: flex; gap: 1rem; align-items: center; }
                .search-input {
                    background: #000;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 6px;
                    width: 200px;
                    outline: none;
                }
                .search-input:focus { border-color: #e50914; }
                
                .pagination { display: flex; align-items: center; gap: 10px; color: #888; font-size: 0.9rem; }
                .pagination button {
                    background: #333;
                    border: none;
                    color: #fff;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .pagination button:disabled { opacity: 0.3; cursor: default; }

                .table-responsive { overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; }
                th {
                    text-align: left;
                    color: #666;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    padding: 1rem;
                    font-weight: 700;
                    border-bottom: 1px solid #333;
                }
                td {
                    padding: 1rem;
                    border-bottom: 1px solid #222;
                    color: #ccc;
                    font-size: 0.9rem;
                }
                tr:last-child td { border-bottom: none; }
                tr:hover td { background: rgba(255,255,255,0.02); }

                .media-cell { display: flex; align-items: center; gap: 12px; }
                .thumb-mini {
                    width: 40px; height: 40px;
                    background: #222;
                    border-radius: 6px;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                    font-size: 1.2rem;
                }
                .thumb-mini img { width: 100%; height: 100%; object-fit: cover; }
                .info { display: flex; flex-direction: column; }
                .title { font-weight: 700; color: #fff; }
                .subtitle { font-size: 0.75rem; color: #666; text-transform: capitalize; }
                
                .platform-badge {
                    background: rgba(229, 9, 20, 0.1);
                    color: #e50914;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .rating { color: #fbbf24; font-weight: 600; }
                
                .btn-group { display: flex; gap: 8px; }
                .action-btn {
                    width: 32px; height: 32px;
                    border-radius: 6px;
                    border: none;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: 0.2s;
                    font-size: 0.9rem;
                }
                .view { background: #333; color: #fff; }
                .view:hover { background: #555; }
                .edit { background: rgba(0, 113, 235, 0.1); color: #0071eb; }
                .edit:hover { background: #0071eb; color: #fff; }
                .delete { background: rgba(229, 9, 20, 0.1); color: #e50914; }
                .delete:hover { background: #e50914; color: #fff; }
                
                .empty { text-align: center; color: #555; padding: 3rem; }
                
                @media (max-width: 1100px) {
                    .table-card { grid-column: span 1; }
                }
            `}</style>
        </section>
    );
}
