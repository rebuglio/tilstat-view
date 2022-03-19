import React, {useState} from 'react'
import Chart from "react-apexcharts";

import Select from 'react-select';
import tilstat from '../data/tilstat.json'
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {animateScroll as scroll} from "react-scroll";
import {Link} from "react-router-dom";
import {TitleBox} from "../elements/navbars";


const all_courses = Array.from(new Set(tilstat.map(t => t['corso'])))
const commonColors = '#008FFB #00E396 #FEB019 #FF4560 #775DD0 #3F51B5 #03A9F4 #4CAF50 #F9CE1D #FF9800'.split(' ')

function format_mw(m1, w) {
  let m = {'07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}[m1]
  if (!m)
    return "After" //+m1+" "+w
  w += 1
  const suf = {1: 'st', 2: 'nd'}[w] || 'th'
  return `${m} ${w}${suf} week`
}

export const TilStat = () => {

  const [course, setCourse] = useState(17)

  const course_name = all_courses[course] || all_courses[0]

  let month_weeks = new Set()
  const data = {};
  tilstat.filter(t => t.corso === course_name)
      .forEach(t => {
        if (!data[t.year])
          data[t.year] = {}
        const montweek = format_mw(t.month, t.week)

        // exclude repetition in rank
        if (!Object.values(data[t.year]).map(to => to.totale).includes(t.totale)) {
          data[t.year][montweek] = t
          month_weeks.add(montweek)
        }
      })
  month_weeks = Array.from(month_weeks)
  const years = Object.keys(data);

  const series = month_weeks.map(m => ({
    name: m,
    data: years.map(y => data[y][m]?.totale || null),
    fulldata: years.map(y => data[y][m])
  }))

  const state = {
    options: {
      chart: {id: "basic-bar", animations: {enabled: false},},
      xaxis: {categories: years},
      markers: {size: 7,},
      stroke: {curve: 'smooth'},
      colors: commonColors
    },
    series: series
  }

  return <>
    <TitleBox title="TilStat" />

    <Row>
      <p>
        In questa pagina ci sono alcune statistiche relative al TIL, il test di ingresso del Politecnico di
        Torino. Per ciascun anno accademico è riportato il punteggio minimo per entrare in un corso ad una certa
        chiamata. Andando avanti con le chiamate, ovviamente, il punteggio tende a diminuire. Se ci sono più chiamate nell'arco della stessa settimana, queste vengono ragruppate, così da avere risultati confrontabili tra un anno e l'altro. Attenzione: questo è un
        progetto
        non-ufficiale e potrebbe contenere errori.
      </p>

      <b>Seleziona il corso:</b>
      <SelectCourse courses={all_courses} course={course} setCourse={setCourse}/>
    </Row>
    <Row>
      <StatTable id="tilstat_table" series={series} years={years}/>
    </Row>
    <Row>
      <p>
        Di seguito, i dati plottati. Passa il mouse o clicka sui punti per vederne il dettaglio.
      </p>
      <Chart
          options={state.options}
          series={state.series}
          type="line"
          width="100%"
          height="400px"
      />
    </Row>
    <Row>
      <h3>Hall of Fame</h3>
      <p>
        Come è cambiata la difficoltà del TIL negli anni? Qual è il corso più ambito?
      </p>
      <p>
        <Link to="/tilstat/hof">
          <Button variant="info" size="sm" style={{width: 'initial'}}>
            Apri la Hall of Fame
          </Button>
        </Link>
      </p>
      <h3>Perché a volte il punteggio sale nell'arco di un anno?</h3>
      <p>
        Ci si aspetta che ad ogni chiamata <b>il punteggio richiesto sia sempre minore del precedente</b>, ma questo
        talvolta non è vero. Ad esempio, nella graduatoria di <b>Pianificazione del 2020/21</b>, il 11/09/20
        vengono chiamati tutti gli studenti con punteggio tra 23.81 e 42.86. Tuttavia, nessuno con punteggio tra 23.81 e
        26.79 accetta il posto. <b>In graduatoria non ci sono altri studenti, quindi non c'è scorrimento</b>: di conseguenza al
        23/10/20 risulta che la graduatoria sia arrivata "solo" a 26.79, mentre il realtà gli studenti che desideravano
        immatricolarsi sono stati tutti presi.
      </p>
      <p>
        <Button variant="info" size="sm" style={{width: 'initial'}}
                onClick={() => {
                  setCourse(all_courses.indexOf("PIANIFICAZIONE"))
                  scroll.scrollToTop();
                }}>
          Apri le statistiche di Pianificazione del 20/21
        </Button>
      </p>
    </Row>
  </>
}

const StatTable = ({series, years, className}) => {

  const [linkEnabled, setLinkEnabled] = useState(false)

  return <Table responsive className={className}>
    <thead>
    <tr>
      <th>
        Punteggio minimo richiesto per entrare
      </th>
      {years.map((y, i) => (
          <th key={i}>
            {y}
          </th>
      ))}
    </tr>
    </thead>
    <tbody>
    {series?.map((s, i) => <tr key={i}>
      <td>
        <div className="point-pill" style={{backgroundColor: commonColors[i]}}></div>
        {' '}{s.name}
      </td>
      {s.fulldata.map((v, j) =>
          !linkEnabled ? <td key={i + ' ' + j}>{v?.totale.toFixed(2)}</td> :
              <td key={i + ' ' + j}><a target="_blank" href={v?.uri} rel="noreferrer">{v?.totale.toFixed(2)}</a></td>
      )}
    </tr>)}
    <tr>
      <td colSpan={years.length + 1} style={{textAlign: 'right'}}>
        <Form.Check
            type="switch"
            id="custom-switch"
            label="Link graduatorie"
            value={linkEnabled}
            onChange={e => setLinkEnabled(e.target.checked)}
            style={{display: 'inline-block'}}
        />
      </td>
    </tr>
    </tbody>
  </Table>
}

const SelectCourse = ({courses, course, setCourse}) => {

  const options = courses.map((c, i) => ({value: i, label: c}))

  return <>
    <Select
        className="basic-single"
        classNamePrefix="select"
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isRtl={false}
        isSearchable={true}
        options={options}
        name="color"
        value={options[course]}
        onChange={e => setCourse(e.value)}
    />
  </>

}
