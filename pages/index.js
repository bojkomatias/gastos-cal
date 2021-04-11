import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [state, setstate] = useState([])
  const [person, setPerson] = useState({})
  const [resultado, setresultado] = useState({ transacciones: [] })

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
    <div className={styles.container}>
      <Head>
        <title>Calculador de Gastos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={(e) => {
          e.preventDefault()
          router.push('/verResultados')
        }}>Ver transacciones guardadas</button>
        <h2>Nuevo Cálculo</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          document.forms[0].reset()
          setstate([...state, person])
          setPerson({})
        }}>
          <input required type='text' placeholder="Nombre.." onChange={(e) => setPerson({ ...person, name: e.target.value })} />
          <input required type='number' placeholder="Monto.." onChange={(e) => setPerson({ ...person, monto: Number(e.target.value) })} />
          <button type='submit'>Agregar Persona</button>
        </form>
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
          <tbody>
            {state.map(i => (
              <tr key={i.name}>
                <td>{i.name}</td>
                <td>{i.monto}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total : {state === [] ? null : Total()}</td>
            </tr>
          </tfoot>
        </table>
        <button onClick={() => Calcular()}>CALCULAR</button>

        <div>
          <h4>Corresponde a cada persona pagar: {resultado.corresponde}</h4>
          {resultado.transacciones.map(t => (
            <div key={t.monto}>
              <p>{`${t.deudor} debe pagar ${t.monto} a ${t.acredor}`}</p>
            </div>
          ))}
        </div>


        <button onClick={(e) => {
          e.preventDefault()
          guardarResultado(resultado)
        }}>Guardar</button>
      </div>
    </div>
  )
}
