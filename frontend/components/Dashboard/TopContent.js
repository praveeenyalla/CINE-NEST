
import { FaStar } from 'react-icons/fa';

export default function TopContent({ items }) {
    // If no real items, items will be empty, parent handles loading state

    return (
        <section className="top-content-section">
            <div className="header">
                <h3>Top Rated Items</h3>
                <div className="nav">
                    <span className="nav-btn">‹</span>
                    <span className="nav-btn">›</span>
                </div>
            </div>

            <div className="content-grid">
                {items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="content-card">
                        <div className="thumbnail">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} />
                            ) : (
                                <div className="placeholder">🎬</div>
                            )}
                            <div className="overlay">
                                <span className="play-btn">▶</span>
                            </div>
                        </div>
                        <div className="card-info">
                            <h4>{item.title}</h4>
                            <div className="meta">
                                <span className="type">{item.type === 'movie' ? 'Movie' : 'TV Show'}</span>
                                <span className="rating">
                                    <FaStar className="star" /> {item.imdb || 'N/A'}
                                </span>
                            </div>
                            <div className="stats-row">
                                <span>👁️ {item.views > 1000 ? (item.views / 1000).toFixed(1) + 'k' : item.views}</span>
                                <span>💬 {Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .top-content-section {
                    background: #191919;
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid #333;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                h3 { margin: 0; font-size: 1.1rem; color: white; margin-bottom: 0px;}
                .nav-btn {
                    width: 24px;
                    height: 24px;
                    background: #333;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 8px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    line-height: 0;
                }
                .content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                }
                .content-card {
                    background: #000;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #222;
                    transition: 0.3s;
                }
                .content-card:hover { border-color: #444; transform: translateY(-3px); }
                
                .thumbnail {
                    height: 100px;
                    background: #111;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .placeholder { font-size: 2rem; }
                .overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: 0.3s;
                }
                .content-card:hover .overlay { opacity: 1; }
                .play-btn { color: #fff; font-size: 1.5rem; }
                
                .card-info { padding: 10px; }
                h4 {
                    margin: 0 0 6px 0;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #fff;
                }
                .meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: #888;
                    margin-bottom: 8px;
                }
                .type { text-transform: capitalize; }
                .rating { display: flex; align-items: center; gap: 4px; color: #fbbf24; }
                .stats-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: #666;
                }
            `}</style>
        </section>
    );
}
