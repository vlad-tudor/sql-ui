import { QueryExecResult } from "sql.js";
import "./QueryResultsDisplay.scss";

type QueryResultDisplayProps = {
  queryResults: QueryExecResult[];
};

export const QueryResultDisplay = ({
  queryResults,
}: QueryResultDisplayProps) => {
  return (
    <div className="result-space">
      <pre>
        {queryResults.length === 0 ? (
          <span className="results-placeholder">results will appear here</span>
        ) : (
          <table>
            <thead>
              <tr>
                {queryResults[0].columns.map((column) => (
                  <th>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults[0].values.map((row) => (
                <tr>
                  {row.map((cell) => (
                    <td>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </pre>
    </div>
  );
};
