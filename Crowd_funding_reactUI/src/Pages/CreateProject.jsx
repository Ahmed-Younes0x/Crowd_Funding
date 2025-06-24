import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  InputGroup,
  FormControl,
  FormLabel,
  FormSelect,
  FloatingLabel,
} from "react-bootstrap";

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    category: "",
    tags: "",
    target: "",
    start: "",
    end: "",
    pictures: [],
  });
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/categories/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ...files],
    }));

    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const newPictures = [...formData.pictures];
    const newPreviews = [...previewImages];

    newPictures.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, pictures: newPictures }));
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "pictures") {
          value.forEach((pic) => data.append("pictures", pic));
        } else if (value) {
          data.append(key, value);
        }
      });
      data.append("title", formData.title);
      data.append("details", formData.details);
      data.append("category", formData.category);
      data.append("total_target", formData.target); // Map to backend name
      data.append("start_date", formData.start); // Map to backend name
      data.append("end_date", formData.end);

      const response = await axios.post("http://localhost:8000/api/projects/create/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/project/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Create New Project</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Title */}
                <FloatingLabel
                  controlId="title"
                  label="Project Title"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Project Title"
                  />
                </FloatingLabel>

                {/* Details */}
                <FloatingLabel
                  controlId="details"
                  label="Project Details"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    style={{ height: "150px" }}
                    required
                    placeholder="Project Details"
                  />
                </FloatingLabel>

                <Row className="g-3 mb-3">
                  {/* Category Dropdown */}
                  <Col md={6}>
                    <FloatingLabel controlId="category" label="Category">
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={isFetching}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                      {isFetching && (
                        <div className="mt-2">
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Loading categories...</span>
                        </div>
                      )}
                    </FloatingLabel>
                  </Col>

                  {/* Tags */}
                  <Col md={6}>
                    <FloatingLabel
                      controlId="tags"
                      label="Tags (comma separated)"
                    >
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="design, art, photography"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  {/* Target Amount */}
                  <Col md={4}>
                    <FloatingLabel controlId="target" label="Target Amount ($)">
                      <Form.Control
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="1000"
                      />
                    </FloatingLabel>
                  </Col>

                  {/* Start Date */}
                  <Col md={4}>
                    <FormLabel>Start Date</FormLabel>
                    <Form.Control
                      type="date"
                      name="start"
                      value={formData.start}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  {/* End Date */}
                  <Col md={4}>
                    <FormLabel>End Date</FormLabel>
                    <Form.Control
                      type="date"
                      name="end"
                      value={formData.end}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label>Project Images</Form.Label>
                  <Row className="g-2 mb-3">
                    {previewImages.map((preview, index) => (
                      <Col key={index} xs={4} md={3}>
                        <Card className="h-100">
                          <Card.Img variant="top" src={preview} />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <InputGroup>
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                    />
                    <Button variant="outline-secondary">Upload Images</Button>
                  </InputGroup>
                  <Form.Text muted>Upload up to 5 images (JPEG/PNG)</Form.Text>
                </Form.Group>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading || isFetching}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Creating Project...</span>
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProject;
