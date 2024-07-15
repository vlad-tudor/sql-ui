import { useState } from "react";
import { useUiDatabase } from "../useUiDatabase";
import { QueryExecResult } from "sql.js";
import { EXAMPLE_QUERY } from "../misc/queries";
import { QueryResultDisplay } from "../QueryResultsDisplay/QueryResultsDisplay";
import { splitQueryText } from "../misc/utils";

import "./App.scss";

export const App = () => {
  const { runQuery, resetDatabase } = useUiDatabase();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryExecResult[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  /**
   * Function which executes whenever the query textarea changes, sets the current query state.
   */
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  /**
   * Function which executes whenever the "Run Query" button is clicked
   */
  const handleRunQuery = () => {
    const queryResults = runQuery(query);

    if (Array.isArray(queryResults) && queryResults.length > 0) {
      setResults(queryResults);
      setError(null);
      setQueryHistory([...queryHistory, query]);
      setQuery("");
    } else if (queryResults instanceof Error) {
      setError(queryResults);
    }
  };

  /**
   * Function which executes whenever the "reset db" button is clicked
   */
  const runDatabaseReset = () => {
    resetDatabase();
    setResults([]);
    setQuery("");
    setError(null);
  };

  return (
    <div className="app-container">
      <div className="query-space">
        <textarea
          value={query}
          onChange={handleQueryChange}
          rows={20}
          cols={50}
          placeholder="Write your SQL query here, e.g. SELECT * FROM table_name;"
        />{" "}
        <br />
        <div className="database-actions">
          <button className="run-query" onClick={handleRunQuery}>
            Run Query
          </button>
          <button className="run-query" onClick={runDatabaseReset}>
            reset db
          </button>
        </div>
        <p className="query-error">{error?.message}</p>
        <code>Example: </code>
        <pre className="query-example">{EXAMPLE_QUERY}</pre>
        <br />
        <code>
          History <button onClick={() => setQueryHistory([])}>clear</button>{" "}
        </code>
        <pre className="query-history">
          {!queryHistory || queryHistory.length === 0 ? (
            <span className="no-history">no history</span>
          ) : (
            queryHistory.map((query, index) => (
              <pre className="query-history-item">
                <span key={index}>{splitQueryText(query)}</span>
              </pre>
            ))
          )}
        </pre>
      </div>
      <QueryResultDisplay queryResults={results} />
    </div>
  );
};
