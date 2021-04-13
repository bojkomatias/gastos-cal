import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Resultados = () => {
  const router = useRouter()
  const [state, setstate] = useState([])
  async function fetchRes() {
    const res = await fetch(`https://swapi.dev/api/people/1/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => console.log(data))
  }
  useEffect(() => {
    fetchRes()
  }, [])

  return (
    <div>
      <button onClick={(e) => {
        e.preventDefault()
        router.push('/')
      }}>Volver</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      {/* Transacciones realizadas
      {state == undefined ? null : <>
        {
          state.map(s => (
            <div key={s._id}>
              <h4>Corresponde a cada persona pagar: {s.corresponde}</h4>
              {s.transacciones.map(t => (
                <div key={t.monto}>
                  <p>{`${t.deudor} debe pagar ${t.monto} a ${t.acredor}`}</p>
                </div>
              ))}
            </div>
          ))
        }
      </>
      } */}
    </div>
  )
}

export default Resultados;