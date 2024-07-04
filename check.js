// Suppose you have a search query entered by the user
let searchQuery = "apple";

// Create a regular expression object with case-insensitive matching
let regex = /banana/i;
console.log(regex);

// Sample array of strings to search through
let fruits = ["apple", "banana", "Orange", "grape"];

// Iterate through the array and check if each element matches the search query
fruits.forEach((fruit) => {
  if (regex.test(fruit)) {
    console.log(`${fruit} matches the search query.`);
  }
});
