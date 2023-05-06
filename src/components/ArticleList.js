import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Card, Button, Collapse } from 'react-bootstrap';


function ArticleList() {
  const [articleList, setArticleList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => setIsOpen(!isOpen);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    published: false
  });
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:4000/articles", { headers: { Accept: "application/json" } });
// Sort the articles by their id in descending order
      const sortedArticles = response.data.sort((a, b) => b.id - a.id);
      setArticleList(sortedArticles);
    }
    fetchData();
  }, []);

// Submitting Articles
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedArticle === null) {
        const response = await axios.post("http://localhost:4000/articles", formData, { headers: { Accept: "application/json" } });
        setArticleList([...articleList, response.data]);
      } else {
        await axios.put(`http://localhost:4000/articles/${selectedArticle}`, formData, { headers: { Accept: "application/json" } });
        const updatedList = articleList.map(article => {
          if (article.id === selectedArticle) {
            return { ...article, ...formData };
          } else {
            return article;
          }
        });
        setArticleList(updatedList);
        setSelectedArticle(null);
      }
      setFormData({ title: '', body: '', published: false });
    } catch (error) {
      console.log(error);
    }
  };

// Deleting Articles
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/articles/${id}`, { headers: { Accept: "application/json" } });
      const updatedList = articleList.filter(article => article.id !== id);
      setArticleList(updatedList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddArticle = () => {
    // Call the submit function
    handleSubmit();
    // Set the isOpen state to false to collapse the form. I wanted to keep it closed when not needed.
    setIsOpen(false);
  };

  const handleEdit = (id) => {
    setSelectedArticle(id);
    //Set data entry form to open when an article is being edited.
    setIsOpen(true);
    const article = articleList.find(article => article.id === id);
    setFormData({
      title: article.title,
      body: article.body,
      published: article.published
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, published: e.target.checked });
  };

  return (
    
<div className="container">
<header className="header">
        <h1 className="header-title">News Articles</h1>
      </header>
  <Card>
  <>
      <Button variant="primary" onClick={toggleForm}>
        {isOpen ? 'Hide Form' : 'Add Article'}
      </Button>
      <Collapse in={isOpen}>
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter title" />
            </Form.Group>
            <Form.Group controlId="formBody">
              <Form.Label>Body:</Form.Label>
              <Form.Control as="textarea" rows={3} name="body" value={formData.body} onChange={handleChange} placeholder="Enter body" />
            </Form.Group>
            <Form.Group controlId="formPublished">
              <Form.Check type="checkbox" name="published" checked={formData.published} onChange={handleCheckboxChange} label="Published" />
            </Form.Group>     
            <Button className="my-button-class"  type="submit" onClick={handleAddArticle} >Add Article</Button>
          </Form>
        </div>
      </Collapse>
    </>

  </Card>
	<hr />
		{articleList.map(article => (
		<Card key={article.id}>
	<Card.Body>
		<Card.Title>{article.title}</Card.Title>
		<Card.Text>{article.body}</Card.Text>
		<div>
			<Button variant="danger" onClick={() => handleDelete(article.id)}>Delete</Button>
			<Button variant="primary" onClick={() => handleEdit(article.id)}>Edit</Button>
		</div>
	</Card.Body>
  </Card>
  ))}
</div>
  );
}

export default ArticleList;
