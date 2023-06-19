import github from "./db";
import { useCallback, useEffect, useState } from "react";
import query from "./query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox"
import NavButtons from "./NavButtons"

function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);

  //pagination

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");



  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, queryString, paginationKeyword, paginationString)
    );

    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
      .then((res) => res.json())
      .then((data) => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;
        const start = data.data.search.pageInfo?.startCursor;
        const end = data.data.search.pageInfo?.endCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasPreviousPage;

        setUsername(viewer.name);
        setRepos(repos);
        setTotalCount(total);

        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString, paginationKeyword, paginationString]);

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
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
      {repos && (
        <ul className="list-group list-group-flush">
          {repos.map((r) => {
            return (
              <RepoInfo key={r.node.id.toString()} repo={r.node} />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
