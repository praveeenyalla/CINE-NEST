
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { FaStar, FaFilm, FaTv } from 'react-icons/fa';
import { API_URL } from '../../config/api';

export default function RatingsPage() {
    const [data, setData] = useState({ top_rated: [], upcoming_2025: [] });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ year: 'all', platform: 'all' });
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/admin/ratings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    router.push('/login');
                    return;
                }

                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    // Frontend Filtering for immediate feedback (since backend filtering is on content-list)
    const filteredRated = data.top_rated.filter(item => {
        if (filter.year !== 'all' && item.year !== parseInt(filter.year)) return false;
        if (filter.platform !== 'all' && item.platform !== filter.platform) return false;
        return true;
    });

    return (
        <div className="admin-page">
            <Head><title>Ratings | CINE NEST Admin</title></Head>
            <AdminSidebar />
            <div className="main-wrapper">
                <AdminTopBar />
                <main className="dashboard-body">
                    <h1>Content Ratings & Feedback</h1>

                    {/* Simulated 2025 Movies Section */}
                    <section className="section">
                        <h2>🚀 Upcoming Releases (2025)</h2>
                        <div className="grid">
                            {data.upcoming_2025.map((item, i) => (
                                <div key={i} className="card upcoming">
                                    <div className="badge">{item.platform}</div>
                                    <div className="info">
                                        <h3>{item.title}</h3>
                                        <div className="meta">
                                            <span>{item.year}</span>
                                            <span>{item.genres}</span>
                                        </div>
                                        <div className="rating-box">
                                            <FaStar color="#e50914" /> {item.imdb}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Top Rated Real Content */}
                    <section className="section">
                        <div className="flex-header">
                            <h2>🏆 Top Rated Now</h2>
                            <div className="filters">
                                <select onChange={(e) => setFilter({ ...filter, platform: e.target.value })}>
                                    <option value="all">All Platforms</option>
                                    <option value="Netflix">Netflix</option>
                                    <option value="Prime Video">Prime Video</option>
                                    <option value="Hulu">Hulu</option>
                                    <option value="Disney+">Disney+</option>
                                </select>
                                <select onChange={(e) => setFilter({ ...filter, year: e.target.value })}>
                                    <option value="all">All Years</option>
                                    <option value="2020">2020</option>
                                    <option value="2010">2010</option>
                                    <option value="2000">2000</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Poster</th>
                                        <th>Title</th>
                                        <th>Platform</th>
                                        <th>Year</th>
                                        <th>IMDb</th>
                                        <th>Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRated.map((item, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="poster-box">
                                                    {item.thumbnail ? <img src={item.thumbnail} /> : <div className="placeholder-poster">{item.title[0]}</div>}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>{item.title}</td>
                                            <td><span className="platform-tag">{item.platform}</span></td>
                                            <td>{item.year}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#fbbf24' }}>
                                                    <FaStar style={{ marginRight: 5 }} /> {item.imdb}
                                                </div>
                                            </td>
                                            <td style={{ color: '#888' }}>{item.votes ? item.votes.toLocaleString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { padding: 2rem; }
                h1 { margin-bottom: 2rem; }
                .section { margin-bottom: 3rem; }
                h2 { border-left: 4px solid #e50914; padding-left: 10px; margin: 0; }
                
                .flex-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .filters select {
                    background: #111; color: white; padding: 8px 12px; border: 1px solid #333;
                    border-radius: 6px; margin-left: 10px; cursor: pointer;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .card {
                    background: #111; border: 1px solid #222; border-radius: 8px; padding: 1.5rem;
                    position: relative; transition: 0.3s;
                }
                .card:hover { transform: translateY(-5px); border-color: #e50914; }
                .badge {
                    position: absolute; top: 10px; right: 10px; background: #e50914;
                    font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold;
                }
                h3 { margin: 10px 0; font-size: 1rem; }
                .meta { font-size: 0.8rem; color: #888; display: flex; gap: 10px; margin-bottom: 10px; }
                .rating-box { font-size: 1.2rem; font-weight: bold; }
                
                table { width: 100%; border-collapse: collapse; background: #111; border-radius: 8px; overflow: hidden; }
                th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #222; }
                th { background: #1a1a1a; color: #888; font-size: 0.8rem; text-transform: uppercase; }
                
                .poster-box { width: 40px; height: 60px; background: #222; border-radius: 4px; overflow: hidden; }
                .poster-box img { width: 100%; height: 100%; object-fit: cover; }
                .placeholder-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #555; font-weight: bold; }
                
                .platform-tag {
                    font-size: 0.75rem; padding: 4px 8px; border: 1px solid #333;
                    border-radius: 4px; background: #1a1a1a;
                }
            `}</style>
        </div>
    );
}
