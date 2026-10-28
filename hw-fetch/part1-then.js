const BASE_URL = "https://jsonplaceholder.typicode.com";

function loadPosts(resource) {
  fetch(`${BASE_URL}/${resource}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      console.log(`Знайдено ${posts.length} постів, перший: "${posts[0].title}"`);
    })
    .catch((error) => {
      console.log(`Помилка завантаження: ${error.message}`);
    })
    .finally(() => {
      console.log("Запит завершено");
    });
}

loadPosts("posts");   // успішний запит
loadPosts("postss");  // неіснуючий ресурс -> .catch
