function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

async function mainEvent() {
  // the async skeyword means we can make API requests
  const form = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector("#filter_button");
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  let storedList = [];

  let currentList = [];

  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("loading data");
    loadAnimation.style.display = "inline-block";

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );

    // This changes the response from the GET into data we can use - an "object"
    storedList = await results.json();
    if (storedList.length > 0) {
      generateListButton.classList.remove("hidden");
    }
    loadAnimation.style.display = "none";
    console.table(storedList); // this is called "dot notation"
    // arrayFromJson.data - we're accessing a key called 'data' on the returned object
    // it initially contains all 1,000 records from your reques
  });

  filterButton.addEventListener("click", (event) => {
    console.log("clicked filter Button");

    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);
    console.log(newList);
    injectHTML(newList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    const currentList = cutRestaurantList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
  });
}

/*
    This adds an event listener that fires our main event only once our page elements have loaded
    The use of the async keyword means we can "await" events before continuing in our scripts
    In this case, we load some data when the form has submitted
  */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
