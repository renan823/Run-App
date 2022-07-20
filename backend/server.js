
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

function euclidean(point1, point2){
  return(
      Math.sqrt(
          (point1.x - point2.x)*(point1.x - point2.x) +
          (point1.y - point2.y)*(point1.y - point2.y) +
          (point1.z - point2.z)*(point1.z - point2.z)
      )
  )
}

function toRad(degree){
  return degree * Math.PI/180
}

function toCartesian(latlon, R){
  const values = {x: 0, y: 0, z: 0}

  values.y = Math.sin(toRad(latlon.latitude))* R
  const r = Math.cos(toRad(latlon.latitude)) * R
  values.x = Math.sin(toRad(latlon.longitude)) * r
  values.z = Math.cos(toRad(latlon.longitude)) * r

  return values
}

function getDistance(latlon1, latlon2){
  const R = 6371000
  let cartesian_1 = toCartesian(latlon1, R)
  let cartesian_2 = toCartesian(latlon2, R)
  const distance = euclidean(cartesian_1, cartesian_2)
  return(distance/1000)
}

app.post("/", (req, res)=>{
  let positions = req.body.positions
  let distance = getDistance(positions[0], positions[1])
  res.send({value: distance})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log("Server running!")
})