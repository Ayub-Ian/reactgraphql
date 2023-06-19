import github from "./db";
import { useCallback, useEffect, useState } from "react";
import query from "./query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox"

function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);


  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, queryString)
    );

    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
      .then((res) => res.json())
      .then((data) => {
        const viewer = data.data.viewer;
        const repos = data.data.search.nodes;
        const total = data.data.search.repositoryCount;
        setUsername(viewer.name);
        setRepos(repos);
        setTotalCount(total);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i>Repos
      </h1>
      <p>Hello, {username}</p>
      <SearchBox totalCount={totalCount} pageCount={pageCount} queryString={queryString} onTotalChange={(number) => setPageCount(number)} onQueryChange={(search) => setQueryString(search)} />
      {repos && (
        <ul className="list-group list-group-flush">
          {repos.map((r) => {
            return (
              <RepoInfo key={r.id.toString()} repo={r} />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
