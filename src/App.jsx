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


          if(editMode === false){
              taskState.createdAt = Date.now()
          }

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



  const updateById = async (id, obj) => {

      if(updateMode === false){
          setUpdateMode(true)
          return
      }


      console.log('siiii')

      // if (confirm("Añadir nueva info a Cliente")) {

      //     delete obj.id

      //     const aDoc = doc(firestoreDB, 'RealControlCustomers', id)

      //     try {
      //         await updateDoc(aDoc, obj);
      //     } catch (error) {
      //         console.error(error);
      //     }

      //     setToggle(!toggle)

      // }

  }



    const [clienteNameFinder, setClienteNameFinder]=useState()

    const handlerFinder =(e)=>{
        if(e.target.value.length > 3){
            setClienteNameFinder(e.target.value)
        }
    }


  return (
    <>

      <Container>
        <Row>
        <Col>
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
        <Form.Control as="textarea"  name='comentarios' value={comentarios} onChange={(e)=>handlerTaskState(e)} />
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
                    <p>Cliente Creado el: {msecToDateNumbers(el.createdAt)}</p>

                    {el.dataArr.map((el, i)=>(
                        <div key={i}>
                            <p className={!updateMode ? '': 'd-none'}>Servicio:{el.servicioRealizado}</p>
                            <Form.Control className={updateMode ? '': 'd-none'} placeholder='Servicio Realizado' type="text" />

                            <p className={!updateMode ? '': 'd-none'}>Hora:{el.fechaMeta}</p>
                            <Form.Control className={updateMode ? '': 'd-none'} placeholder='Fecha y Hora' type="text" />

                            <p className={!updateMode ? '': 'd-none'}>Tipo:{el.tipoDeServicio}</p>
                            <Form.Control className={updateMode ? '': 'd-none'} placeholder='Tipo de Servicio' type="text" />

                            <p className={!updateMode ? '': 'd-none'}>Comentarios:{el.comentarios}</p>
                            <Form.Control className={updateMode ? '': 'd-none'} placeholder='Comentarios' type="text" />

                            <p>Ultima Actualización:{msecToDateNumbers(el?.lastTime)}</p>
                            <hr />
                        </div>
                    ))}

                    <Button disabled={el.completed} variant="info" onClick={()=>updateById(el.id, el)}>
                        {!updateMode ? 'Actualizar' : 'Guardar Nueva Info'}
                    </Button>

                    <p className={!el?.completedTime ? 'd-none' : 'warning'}>Completado el: {msecToDateNumbers(el?.completedTime)}</p>

                    <hr />
                  </div>
                ))}
          </Col>
        </Row>
      </Container>




    </>
  )
}

export default App
