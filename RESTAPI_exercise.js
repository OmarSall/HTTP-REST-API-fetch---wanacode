// Exercise: fetch a user with a given ID and log the street where they live into the console

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(function (response) {
    return response.json();
  })
  .then(function (user) {
    console.log("Street:", user.address.street);
  })
  .catch(function (error) {
    console.error("Something went wrong:", error);
  });

// Exercise: fetch a photo with a given id. Display the status code if the request fails.

fetch("https://jsonplaceholder.typicode.com/photos/9999")
  .then(function (response) {
    if (!response.ok) {
      return Promise.reject({ status: response.status });
    }
    return response.json();
  })
  .then(function (photo) {
    console.log("Photo:", photo);
  })
  .catch(function (error) {
    console.log("Request failed. Status code:", error?.status);
  });

// Exercise: modify an existing todo using the PUT method. Print the modified todo to the console.
// Include error handling.

fetch("https://jsonplaceholder.typicode.com/todos/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: 1,
    title: "Updated task title",
    completed: true,
  }),
})
  .then(function (response) {
    if (!response.ok) {
      return Promise.reject({ status: response.status });
    }
    return response.json();
  })
  .then(function (updatedTodo) {
    console.log("Modified todo:", updatedTodo);
  })
  .catch(function (error) {
    console.error("Error! Status code:", error?.status);
  });

// Exercise: fetch albums and photos in parallel

Promise.all([
  fetch("https://jsonplaceholder.typicode.com/albums"),
  fetch("https://jsonplaceholder.typicode.com/photos"),
])
  .then(function (responses) {
    const albumsResponse = responses[0];
    const photosResponse = responses[1];
    return Promise.all([albumsResponse.json(), photosResponse.json()]);
  })
  .then(function (responseBodies) {
    const albums = responseBodies[0];
    const photos = responseBodies[1];
    console.log("Albums:", albums);
    console.log("Photos:", photos);
  })
  .catch(function (error) {
    console.error("Something went wrong:", error);
  });