import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import Table from '../../components/Table';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('http://localhost:8000/admin/auth-users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(await res.json());
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const getStatusColor = (s) => {
        if (s === 'Active') return '#22bb33';
        if (s === 'Banned') return '#ef4444';
        return '#fbbf24';
    };

    return (
        <div className="admin-page">
            <Head><title>Authentication & Users | CINE NEST Admin</title></Head>
            <AdminSidebar />
            <div className="main-wrapper">
                <AdminTopBar />
                <main className="dashboard-body">
                    <header className="page-header">
                        <div className="header-info">
                            <h1>User Authentication</h1>
                            <p>Manage access, roles, and linked accounts</p>
                        </div>
                    </header>

                    <div className="table-container">
                        <Table headers={['User Identity', 'Role', 'Status', 'Linked Accounts', 'Origin']}>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-profile">
                                            <div className="avatar-small">{user.username.charAt(0).toUpperCase()}</div>
                                            <div className="info">
                                                <span className="name">{user.username}</span>
                                                <span className="email">{user.email || 'No Email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="role-badge">{user.role}</span></td>
                                    <td>
                                        <span className="status-dot" style={{ background: getStatusColor(user.status) }}></span>
                                        {user.status}
                                    </td>
                                    <td>
                                        <div className="linked-row">
                                            {user.linked.map(l => (
                                                <span key={l} className="link-icon" title={l}>{l[0]}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td><span className="origin-tag">{user.origin || 'Native'}</span></td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                </main>
            </div>
            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { padding: 2rem; }
                .page-header { margin-bottom: 2rem; }
                h1 { font-size: 2rem; margin: 0; font-weight: 800; }
                p { color: #666; margin-top: 5px; }

                .table-container {
                    background: #111; padding: 1.5rem; border-radius: 12px; border: 1px solid #1a1a1a;
                }
                
                .user-profile { display: flex; align-items: center; gap: 12px; }
                .avatar-small { 
                    width: 36px; height: 36px; background: #333; border-radius: 50%; 
                    display: flex; justify-content: center; align-items: center; 
                    font-weight: bold; color: #fff;
                }
                .info { display: flex; flex-direction: column; }
                .name { font-weight: 600; font-size: 0.9rem; }
                .email { font-size: 0.75rem; color: #666; }

                .role-badge { 
                    background: #0071eb20; color: #0071eb; padding: 4px 8px; 
                    border-radius: 4px; font-weight: bold; font-size: 0.75rem; 
                }
                .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
                
                .linked-row { display: flex; gap: 5px; }
                .link-icon {
                    width: 20px; height: 20px; background: #222; border-radius: 4px; border: 1px solid #333;
                    display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold;
                    color: #fff;
                }
                .origin-tag { font-family: monospace; color: #888; border: 1px solid #333; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }
            `}</style>
        </div>
    );
}

