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

  const [DateMS, setDateMS]=useState('')


  const [items, setItems] = useState([]);
  const [tecnicoState, setTecnicoState]=useState('')

  const itemCollection = query(
      collection(firestoreDB, 'tasksRealControl'),
      where('asignadoPara', '==', tecnicoState)
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


  useEffect(()=>{
      setToggle(!toggle)
  },[tecnicoState])



  // const updateById = async (id, obj) => {

  //   if (confirm("Marcar como Servicio Completado")) {
  //     obj.completed = true
  //     obj.completedTime = Date.now()
  //     delete obj.id

  //     const aDoc = doc(firestoreDB, 'tasksRealControl', id)

  //     try {
  //         await updateDoc(aDoc, obj);
  //     } catch (error) {
  //         console.error(error);
  //     }

  //     setToggle(!toggle)
  //   }

  // }

    const handlerUsuario=(USER)=>{
        if(DateMS === ''){
          alert('Selecciona una Fecha y despues un Usuario')
          return
        }
        setTecnicoState(USER)
    }



  
    const setDate=(e)=>{
        let DateToCero = Date.parse(e.target.value.replace('-', '/').replace('-', '/'))
        setDateMS(DateToCero)
    }


  return (
    <>



      <Container>
      <hr />

        <Row className='d-flex text-center'>
            <Col><input type='date'  onChange={(e)=>setDate(e)}/> </Col>
            <Col><Button className={tecnicoState !== 'usuario1' ? 'gray' : 'blue' } onClick={()=>handlerUsuario('usuario1')}>Usuario1</Button> </Col>
            <Col><Button className={tecnicoState !== 'usuario2' ? 'gray' : 'blue' } onClick={()=>handlerUsuario('usuario2')}>Usuario2</Button> </Col>
            <Col><Button className={tecnicoState !== 'usuario3' ? 'gray' : 'blue' } onClick={()=>handlerUsuario('usuario3')}>Usuario3</Button> </Col>
        </Row>

        <Row>
          <Col>

              {/*{tecnicoState}*/}
              {items?.sort((a, b) => b.createdAt - a.createdAt)
                    .filter(el=>el.createdAt > DateMS)
                    .filter(el=>el.createdAt < DateMS + 86400000).map((el, i)=>(
                  <div key={i}>

                    <hr />
                    <p>Cliente: {el.nombreCliente}</p>
                    <p>Direccion: {el.direccionCliente}</p>
                    <p>Servicio: {el.servicioDescripcion}</p>
                    <p>Hora: {el.fechaMeta}</p>
                    <p>Tipo: {el.tipoDeServicio}</p>
                    <p>Consumibles: {el.consumibles}</p>
                    <p>Comentarios: {el.comentarios}</p>
                    <p>Tarea Creada el: {msecToDateNumbers(el.createdAt)}</p>

                    <Button disabled={true} variant="primary" className={el.completed ? '' : 'red'}>
                        {el.completed ? 'Completado' : 'Pendiente'}
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
