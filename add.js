const setup=document.getElementById("setup")
const viewer=document.getElementById("viewer")

const setupForm=document.getElementById("setupForm")
const yearGroup=document.getElementById("yearGroup")

const saveBtn=document.getElementById("saveBtn")
const resetBtn=document.getElementById("resetBtn")

const currentEl=document.getElementById("current")
const nextEl=document.getElementById("next")

const datetimeEl=document.getElementById("datetime")

const dayProgress=document.getElementById("dayProgress")
const periodProgress=document.getElementById("periodProgress")

const dayLeft=document.getElementById("dayLeft")
const periodLeft=document.getElementById("periodLeft")

const days=["Monday","Tuesday","Wednesday","Thursday","Friday"]

function createInput(day,period){

return `<input placeholder="${day} Period ${period}" data-day="${day}" data-period="${period}">`

}

yearGroup.onchange=()=>{

setupForm.innerHTML=""

days.forEach(day=>{

for(let p=1;p<=5;p++){

setupForm.innerHTML+=createInput(day,p)

}

})

}

saveBtn.onclick=()=>{

const inputs=setupForm.querySelectorAll("input")

let timetable={}

for(const i of inputs){

if(!i.value.trim()){
alert("Fill all subjects")
return
}

const d=i.dataset.day
const p=i.dataset.period

if(!timetable[d]) timetable[d]={}

timetable[d][p]=i.value

}

localStorage.setItem("timetable",JSON.stringify(timetable))

showViewer()

}

resetBtn.onclick=()=>{

localStorage.clear()
location.reload()

}

function showViewer(){

setup.classList.add("hidden")
viewer.classList.remove("hidden")

updateLoop()

}

function showSetup(){

setup.classList.remove("hidden")
viewer.classList.add("hidden")

}

function updateLoop(){

const timetable=JSON.parse(localStorage.getItem("timetable"))

const now=new Date()

datetimeEl.textContent=now.toLocaleString()

const block=getBlock()

if(!block){

currentEl.textContent="No school"
nextEl.textContent=""

return

}

const today=now.toLocaleDateString('en-NZ',{weekday:'long'})

let periodNum=block.current.name.replace("Period ","")

if(block.current.name.includes("Period")){

currentEl.textContent=timetable[today][periodNum]

}else{

currentEl.textContent=block.current.name

}

if(block.next){

nextEl.textContent=block.next.name

}else{

nextEl.textContent="End of day"

}

const nowTime=now.getTime()

const periodTotal=block.end-block.start
const periodElapsed=nowTime-block.start

periodProgress.value=(periodElapsed/periodTotal)*100

const periodRemaining=Math.max(0,block.end-nowTime)

periodLeft.textContent=Math.floor(periodRemaining/60000)+"m"

setTimeout(updateLoop,1000)

}

if(localStorage.getItem("timetable")){

showViewer()

}else{

showSetup()

}
