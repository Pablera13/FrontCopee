import { React, useEffect, useState } from 'react'
import Select from 'react-select';
import { Modal, Button, Col, Row, Container, Form, ListGroup, Table } from 'react-bootstrap';
import { getProducers } from '../../../../services/producerService';
import { useQuery, QueryClient, useMutation } from 'react-query';
import { createForesightProducer, deleteForesightProducer } from '../../../../services/foresightProducerService';
import { Alert } from 'react-bootstrap';
const updateForesight = (props) => {
    const queryClient = new QueryClient();
    //Capturar las props y metodos del modal
    let foresight = props.props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //limpiar cada vez que se cierra el modal
    const clear = () => {
        producersInList = []
        handleClose()
    }

    //Conocer los productores que ya participaban en la prevision
    let producersInList = []
    //const [producersInList, setProducersInList] = useState();
    if (foresight.foresightproducers) {
        foresight.foresightproducers.map((item) => {
            producersInList.push(item.producer)
        })
    }

    //Traer los productores para el select
    const [selectedProducer, setSelectedProducer] = useState()
    const { data: producers, isLoading: producersLoading, isError: producersError } = useQuery('producer', getProducers);

    let optionsProducer = [] //Todos los productores

    let optionsSelect = [] //Los que seran mostrados en el select

    if (producers) {
        optionsProducer = producers.map((producers) => ({
            value: producers.id,
            label: producers.name + " " + producers.lastname1,
        }))
    };
    //Filtrar todos los productores con los que estaban en la lista
    if (producersInList.length == 0) {
        optionsSelect = optionsProducer
    } else if (producersInList.length != 0) {
        producersInList.map((inlist) => {
            optionsSelect = optionsProducer.filter((option) => option.value != inlist.id)
        }
        )
    }

    //Productores a agregar
    const [newProducers, setnewProducers] = useState([])

    const handleNewProducer = () => {

        let existing = false;
        newProducers.forEach(prod => {
            if (prod.id == selectedProducer.value) {
                existing = true
                console.log("This producer has been already added")

            }
        })

        if (existing == false) {
            let newProducer = {
                id: selectedProducer.value,
                name: selectedProducer.label
            }
            setnewProducers((prevProducers) => [...prevProducers, newProducer])

            //console.log(newProducers)
        }
    }

    const deleteForesightProducerMutation = useMutation("Foresightproducer", deleteForesightProducer,
        {
            onSettled: () => queryClient.invalidateQueries("Foresightproducer"),
            mutationKey: "Foresightproducer",
            onSuccess: () => {
                swal({
                    title: 'Eliminado!',
                    text: `Se elimino el productor de la lista`,
                    icon: "success"
                })
                
            },
            onError: () => {
                swal('Error', 'No se pudo eliminar el producto', 'error')
            }
        })

    const handleDeleteProducer = (foresightproducerId) => {
        let find = foresight.foresightproducers.find((producer) => producer.producerId = foresightproducerId)

        deleteForesightProducerMutation.mutateAsync(find.id)
    }

    const handleRemoveProducer = (idProducer) => {
        console.log(idProducer)
        setnewProducers(newProducers.filter(p => p.id != idProducer))
    }

    const mutationForesightProd = useMutation("Foresightproducer", createForesightProducer,
        {
            onSettled: () => queryClient.invalidateQueries("Foresightproducer"),
            mutationKey: "Foresightproducer",
            onSuccess: () => {
                swal({
                    title: 'Agregado!',
                    text: `Se agrego la prevision`,
                    icon: "success"
                })
                setTimeout(() => {
                    handleClose()
                    window.location.reload()
                }, 2000);
            },
            onError: () => {
                swal('Error', 'No se guardaron los cambios', 'error')
            }
        })

    const saveChanges = () => {

        newProducers.map((newFproducer) => {
            let newforesightProducer = {
                producerId: newFproducer.id,
                ForesightId: foresight.id,
            };
            console.log(newforesightProducer)
            mutationForesightProd.mutateAsync(newforesightProducer)
        }
        )
    }

    return (
        <>
            <Button variant="outline-secondary" onClick={handleShow} size='sm'>
                Editar
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar prevision</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row>
                            <h3>Productores en lista: </h3>
                            <Col>
                                <Table striped bordered hover variant="light" size='sm'>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            producersInList != null ? (
                                                producersInList.map((producs) =>
                                                    <tr key={producs.id}>
                                                        <td>{producs.name + " "+producs.lastname1   }</td>
                                                        <td>
                                                            <Button size='sm' variant='outline-danger' onClick={() => handleDeleteProducer(producs.id)}>
                                                                Eliminar
                                                            </Button>
                                                            </td>
                                                    </tr>
                                                )
                                            )
                                                : ("Sin productores")
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        
                        <h3 className="text-center">Seleccione al nuevo productor</h3><hr />
                        <Select options={optionsSelect} onChange=
                            {(selectedOption) => setSelectedProducer(selectedOption)} placeholder='Busqueda'>
                        </Select>
                        <Button variant='secondary' size='sm' onClick={handleNewProducer}>Agregar agregar a la lista</Button>

                        <Row>
                            <h3>Productores que serán agregados: </h3>
                            <Col>
                                <Table striped bordered hover variant="light" size='sm'>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            newProducers != null ? (
                                                newProducers.map((newProducer) =>
                                                    <tr key={newProducer.id}>
                                                        <td>{newProducer.name }</td>
                                                        <td>
                                                            <Button size='sm' variant='outline-danger' onClick={() => handleRemoveProducer(newProducer.id)}>
                                                                Remover
                                                            </Button>
                                                            </td>
                                                    </tr>
                                                )
                                            )
                                                : ("Sin productores")
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clear}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default updateForesight