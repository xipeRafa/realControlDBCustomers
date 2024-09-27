import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




 import { firestoreDB, storageDocs } from './firebase/firebaseConfig';

 import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';



 const msecToDateNumbers =(milliseconds)=>{ // '16/8/2024, 12:00:00 a.m.'
      return new Date(milliseconds).toLocaleString()
  }







function App() {


  const [items, setItems] = useState([]);

  const itemCollection = query(
      collection(firestoreDB, 'RealControlCustomers'),
  )

  const [toggle, setToggle] = useState(true)

  useEffect(() => {

      getDocs(itemCollection).then((resp) => {

          if (resp.size === 0) {
              console.log('No results!');
          }

          const documents = resp.docs.map((doc) => (
              { id: doc.id, ...doc.data() }
          ))

          setItems(documents);

      }).catch((err) => {
          console.log('Error searching items', err)
      })

  }, [toggle])









  const[taskState, setTaskState]=useState({
    comentarios:"",
    direccionCliente:"",
    fechaMeta:"",
    nombreCliente:"",
    servicioRealizado:"",
    tipoDeServicio:""
  })


  const {
    comentarios,
    direccionCliente,
    fechaMeta,
    nombreCliente,
    servicioRealizado,
    tipoDeServicio
  } = taskState


  const handlerTaskState=({target})=>{
      const {name, value} = target
      setTaskState({...taskState, [name]:value})
  }



  const postCollection = collection(firestoreDB, 'RealControlCustomers');

  const guardar =()=>{

      if (comentarios.trim() === '' ||
          direccionCliente.trim() === '' ||
          fechaMeta.trim() === '' ||
          nombreCliente.trim() === '' ||
          servicioRealizado.trim() === '' ||
          tipoDeServicio.trim() === '' ){
              alert('Algun Campo esta Vacio')
              return
          }


      if (confirm("Gaurdar Cliente")) {



          taskState.dataArr = [{servicioRealizado,tipoDeServicio,lastTime:Date.now(),comentarios,fechaMeta}]

          delete taskState.servicioRealizado
          delete taskState.tipoDeServicio
          delete taskState.comentarios
          delete taskState.fechaMeta

          addDoc(postCollection, taskState)
          setTaskState({
              comentarios:"",
              direccionCliente:"",
              fechaMeta:"",
              nombreCliente:"",
              servicioRealizado:"",
              tipoDeServicio:""
          })
      }

  }






  const [updateMode, setUpdateMode]=useState(false)

  const [newObj, setNewObj]=useState({
    comentarios:"",
    fechaMeta:"",
    servicioRealizado:"",
    tipoDeServicio:""
  })



  const handlerUpdateMode=({target})=>{
      const {name, value} = target
      setNewObj({...newObj, [name]:value})
  }

  const [saveObj, setSaveObj]=useState()
  const [saveID, setSaveID]=useState()

 


  const updateById = async (id, obj) => {


      setSaveObj(obj)
      setSaveID(id)

      if(updateMode === false){
          setUpdateMode(true)
          return
      }

      newObj.lastTime = Date.now()


      saveObj.dataArr.push(newObj)


      if (confirm("Añadir nueva info a Cliente")) {

          delete saveObj.id

          const aDoc = doc(firestoreDB, 'RealControlCustomers', saveID)

          try {
              await updateDoc(aDoc, saveObj);
          } catch (error) {
              console.error(error);
          }

          setUpdateMode(false)
          setToggle(!toggle)

      }

  }



    const [clienteNameFinder, setClienteNameFinder]=useState()

    const handlerFinder =(e)=>{
        if(e.target.value.length > 3){
            setClienteNameFinder(e.target.value)
        }
    }



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  return (
    <>

      <Container>
        <Row>
        <Col>

        <h1>Historial de Cientes</h1>
        <hr />

      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nombre de Cliente</Form.Label>
            <Form.Control type="text" name='nombreCliente' value={nombreCliente} onChange={(e)=>handlerTaskState(e)} />

            <Form.Label>Direccion de Cliente</Form.Label>
            <Form.Control type="text" name='direccionCliente' value={direccionCliente} onChange={(e)=>handlerTaskState(e)}/>

            <Form.Label>Servicio Realizado</Form.Label>
            <Form.Control as="textarea" name='servicioRealizado' value={servicioRealizado} onChange={(e)=>handlerTaskState(e)}/>

            <Form.Label>Fecha y Hora de Atencion</Form.Label>
            <Form.Control type="text" name='fechaMeta' value={fechaMeta} onChange={(e)=>handlerTaskState(e)}/>

            <Form.Label>Tipo de Servicio</Form.Label>
            <Form.Select value={tipoDeServicio} name='tipoDeServicio' onChange={(e)=>handlerTaskState(e)}>

              <option></option>
              <option value="domestica chica">Domestica Chica</option>
              <option value="comercial chica">Comercial Chica</option>
              <option value="industrial chica">Industrial Chica</option>

              <hr />

              <option value="domestica mediana">Domestica Mediana</option>
              <option value="comercial mediana">Comercial Mediana</option>
              <option value="industrial mediana">Industrial Mediana</option>

              <hr />

              <option value="domestica grande">Domestica Grande</option>
              <option value="comercial grande">Comercial Grande</option>
              <option value="industrial grande">Industrial Grande</option>
            </Form.Select>
        </Form.Group>

        <Form.Label>Comentarios</Form.Label>
        <Form.Control as="textarea" name='comentarios' value={comentarios} onChange={(e)=>handlerTaskState(e)} />
      </Form>

      <Button variant="primary" onClick={guardar}>
          GUARDAR
      </Button>



        </Col>
        </Row>
      </Container>

  

      <Container>
        <Row>
          <Col>

          <hr />

           <Form.Label>Buscar por Nombre de Cliente</Form.Label>
            <Form.Control type="search" name='nombreClienteFinder'  onChange={(e)=>handlerFinder(e)} />

              {items?.filter((el) => el.nombreCliente.indexOf(clienteNameFinder) > -1).map((el, i)=>(
                  <div key={i}>

                    <hr />

                    <p>Cliente: {el.nombreCliente}</p>
                    <p>Direccion: {el.direccionCliente}</p>

                    {el.dataArr.map((el, i)=>(
                        <div key={i}>
                            <p>Servicio:{el.servicioRealizado}</p>
                            <p>Hora:{el.fechaMeta}</p>
                            <p>Tipo:{el.tipoDeServicio}</p>
                            <p>Comentarios:{el.comentarios}</p>
                            <p>Ultima Actualización: {msecToDateNumbers(el?.lastTime)}</p>
                            <hr />
                        </div>
                    ))}

                    <Button disabled={el.completed} variant="info" onClick={()=>{updateById(el.id, el), handleShow()}}>
                        {!updateMode ? 'Actualizar' : 'Guardar Nueva Info'}
                    </Button>

                    <p className={!el?.completedTime ? 'd-none' : 'warning'}>Completado el: {msecToDateNumbers(el?.completedTime)}</p>

                    <hr />
                  </div>
                ))}
          </Col>
        </Row>
      </Container>



      <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>
          <Modal.Title>Guardar Ultimo Servicio</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form.Control placeholder='Servicio Realizado' name='servicioRealizado' onChange={(e)=>handlerUpdateMode(e)}/>
            <Form.Control placeholder='Fecha y Hora' name='fechaMeta' onChange={(e)=>handlerUpdateMode(e)}/>
            <Form.Control placeholder='Tipo de Servicio' name='tipoDeServicio' onChange={(e)=>handlerUpdateMode(e)}/>
            <Form.Control placeholder='Comentarios' name='comentarios' onChange={(e)=>handlerUpdateMode(e)}/>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="info" onClick={()=>{updateById(), handleClose()}}>
              Guardar Nueva Info
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  )
}

export default App
