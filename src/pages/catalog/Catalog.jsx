import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Container, Card, Button, Fade } from 'react-bootstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useQuery } from "react-query";
import { getProducts } from '../../services/productService';
import './Catalog.css';
import { getCategories } from '../../services/categoryService';
import Select from 'react-select';
import { NavLink } from 'react-router-dom';

const catalog = () => {
  //Trae los productos y categorias
  const { data, isLoading, isError } = useQuery('product', getProducts);
  const { data: Categories, isLoading: CategoriesLoading, isError: CategoriesError } = useQuery('category', getCategories);
  let products = []
  const searchValue = useRef()
  const [search,setSearch] = useState();
  const [SelectedCategory, setSelectedCategory] = useState()

  //const [UserRole,setUserRole] = useState('');

  let optionsSelect = []
  if (Categories) {
    optionsSelect = Categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }
  //console.log("token: "+localStorage.getItem('bearer')+" User: "+localStorage.getItem('user'))

  const handleSearch = () =>{
    setSearch(searchValue.current.value)  
  }

  // useEffect(() => {
  //   const User = localStorage.getItem('user');
  //   if (User) {
  //     const UserObjet = JSON.parse(User)
  //     const UserRole = UserObjet.role.name
  //     UserRole === 'Cliente' ? setUserRole('Cliente') : setUserRole('No Cliente')
  //   } else {
  //     console.log("No habia usuario")
  //   }
  // }, []);

  if (!SelectedCategory) {
    products = data;
  }else{
    products = data.filter((product) => product.categoryId == SelectedCategory.value)
  }
  if(search){
    products = products.filter((product)=> product.name.toLowerCase().includes(searchValue.current.value.toLowerCase()))
  }
  
  const resetFilter = () => {
    setSelectedCategory(null)
  }
  
  if (isLoading)
    return <div>Loading...</div>;

  if (isError)
    return <div>Error</div>;

  return (
    <>
    <br />
    <dir></dir>
      <Container fluid='md'>
        <Row className='search'>
          <Col lg={3}>
            <Select placeholder='Filtrar por categoría' options={optionsSelect} onChange={(selected) => setSelectedCategory(selected)}
            >
            </Select><br />
          </Col>

          <Col lg={3}>
            <Button className='resetFilter' onClick={resetFilter} size='sm'>Deshacer filtro</Button>
          </Col>

          <Col lg={3}>
            <input type="text" className='search' placeholder='Búsqueda...' ref={searchValue} onChange={handleSearch}/>

          </Col>
          <br />
          <br />
        </Row>
        <Row xs={4} md={4} lg={8} xl={12}>
          {
            products != null ? (
              products.map((product) => (
                <Col xs={12} md={6} lg={3} key={product.id}>
                  <Card className="Customcard">
                    <Card.Img variant="top" src={product.image} className="custom-card-img" />
                    <Card.Body>
                      <Card.Title>{product.name }</Card.Title>
                      <Card.Text>{" (" + product.unit + ")"}</Card.Text>
                      <Card.Text>{product.description}</Card.Text>

                      {/* <Button variant="primary" size='sm'>Agregar al pedido</Button> */}


                      

                    
                    </Card.Body>
                    <Card.Footer>
                      
                    {/* <NavLink className="NavLink" to={`/ProductDetail/${product.categoryId}/${product.id}`} >Detalle</NavLink> */}

                    <NavLink className="NavLink" 
                    to={

                      // UserRole === 'Cliente'
                      // ?
                      `/ProductDetail/${product.categoryId}/${product.id}`
                      // :
                      // '/login'
                    } 

                    >Detalle</NavLink>


                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              "Sin productos"
            )
          }
        </Row>
      </Container>
    </>
  );
}

export default catalog;
