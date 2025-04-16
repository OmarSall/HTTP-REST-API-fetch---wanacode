const API_URL = 'http://localhost:3000/api';
const articlesList = document.getElementById('articles-list');
const articleForm = document.getElementById('article-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const articleIdInput = document.getElementById('article-id');
const cancelButton = document.getElementById('cancel-edit');
const errorDiv = document.getElementById('error-message');

function fetchArticles() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => renderArticles(data));
}

function renderArticles(articles) {
  articlesList.innerHTML = '';
  articles.forEach((article) => {
    const listItem = document.createElement('li');
    listItem.className =
      'list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row';

    const info = document.createElement('div');
    info.innerHTML = `<h5>${article.title}</h5><p>${article.content}</p>`;

    const buttonGroup = document.createElement('div');
    buttonGroup.innerHTML = `
    <button class="btn btn-sm btn-warning me-2">Edit</button>
    <button class="btn btn-sm btn-danger">Delete</button>
  `;
    buttonGroup.querySelector('.btn-warning').addEventListener('click', () => {
      articleIdInput.value = article.id;
      titleInput.value = article.title;
      contentInput.value = article.content;
      cancelButton.classList.remove('d-none');
    });

    buttonGroup.querySelector('.btn-danger').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this article?')) {
        deleteArticle(article.id);
      }
    });
    listItem.appendChild(info);
    listItem.appendChild(buttonGroup);
    articlesList.appendChild(listItem);
  });
}

function deleteArticle(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(() => fetchArticles());
}

articleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = articleIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  const article = { title, content };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return response.json();
    })
    .then(() => {
      articleForm.reset();
      articleIdInput.value = '';
      cancelButton.classList.add('d-none');
      errorDiv.textContent = '';
      fetchArticles();
    })
    .catch((error) => {
      errorDiv.textContent = error.message;
    });
});

cancelButton.addEventListener('click', () => {
  articleForm.reset();
  articleIdInput.value = '';
  cancelButton.classList.add('d-none');
  errorDiv.textContent = '';
});

fetchArticles();
