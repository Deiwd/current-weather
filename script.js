const q = (el)=> document.querySelector(el)
const qAll = (el)=> document.querySelectorAll(el)


let 
welcome = '',
backBackground = ''

setInterval(()=>{
    q('.bg').setAttribute('style', `height:${document.body.offsetHeight}px`)
},100)

let currentDay = q('.currentDay')

function dateHours(){

    const date = new Date()

    let
    day = date.getDate(),
    dayName = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes()

    switch(dayName){
        case 0: dayName = 'Sunday'; break;
        case 1: dayName = 'Monday'; break;
        case 2: dayName = 'Tuesday'; break;
        case 3: dayName = 'Wednesday'; break;
        case 4: dayName = 'Thursday'; break;
        case 5: dayName = 'Friday'; break;
        case 6: dayName = 'Monday'; break;
    }

    switch(month){
        case 0: month = 'Jan'; break;
        case 1: month = 'Feb'; break;
        case 2: month = 'Mar'; break;
        case 3: month = 'Apr'; break;
        case 4: month = 'May'; break;
        case 5: month = 'Jun'; break;
        case 6: month = 'Jul'; break;
        case 7: month = 'Aug'; break;
        case 8: month = 'Sep'; break;
        case 9: month = 'Oct'; break;
        case 10: month = 'Nov'; break;
        case 11: month = 'Dec'; break;
    }

    switch(hours){
        case 6: case 7: case 8: case 9: case 10: case 11:
            welcome = 'Good morning'
            backBackground = 'sunrise'

            qAll('.box').forEach((i)=>{
                i.classList.remove('clear')
            })
        break;

        case 12: case 13: case 14: case 15: case 16:
            welcome = 'Good afternoon'
            backBackground = 'afternoon'
        break;

        case 17: case 18:
            welcome = 'Good end afternoon'
            backBackground = 'sunset'
        break;

        case 19: case 20: case 21: case 22: case 23:
        case 0: case 1: case 2: case 3: case 4: case 5:
            welcome = 'Good night'
            backBackground = 'night'

            qAll('.box').forEach((i)=>{
                i.classList.add('clear')
            })
        break;
    }

    function fixZero(time){
        return time < 10 ? `0${time}` : time
    }

    q('.bg').classList.add(`${backBackground}`)

    currentDay.querySelector('.hours i').innerHTML = welcome
    currentDay.querySelector('.hours span').innerHTML = `${fixZero(hours)}h${fixZero(minutes)}`
    currentDay.querySelector('.dates').innerHTML = `${dayName}, ${month} ${day}, ${year} (GMT-3)`
}

setInterval(dateHours, 1000)

dateHours()

let
result = q('.result'),
boxResult = result.closest('.box'),
tempDiv = result.querySelector('.info .temp'),
windDiv = result.querySelector('.info .wind')

q('.searchForm').addEventListener('submit', async (event)=>{
    event.preventDefault()

    let input = q('#searchInput').value
    
    input = input.trim()

    if(input !== ''){

        showWarning('Wait a moment...')

        input = encodeURI(input)

        let req = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=ded424873d3e24799c97f76434e89562&units=metric`)
        req = await req.json()

        if(req.cod === 200){
            showWarning('Done!')

            setTimeout(()=> {
                showWarning('')

                setTimeout(()=>{
                    q('.box-warning').classList.remove('open')
                }, 300)
            }, 500)
            
            let climate = {
                name: req.name,
                temp: req.main.temp,
                country: req.sys.country,
                windAngle: req.wind.deg,
                windSpeed: req.visibility,
                icon: req.weather[0].icon
            }

            showResult(climate)

            if(boxResult.classList.contains('close')){

                boxResult.classList.add('open')

                setTimeout(()=>{
                    boxResult.setAttribute('style', 'opacity: 1;')
                }, 200)

                boxResult.classList.remove('close') 
            }            
            
            console.log(req)
        } else {
            showWarning('Not found')

            resetResult()
        }

    } else {
        showWarning('')

        resetResult()

        q('.box-warning').classList.remove('open')
    }
})

function showWarning(msg){
    q('.box-warning').classList.add('open')

    setTimeout(()=>{
        q('.warning').innerHTML = msg
    }, 300)
}

function showResult(climate){

    const speedProcess = climate.windSpeed.toString()

    let 
    speedFirst = speedProcess.slice(0, 1),
    speedDecimals = speedProcess.slice(1, 3)
    
    let 
    speed = `${speedFirst}.${speedDecimals}`
    speed = parseFloat(speed)

    result.querySelector('.title').innerHTML = `${climate.name}, ${climate.country}`

    tempDiv.querySelector('.tempInfo span').innerHTML = Math.round(climate.temp)
    tempDiv.querySelector('img').src = `icon/${climate.icon}.svg`

    windDiv.querySelector('.windInfo span').innerHTML = speed.toFixed(1)
    windDiv.querySelector('.windArea .pointer').style.transform = `rotate(${(climate.windAngle +90)}deg)`
}


function resetResult(){
    
    if(boxResult.classList.contains('open')){

        boxResult.setAttribute('style', 'opacity: 0;')

        setTimeout(()=>{
            boxResult.classList.add('close')
            boxResult.classList.remove('open')
        }, 200)

    }
    
}













