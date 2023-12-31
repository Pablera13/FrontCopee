import React, { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Col, Row, Button, Card } from 'react-bootstrap'
import AddForesight from './actions/addForesight'
import Select from 'react-select';
import { useQuery, useMutation } from 'react-query'
import { getProducts } from '../../../services/productService'
import { getForesightById } from '../../../services/foresightService';
import { ListGroup } from 'react-bootstrap';
import UpdateForesight from './actions/updateForesight';
import './listForesight.css'
const listForesight = () => {
    const product = useRef()
    //State para el producto seleccionado en el select
    const [selectedProduct, setSelectedProduct] = useState();
    //State para setear la data de la prevision de un producto
    const [ForesightConsult, setforesightConsult] = useState();

    //trae los productos para renderlizarlos en el select
    const { data: products, isLoading: productsLoading, isError: productsError } = useQuery('product', getProducts);
    let optionsProduct = []
    if (products != null) {
        //console.log(products)
        optionsProduct = products.map((product) => ({
            value: product.id,
            label: product.name + " " + product.unit,
        }));
    }

    const handleConsult = async () => {
        await getForesightById(selectedProduct.value, setforesightConsult)
    }

    return (
        <>
            <Container>
                <br />
                <Row className='titleForesight'>
                    <div>
                        <h2>Previsiones</h2>
                    </div>
                </Row>

                <Row>
                    <Col xs={4} sm={6} lg={3}>
                        <h3 className="text-center">Seleccione un producto</h3><br />
                    </Col>

                    <Col xs={5} sm={4} md={3} lg={3}>
                        <Select options={optionsProduct} ref={product} onChange=
                            {(selectedOption) => setSelectedProduct(selectedOption)} placeholder='Seleccione...'>
                        </Select>
                    </Col>

                    <Col sm={2} lg={2}>
                        <Button variant='secondary' size='sm' onClick={handleConsult} >Consultar previsiones</Button>
                    </Col>

                    <Col sm={2} lg={2}>
                        <AddForesight />
                    </Col>
                </Row>

                {
                    ForesightConsult != null ? (
                        <>
                            {
                                ForesightConsult.initialDate != "0001-01-01T00:00:00" ? (
                                    <>
                                        <Row className="justify-content-md-center">
                                            <Card style={{ width: '18rem' }}>
                                                <Card.Body>
                                                    <Card.Title>Plazo de la prevision</Card.Title>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroup.Item>Fecha inicial: {ForesightConsult.initialDate.slice(0, 10)}</ListGroup.Item>
                                                        <ListGroup.Item>Fecha final: {ForesightConsult.endDate.slice(0, 10)}</ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>


                                            <Col lg={5}>
                                                <Card>
                                                    <Card.Title>Productores para el plazo</Card.Title>
                                                    <ListGroup key={ForesightConsult.id}>
                                                        {
                                                            ForesightConsult.foresightproducers != null ? (ForesightConsult.foresightproducers.map(fproducer =>
                                                                <>
                                                                    <Card.Body>
                                                                        <ListGroup.Item key={fproducer.id}>
                                                                            {fproducer.producer.name + " " + fproducer.producer.lastname1 + ", Telefono: " + fproducer.producer.phoneNumber}

                                                                        </ListGroup.Item>
                                                                    </Card.Body>

                                                                </>
                                                            )) : ("No se agregaron productores del producto: " + selectedProduct.label)

                                                        }

                                                        <UpdateForesight props={ForesightConsult} />
                                                    </ListGroup>
                                                </Card>
                                            </Col>
                                        </Row>


                                    </>
                                ) : (
                                    <>
                                        <Row className="justify-content-md-center">
                                            <Col lg={5}>
                                                <span>No se han creado previsiones para este producto</span>
                                            </Col>
                                        </Row>
                                    </>
                                )
                            }

                        </>
                    )
                        : ("")
                }


            </Container>


        </>
    )
}

export default listForesight