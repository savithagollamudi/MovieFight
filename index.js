const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      s: searchTerm,
    },
  });
  if (response.data.Error) {
    return [];
  }
  // a promise is returned, since the function is async
  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label for="search"><b>Search for a movie</b></label>
<input type="text" class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  //handling empty responses
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  //clears data after search, instead of appending to previous list
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  for (let movie of movies) {
    const option = document.createElement("a");
    //some images dont have posters.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src = "${imgSrc}" />${movie.Title}
    `;
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
    });
    resultsWrapper.appendChild(option);
  }
};
input.addEventListener("input", debounce(onInput, 500));
//close the dropdown by clicking anywhere on screen
//other than dropdown itself
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});
