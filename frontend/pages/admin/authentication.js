
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { FaNetflix, FaAmazon, FaHulu } from 'react-icons/fa'; // Importing mock icons (assuming installed)

export default function AuthPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('http://localhost:8000/admin/auth-users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(await res.json());
        };
        fetchUsers();
    }, []);

    const getLinkedIcon = (p) => {
        // Simple mock for platform icons
        const style = { marginRight: '5px' };
        if (p === 'Netflix') return <span style={{ color: '#e50914', ...style }}>N</span>
        if (p === 'Prime Video') return <span style={{ color: '#0071eb', ...style }}>P</span>
        if (p === 'Hulu') return <span style={{ color: '#22bb33', ...style }}>H</span>
        return <span style={{ color: '#113c66', ...style }}>D+</span>
    };

    return (
        <div className="admin-page">
            <Head><title>Authentication | CINE NEST Admin</title></Head>
            <AdminSidebar />
            <div className="main-wrapper">
                <AdminTopBar />
                <main className="dashboard-body">
                    <h1>User Authentication & Accounts</h1>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Password Hash</th>
                                    <th>Linked Accounts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="mono">{user.id}</td>
                                        <td className="bold">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td className="mono pass">{user.password_hash}</td>
                                        <td>
                                            <div className="linked-badges">
                                                {user.linked.length > 0 ? user.linked.map(l => (
                                                    <span key={l} className="link-badge">
                                                        {getLinkedIcon(l)} {l}
                                                    </span>
                                                )) : <span className="no-link">None</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { padding: 2rem; }
                
                table { width: 100%; border-collapse: collapse; background: #111; border-radius: 8px; overflow: hidden; }
                th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #222; }
                th { background: #1a1a1a; color: #888; text-transform: uppercase; font-size: 0.8rem; }
                
                .mono { font-family: monospace; color: #666; font-size: 0.8rem; }
                .bold { font-weight: bold; }
                .pass { color: #444; }
                
                .linked-badges { display: flex; gap: 8px; flex-wrap: wrap; }
                .link-badge {
                    background: #222;
                    border: 1px solid #333;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    display: flex; align-items: center;
                    font-weight: 600;
                }
                .no-link { color: #555; font-style: italic; font-size: 0.8rem; }
            `}</style>
        </div>
    );
}
