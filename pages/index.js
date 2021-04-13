import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [state, setstate] = useState([])
  const [q, setq] = useState(5)
  const [resultado, setresultado] = useState({ transacciones: [] })
  const [query, setquery] = useState(`https://fakerapi.it/api/v1/custom?_quantity=${q}&name=name&monto=number&phone=phone&counter=counter`)

  async function fetchRes() {
    setquery(`https://fakerapi.it/api/v1/custom?_quantity=${q}&name=name&monto=number&phone=phone&counter=counter`)
    await fetch(query, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      setstate(data.data)
    })
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
  return (
    <div >
      <Head>
        <title>Calculador de Gastos 🚀 </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Calculador de Gastos  🚀 </h1>
      <sub>{query}</sub>
      <div className='cont'>
        <div className='cols'>
          <div>
            <p>Traer datos de <input id='input' type='number' min='0' max='10' placeholder='5' onBlur={(e) => {
              setresultado({ transacciones: [] })
              setq(Number(e.target.value))
            }} /> personas </p>

            <table>
              <thead>
                <tr>
                  <th>
                    ID
                  </th>
                  <th>
                    Persona
                  </th>
                  <th>
                    Whastapp
                  </th>
                  <th>
                    MONTO 💰
              </th>
                </tr>
              </thead>
              <br />
              {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
              <tbody>
                {state === [] ? null : state.map(i => (
                  <tr key={i.name}>
                    <td> {i.counter}</td>
                    <td> {i.name}</td>
                    <td > {i.phone}</td>
                    <td> $ {i.monto}</td>
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

        <div id='scroll' className='cols'>
          <div>
            <button onClick={() => Calcular()}>CALCULAR 💣 </button>
            <h4>Corresponde a cada persona pagar: ${Math.trunc(resultado.corresponde)}</h4>
            <br />
            <br />
            {resultado.transacciones.map(t => (
              <div key={t.monto} className='trs'>
                <div>{t.deudor}</div>
                <div className='num'>💸 ${Math.trunc(t.monto)} </div>
                <div>{t.acredor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
