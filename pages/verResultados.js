import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Resultados = () => {
  const router = useRouter()
  const [state, setstate] = useState([])
  async function fetchRes() {
    const res = await fetch(`/api/hello`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => setstate(data))
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
      Transacciones realizadas
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
      }
    </div>
  )
}

export default Resultados;