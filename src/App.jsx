import { useEffect, useRef, useState, useCallback } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const searchInput = useRef(null);
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const IMAGES_PER_PAGE = 21;
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      if (searchInput.current.value.length > 0) {
        const res = await fetch(
          `${API_ENDPOINT}?query=${searchInput.current.value.toLowerCase()}&page=${page},&per_page=${IMAGES_PER_PAGE}&client_id=${API_KEY}`
        );
        if (!res.ok) {
          throw new Error(`failed to fetch data : ${res.status}`);
        }
        const data = await res.json();console.log(data.results)
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(`error fetching the images: ${error}`);
    }
  }, [API_ENDPOINT, API_KEY, page]);
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);
  const handleSubmit = (e) => {
    e.preventDefault();
    resetSearch();
  };
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };
  function resetSearch() {
    setPage(1);
    fetchImages();
  }
  return (
    <main className="container max-w-full p-5">
      <h1 className="text-2xl font-bold text-center text-sky-600">
        Image Search
      </h1>
      <div className="search-section ">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex justify-center w-full p-2"
        >
          {" "}
          <input
            type="search"
            ref={searchInput}
            placeholder="Type something to search..."
            name=""
            id=""
            className="placeholder:text-xs placeholder:text-slate-400 placeholder:italic border w-[50%] py-1 px-2 rounded-md shadow-sm focus:ring-sky-500 focus:ring-1 sm:text-sm focus:outline-none focus:border-sky-500  border-slate-300"
          />
        </form>
      </div>{" "}
      <div className="flex flex-wrap gap-2 justify-around w-[30%] mx-auto m-2">
        {[
          { label: "Nature", onClick: () => handleSelection("Nature") },
          { label: "Shoes", onClick: () => handleSelection("Shoes") },
          { label: "Cats", onClick: () => handleSelection("Cats") },
          { label: "Cities", onClick: () => handleSelection("Cities") },
        ].map((button, i) => (
          <button
            key={i}
            type="submit"
            className="p-1 rounded cursor-pointer hover:bg-sky-600 active:bg-sky-700 bg-sky-500 text-slate-200"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>{" "}
      {loading ? (
        <p>loading please wait,..</p>
      ) : error ? (
        <p>network error please try again</p>
      ) : (
        <>
          <div className="container flex flex-wrap justify-center w-full gap-4 px-3 py-10 mx-auto rounded-sm bg-slate-100 images">
            {images.map((image) => (
              <img
                loading="lazy"
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className="m-2 rounded shadow w-72 h-80 image"
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 py-5 buttons">
            {page > 1 && (
              <button
                onClick={() => setPage((prev) => prev - 1)}
                className="p-1 rounded bg-sky-500 text-slate-100 active:bg-sky-700 hover:bg-sky-600"
              >
                Previous
              </button>
            )}
            {page < totalPages && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 rounded hover:bg-sky-600 bg-sky-500 text-slate-100 active:bg-sky-700"
              >
                {" "}
                {loading && (
                  <div
                    className="inline-block w-6 h-6 rounded-full spinner-border animate-spin border-3"
                    role="status"
                    aria-hidden="true"
                  ></div>
                )}
                Next
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default App;
