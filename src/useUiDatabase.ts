import { useEffect, useState } from "react";
import initSqlJs, { Database, QueryExecResult } from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

/**
 * initialises the database -- using the sql.js library
 */
const initialiseDb = async (): Promise<Database | Error> => {
  try {
    const SQL = await initSqlJs({ locateFile: () => sqlWasm });

    return new SQL.Database();
  } catch (err) {
    return new Error("Error initializing SQL.js");
  }
};

/**
 * Given a Database, runs a query and returns the result
 * @throws
 */
const runDatabaseQuery = (
  database: Database,
  query: string
): QueryExecResult[] | Error => {
  try {
    const results = database.exec(query);
    return results;
  } catch (err) {
    return new Error(`Error running query, ${err}`);
  }
};

/**
 * Hook for using a DB instance in a React component
 */
export const useUiDatabase = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    resetDatabase();
  }, []);

  /**
   * Resets the database by closing it and re-instantiating it
   * This method can be augmented to take a file/initial query to load/run as the DB initialises
   */
  const resetDatabase = async () => {
    if (database) {
      database.close();
    }

    const newDatabase = await initialiseDb();
    if (newDatabase instanceof Error) {
      return setError(newDatabase);
    }

    return setDatabase(newDatabase);
  };

  /**
   * Runs a query on the database. Can return query results
   */
  const runQuery = (query: string) => {
    if (!database) {
      return setError(new Error("Database not initialized"));
    }

    return runDatabaseQuery(database, query);
  };

  return { database, error, runQuery, resetDatabase };
};
