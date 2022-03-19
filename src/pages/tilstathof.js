import {Alert, Button, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {TilStatHofAmbito} from "./tilstathof-ambito";
import React, {useState} from "react";
import punteggi from "../data/tilstathof_punteggioanni.json"
import {TitleBox} from "../elements/navbars";

const {tutti, entrati} = punteggi

export const TilStatHof = () => {

  return <>
    <TitleBox title="TilStat" subtitle="Hall Of Fame" />

    <Row>
      <h4>Qual è il corso più ambito?</h4>
      <p>
        Nel grafico sono riportati i flussi di studenti per i corsi più ambiti di ciascun anno. Il numero di persone che
        ambiscono ad un corso è calcolato sulla prima graduatoria dell'anno, in base a quanti hanno inserito il corso
        tra le preferenze. Con il cambio di graduatoria del 21/22 non è più possibile desumere l'ordine delle
        preferenze, di conseguenza queste hanno tutte pari peso. Il numero di corsi massimi per anno è personalizzabile
        dalla casella di inserimento.
      </p>
      <TilStatHofAmbito/>
    </Row>

    <Row>
      <h4>Come cambia il TIL negli anni?</h4>
      <p>
        Le dinamiche di accesso al Politecnico di Torino più volte sono state cambiate negli anni. La "soglia di
        garanzia" è stata innalzata, le tipologie di domande cambiate. Per l'accesso nell'anno 21/22 è stato operato un
        radicale cambiamento, facendo graduatorie di corso in corso anziché uniche. Per quanto riguarda architettura, i
        dati sono presenti dal solo 20/21: il test era prima a livello nazionale.
      </p>

      <InfoTable title="Profilo degli aspiranti" data={tutti}/>

      <InfoTable title="Profilo degli immatricolati" data={entrati}/>

      <p>
        Si osserva che il punteggio medio rimane pressoché costante nel periodo 2019 - 2022, con lieve crescita. Ciò è
        dovuto probabilmente: 1. alla miglior strategia comunicativa del Politecnico, che ha attratto studenti più
        preparati ai test; 2. all'inevitabile processo di diffusione delle domande per passaparola.
      </p>
    </Row>
    <Row>
      <h4>Inflazione del punteggio</h4>
      <p>
        Se avessi svolto il test in un'altro anno, come sarebbe andata? <br/>
        Per scoprirlo occorre fare due normalizzazioni. La prima rispetto alla distribuzione dei punteggi, che cambiano
        di anno in anno al variare del database delle domande; questo primo passaggio risponde alla domanda: <i><b>a
        parità di preparazione, che punteggio avrei conseguito in un altr'anno?</b></i>. La seconda osserva invece un
        aspetto macroscopico: con il cambiare delle regole di ammissione e del numero dei partecipanti, a parità di
        punteggio normalizzato, può risultare più difficile o più facile entrare da un anno all'altro. Si ri-normalizza
        quindi rispetto al punteggio dei soli immatricolati. Questo secondo passaggio risponde alla domanda: <i><b>se avessi concorso un altr'anno, avrei avuto le stesse possibilità di chi nel mio anno ha fatto quale punteggio?</b></i>. Ps: entrambe i conti solo <b>fortemente approssimativi</b>; sto lavorando ad una versione del tool che confronti l'intero dataset anziché le sole medie e varianze.
      </p>
      <TilInflation/>
    </Row>

  </>
}

const norm = (x, m, s) => (x - m) / s
const denorm = (x, m, s) => x * s + m
const renorm = (x, m1, s1, m2, s2) => denorm(norm(x, m1, s1), m2, s2)

const TilInflation = () => {

  const [year, setYear] = useState(2018)
  const [point, setPoint] = useState(39.52)
  let year_i = tutti.findIndex(t => t.year === year)
  year_i = year_i > -1 ? year_i : 0

  const mean_st = t=>[t.avg, Math.sqrt(t.variance)]
  const [mt, st] = mean_st(tutti[year_i])
  const [mi, si] = mean_st(entrati[year_i])

  const _tutti = tutti.map(mean_st)
  const _entrati = entrati.map(mean_st)

  const equi = _tutti.map(p => renorm(point, mt,st,p[0],p[1]))

  const equipox = equi.map((p,i) => renorm(
      equi[i], _entrati[i][0],_entrati[i][1],mi,si))

  return <>
    <p>
      <b>Punteggio ed anno di riferimento:</b>
    </p>
    <InputGroup>

      <Form.Control
          style={{width: 'initial'}}
          type="number"
          value={point}
          onChange={e => setPoint(parseFloat(e.target.value))}
      />

      <Form.Select
          style={{width: 'initial'}}
          type="text"
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
      >
        {tutti.map(t => <option value={t.year}>{t.year}</option>)}
      </Form.Select>
    </InputGroup>

    <Table responsive>
      <thead>
      <tr>
        <th style={{width: "30%"}}>&nbsp;</th>
        {tutti.map(p => <th style={{textAlign: 'right'}}>{p.year}</th>)}
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Punteggio equivalente</td>
        {equi.map(p => <td align="right">
          {p.toFixed(2)}
        </td>)}
      </tr>
      <tr>
        <td>Possibilità equivalente</td>
        {equipox.map(p => <td align="right">{p.toFixed(2)}</td>)}
      </tr>
      </tbody>
    </Table>
  </>
}

const InfoTable = ({data, title}) => {

  return <Table responsive>
    {<thead>

    <tr>
      <th style={{width: "30%"}}>{title}</th>
      {data.map(p => <th style={{textAlign: 'right'}}>{p.year}</th>)}
    </tr>
    </thead>}
    <tbody>
    <tr>
      <td>N° Studenti</td>
      {data.map(p => <td align="right">{p.cnt}</td>)}
    </tr>
    <tr>
      <td>Punteggio Medio</td>
      {data.map(p => <td align="right">{p.avg.toFixed(2)}</td>)}
    </tr>
    <tr>
      <td>Punteggio DevSt</td>
      {data.map(p => <td align="right">{Math.sqrt(p.variance).toFixed(2)}</td>)}
    </tr>
    </tbody>
  </Table>
}



















