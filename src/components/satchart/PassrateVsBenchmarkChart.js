import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import React, { useState } from "react"
import { getCandidate } from "./satData"

const getData = (totalCandidates) => {
  let data = []
  const SIMULATIONS = 5000

  const bestCandidates = []

  for (let _ = 0; _ < SIMULATIONS; _++) {
    const candidatesPercentages = []
    for (let i = 0; i < totalCandidates; i++) {
      candidatesPercentages.push(Math.random())
    }
    const bestCandidate = getCandidate(Math.max(...candidatesPercentages))
    bestCandidates.push(bestCandidate)
  }
  bestCandidates.sort((a, b) => a.score - b.score)
  console.log(bestCandidates)
  let i = 0
  for (let benchmarkScore = 1400; benchmarkScore <= 2400; benchmarkScore += 20) {
    while (i < bestCandidates.length && bestCandidates[i].score < benchmarkScore) {
      ++i
    }

    data.push({
      x: benchmarkScore,
      passRate: 1 - (i + 1) / bestCandidates.length
    })
  }
  return data
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div style={{ padding: "3px 8px", borderRadius: 3, backgroundColor: "rgba(23, 23, 23, 0.85)", color: "white" }}>
        <div>Benchmark Score: {label}</div>
        <div>{`Pass Rate: ${(payload[0].payload.passRate).toFixed(2)}%`}</div>
      </div>
    )
  }

  return null
}


export default props => {
  let totalCandidatesInput
  const [totalCandidates, setTotalCandidates] = useState(50)

  const handleSubmit = event => {
    console.log(event)
    event.preventDefault()
    setTotalCandidates(totalCandidatesInput)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Total Candidates:
          <input
            onChange={event => totalCandidatesInput = event.target.value}
            placeholder={50}
            type="number"
            min="1"
            max="100"
          />
        </label>
        <input type="submit" value="Submit"/>
      </form>


      <LineChart
        width={600}
        height={400}
        data={getData(totalCandidates)}
        margin={{
          top: 5, right: 30, left: 20, bottom: 40,
        }}
      ><CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey={"x"} label={{ value: "Benchmark Score", position: "bottom" }}/>
        <YAxis
          label={{
            value: "Pass Rate (%)",
            angle: -90,
            textAnchor: "middle",
          }}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Line type="monotone" dataKey="passRate" stroke="#8884d8" activeDot={{ r: 8 }}/>
      </LineChart>
    </div>
  )
}