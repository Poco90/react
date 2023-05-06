import { Link } from 'react-router-dom';

function ArticleList() {
  // ...

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {articleList.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.body}</td>
              <td>{article.published ? 'Published' : 'Not Published'}</td>
              <td>
                <Link to={`/articles/${article.id}`}>View/Edit</Link>
                <button onClick={() => handleDelete(article.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticleList;
