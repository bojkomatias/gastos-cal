import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [state, setstate] = useState([])
  const [q, setq] = useState(5)
  const [resultado, setresultado] = useState({ transacciones: [] })

  async function fetchRes() {
    await fetch(`https://fakerapi.it/api/v1/custom?_quantity=${q}&name=name&monto=number&counter=counter`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => setstate(data.data))
  }
  useEffect(() => {
    fetchRes()
  }, [q])

  const Total = () => {
    let total = 0
    state.forEach(x => {
      total += x.monto
    })
    return total
  }

  const Calcular = () => {
    setresultado({})
    var corresponde = Total() / state.length
    console.log(`Corresponde : ${corresponde}`)
    let trans = []
    for (var i = 0; i < state.length; i++) {
      for (var j = 0; j < state.length; j++) {
        if (i === j) continue
        if (state[i].monto < corresponde & state[j].monto > corresponde) {
          let debe = corresponde - state[i].monto
          let acred = state[j].monto - corresponde
          if (acred >= debe) {
            trans.push({ deudor: state[i].name, acredor: state[j].name, monto: debe })
            console.log(`${state[i].name} debe pagar a ${state[j].name} el monto de ${debe}`)
          }
          if (acred < debe) {
            trans.push({ deudor: state[i].name, acredor: state[j].name, monto: acred })
            console.log(`${state[i].name} debe pagar a ${state[j].name} el monto de ${acred}`)
          }
        }
      }
    }
    setresultado({ transacciones: trans, corresponde: corresponde })
  }
  async function guardarResultado(res) {
    await fetch(`/api/hello`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(res)
    })
  }
  return (
    <div >
      <Head>
        <title>Calculador de Gastos 🚀 </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='cont'>

        <div className='cols'>
          <div>
            <p>Traer datos de<input id='input' type='number' min='0' max='20' placeholder='5' onBlur={(e) => setq(Number(e.target.value))} /> </p>
            <table>
              <thead>
                <tr>
                  <th>
                    Nombre
              </th>
                  <th>
                    Monto
              </th>
                </tr>
              </thead>
              {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
              <tbody>
                {state === [] ? null : state.map(i => (
                  <tr key={i.name}>
                    <td>{i.counter}</td>
                    <td>{i.name}</td>
                    <td class='num'>{i.monto}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  {/* <td>Total : {state === [] ? null : Total()}</td> */}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className='cols'>
          <button onClick={() => Calcular()}>CALCULAR 💣 </button>
        </div>

        <div className='cols'>
        <div>
            <h4>Corresponde a cada persona pagar: {resultado.corresponde}</h4>
            {resultado.transacciones.map(t => (
              <div key={t.monto}>
                <p>{`${t.deudor} debe pagar ${t.monto} a ${t.acredor}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
