let distances = []
let positions = []
let flag = "start"
let id


const pDist = document.querySelector("#distance")


function euclidean(point1, point2){
    return(
        Math.sqrt(
            (point1.x - point2.x)*(point1.x - point2.x) +
            (point1.y - point2.y)*(point1.y - point2.y) +
            (point1.z - point2.z)*(point1.z - point2.z)
        )
    )
}

function sum(total, num){
    return total + num
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
    distances.push(distance/1000)
    pDist.innerText = (distances.reduce(sum)).toFixed(2) + "Km" 

}

function getPosition(position){
    position = position.coords
    if(positions.length == 2){
        getDistance(positions[0], positions[1])
        positions = []
    }
    else{
        positions.push(position)
    }
}

function error(err){
    console.log(err)
}

window.onload = ()=>{
    const button = document.querySelector("button")

    button.addEventListener("click", (e)=>{
        if(flag == "start"){
            flag = "stop"
            if(navigator.geolocation){
                button.innerText = "Stop"
                pDist.innerText = ""
                id = setInterval(()=>{
                    navigator.geolocation.getCurrentPosition(getPosition, error, {
                        enableHighAccuracy: true,
                        maximumAge: 1000,
                    })
                }, 1000)
            }
        }
        else{
            clearInterval(id)
            let total = 0
            flag = "start"
            total = distances.reduce(sum)
            pDist.innerText = (total).toFixed(2) + " Km"
            distances = []
            button.innerText = "Start"
        }
    })
}