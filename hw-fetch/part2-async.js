const BASE_URL = "https://jsonplaceholder.typicode.com";

async function loadPosts(resource) {
  try {
    const response = await fetch(`${BASE_URL}/${resource}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const posts = await response.json();
    console.log(`Знайдено ${posts.length} постів, перший: "${posts[0].title}"`);
  } catch (error) {
    console.log(`Помилка завантаження: ${error.message}`);
  } finally {
    console.log("Запит завершено");
  }
}

loadPosts("posts");   // успішний запит
loadPosts("postss");  // неіснуючий ресурс -> catch
