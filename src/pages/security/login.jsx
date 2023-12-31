import React, { useRef,useState } from 'react'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import { loginUser, getUserInformation } from '../../services/loginService';
import { NavLink } from 'react-router-dom';
import './login.css'
import swal from 'sweetalert';

const login = () => {
  const [logging, setLogging] = useState(false);

  const email = useRef();
  const password = useRef();

  let token = ""

  const handleLogin = async () => {

    let userLogin = {
      email: email.current.value,
      password: password.current.value,
    }
    //console.log(userLogin)
    try {
      token = await loginUser(userLogin).then(data => data);
      localStorage.setItem('bearer', token);
      if (token != "") {
        switch(token){
          case "Wrong password": swal("Contraseña incorrecta","La clave no coincide","error"); break;
          case "User not found": swal("Correo no valido","No se encontró un usuario asociado a ese correo electrónico","warning");break;
          default:  
          try {
            let user = await getUserInformation(userLogin)
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            window.location = '/';
            }
            
            
          } catch (error) {
            console.log(error)
          }break; 
        }
        
      }
    } catch (error) {
      console.log(error)
    }
    

  }

  return (
    <>
    
<div class="imagen-de-fondo"></div>
      <Container className='loginContainer'>
        
        <Row>
          <Col>
          <br />
            <h3>Bienvenido!</h3>
          </Col>
        </Row>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2" className='labelLogin'>
                  Correo
                </Form.Label>
                <Form.Control type='text' placeholder="Ingrese su correo" ref={email} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2" className='labelLogin'>
                  Contraseña
                </Form.Label>
                <Form.Control type="password" placeholder="Ingrese su Contraseña" ref={password} />
              </Form.Group>
            </Col>
          </Row>
          <Row className='buttonsRow'>
            <Col lg={7} sm={6}>
              <Button onClick={handleLogin}>Iniciar sesión</Button>
            </Col>

              <Col lg={5} sm={3}>
                <NavLink className={'btn btn-info'} to={'/registerCostumer'}>
                  Registrarme
                </NavLink>
              </Col>
            </Row>
            <br />
            <Row>
              <NavLink className={'btn-btn-secondary'} to={'/forgotPassword'}>
                ¿Olvido su contraseña?
              </NavLink>
            </Row>
            <br />
          </Form>
      </Container>
      <br />
    </>
  )
}

export default login