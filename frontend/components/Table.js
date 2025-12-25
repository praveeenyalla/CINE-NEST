export default function Table({ headers, children }) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {headers.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
            <style jsx>{`
        .table-container {
          background: #111;
          border-radius: 12px;
          border: 1px solid #333;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          padding: 16px;
          background: #1a1a1a;
          color: #9ca3af;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        :global(td) {
          padding: 16px;
          border-top: 1px solid #222;
          color: #fff;
        }
      `}</style>
        </div>
    );
}
