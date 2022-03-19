import {Button, Form, InputGroup, Row} from "react-bootstrap";
import Chart from "react-apexcharts";
import tilstathof from '../data/tilstathof.json'
import Color from "color"
import {useState} from "react";

const AGGR = 'corso';
const all_courses = Array.from(new Set(tilstathof.map(t => t[AGGR])))
// const years = Array.from(new Set(tilstathof.map(t => t['year'])))
const commonColors = '#008FFB #00E396 #FEB019 #FF4560 #775DD0 #3F51B5 #03A9F4 #4CAF50 #F9CE1D #FF9800'
    .split(' ')
    .map(c => Color(c))

console.log("ts", commonColors.map(c=>c.hex()))

export const TilStatHofAmbito = () => {

  const [number, setNumber] = useState(2)

  const data = {}
  tilstathof.forEach(t => {
    if (!data[t.year])
      data[t.year] = []
    data[t.year].push(t)
  })

  const years = Object.keys(data)

  let bestn = years.map(y => data[y]
      .sort((c1,c2) => c2.count-c1.count)
      .map((t,i) => i < number ? t : {...t, count: null})
  )
  const cumsum = bestn.map(bn => bn.map(t => t.count).reduce((a, b) => b > 0 ? a + b : a, 0))

  bestn = bestn.map((bn,i) => bn.map(t => ({...t, count: t.count ? t.count / cumsum[i] : 0})))

  const series = all_courses
      .map(corso => ({
        name: corso,
        data: bestn.map(bn => bn.find(c => c[AGGR]===corso)).map((t,i) => [i+1,t?.count || 0])
      }))
      .filter(s => s.data.filter(([i,count]) => count > 0).length >= 1)


  const state = {

    series:  series,
    options: {
      chart: {
        type: 'area',
        height: 350,
        stacked: true,
        animations: {enabled: false}
      },
      colors: commonColors.map(c=>c.hex()),
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'solid',
        colors: commonColors.map(c=>c.lightness(90).hex()),
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      tooltip: {
        enabled: true,
        y: {
          show: true,
          formatter: (value) => {
            if (value===0) return "out"
            return (value*100).toFixed(0)+" %"
          },
        },
        /*custom: function({series, seriesIndex, dataPointIndex, w}) {
          return '<div class="arrow_box">' +
              '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
              '</div>'
        }*/
      },
      xaxis: {categories: years},
      yaxis: {
        min:0, max:1,
        labels: {
          show: true,
          formatter: (value) =>  (value*100).toFixed(0)+" %",
        },
      }
    },

  }

  return <>
      <p>
        <b>Numero di corsi per anno:</b>
        <InputGroup>
          <Form.Control
              style={{width: 'initial'}}
              type="number"
              value={number}
              onChange={e => setNumber(parseInt(e.target.value))}
          />
          <Button variant="info" onClick={() => setNumber(x=>x+1)}> + </Button>
          <Button variant="info" onClick={() => setNumber(x=>x-1)}> - </Button>
        </InputGroup>
      </p>
      <div id="chart">
        <Chart options={state.options} series={state.series} type="area" height={350} />
      </div>
  </>
}





















