
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { API_URL } from '../../config/api';

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/admin/comments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    router.push('/login');
                    return;
                }

                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error("Comments fetch error:", err);
            }
        };
        fetchComments();
    }, [router]);

    const getPlatformColor = (p) => {
        if (p === 'Netflix') return '#e50914';
        if (p === 'Prime Video') return '#0071eb';
        if (p === 'Hulu') return '#22bb33';
        return '#113c66';
    };

    return (
        <div className="admin-page">
            <Head><title>Comments | CINE NEST Admin</title></Head>
            <AdminSidebar />
            <div className="main-wrapper">
                <AdminTopBar />
                <main className="dashboard-body">
                    <h1>User Reviews & Community</h1>

                    <div className="feed">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-card">
                                <div className="avatar" style={{ background: getPlatformColor(comment.platform) }}>
                                    {comment.user.charAt(0)}
                                </div>
                                <div className="content">
                                    <div className="header">
                                        <span className="username">{comment.user}</span>
                                        <span className="platform-tag" style={{ borderColor: getPlatformColor(comment.platform), color: getPlatformColor(comment.platform) }}>
                                            {comment.platform}
                                        </span>
                                        <span className="date">{comment.date}</span>
                                    </div>
                                    <div className="movie-context">
                                        Watching: <span className="movie-title">{comment.movie}</span>
                                    </div>
                                    <p className="text">{comment.comment}</p>
                                    <div className="footer">
                                        <span className="rating">⭐ {comment.rating}</span>
                                        <div className="actions">
                                            <button>Reply</button>
                                            <button>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { padding: 2rem; max-width: 900px; } /* Constrained width for feed look */
                
                .comment-card {
                    display: flex;
                    gap: 1rem;
                    background: #111;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                    border: 1px solid #222;
                }
                .avatar {
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: bold;
                    flex-shrink: 0;
                }
                .content { flex: 1; }
                .header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
                .username { font-weight: bold; }
                .movie-context { font-size: 0.8rem; color: #888; margin-bottom: 6px; }
                .movie-title { color: #fff; font-style: italic; font-weight: 500; }
                .platform-tag {
                    font-size: 0.7rem;
                    border: 1px solid;
                    padding: 2px 8px;
                    border-radius: 10px;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .date { font-size: 0.8rem; color: #666; margin-left: auto; }
                .text { color: #ddd; line-height: 1.5; margin-bottom: 12px; }
                .footer { display: flex; justify-content: space-between; align-items: center; }
                .rating { color: #fbbf24; font-weight: bold; font-size: 0.9rem; }
                
                .actions button {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 0.85rem;
                }
                .actions button:hover { color: #fff; }
            `}</style>
        </div>
    );
}
