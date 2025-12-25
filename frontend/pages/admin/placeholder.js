import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

export default function GenericPlaceholder() {
    return (
        <div className="admin-page">
            <Head>
                <title>Feature Coming Soon | CINE NEST Admin</title>
            </Head>

            <AdminSidebar />

            <div className="main-wrapper">
                <AdminTopBar />

                <main className="dashboard-body">
                    <div className="coming-soon">
                        <div className="icon">🚀</div>
                        <h1>Feature Coming Soon</h1>
                        <p>This section is currently under development to provide you with the best experience.</p>
                        <button onClick={() => window.history.back()}>Go Back</button>
                    </div>
                </main>
            </div>

            <style jsx>{`
                .admin-page { background: #000; color: white; min-height: 100vh; }
                .main-wrapper { margin-left: 260px; padding-top: 70px; }
                .dashboard-body { 
                    padding: 2rem; 
                    height: calc(100vh - 70px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .coming-soon { 
                    text-align: center;
                    background: #111;
                    padding: 3rem;
                    border-radius: 20px;
                    border: 1px solid #1a1a1a;
                    max-width: 500px;
                }
                .icon { font-size: 4rem; margin-bottom: 1.5rem; }
                h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem; color: #fff; }
                p { color: #666; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; }
                button {
                    background: #e50914;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }
                button:hover { background: #b20710; transform: scale(1.05); }
            `}</style>
        </div>
    );
}
