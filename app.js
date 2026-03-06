const settingsBtn=document.getElementById("settingsBtn")
const viewer=document.getElementById("viewer")
const settings=document.getElementById("settings")

const editor=document.getElementById("editor")

const saveBtn=document.getElementById("saveBtn")
const resetBtn=document.getElementById("resetBtn")

const currentBox=document.getElementById("currentClass")
const nextBox=document.getElementById("nextClass")

const datetime=document.getElementById("datetime")

const icsUpload=document.getElementById("icsUpload")

const days=["Monday","Tuesday","Wednesday","Thursday","Friday"]

settingsBtn.onclick=()=>{

settings.classList.toggle("hidden")
viewer.classList.toggle("hidden")

}


function buildEditor(){

editor.innerHTML=""

days.forEach(day=>{

for(let p=1;p<=5;p++){

editor.innerHTML+=`

<div class="editorRow">

<h3>${day} Period ${p}</h3>

<input placeholder="Subject"
data-day="${day}"
data-period="${p}"
data-field="subject">

<input placeholder="Teacher (optional)"
data-day="${day}"
data-period="${p}"
data-field="teacher">

<input placeholder="Room/Class (optional)"
data-day="${day}"
data-period="${p}"
data-field="room">

</div>

`

}

})

}


saveBtn.onclick=()=>{

const inputs=document.querySelectorAll("input[data-field]")

let timetable={}

inputs.forEach(i=>{

const d=i.dataset.day
const p=i.dataset.period
const f=i.dataset.field

if(!timetable[d]) timetable[d]={}
if(!timetable[d][p]) timetable[d][p]={}

timetable[d][p][f]=i.value

})

localStorage.setItem("timetable",JSON.stringify(timetable))

alert("Timetable Saved!")

}


resetBtn.onclick=()=>{

localStorage.clear()
location.reload()

}


function detectPeriod(startTime){

const [h,m]=startTime.split(":").map(Number)

const minutes=h*60+m

const periods=[

{p:1,start:525,end:585},
{p:2,start:590,end:650},
{p:3,start:680,end:740},
{p:4,start:745,end:805},
{p:5,start:855,end:915}

]

for(const period of periods){

if(minutes>=period.start && minutes<=period.end){

return period.p

}

}

return null

}


function parseICS(data){

const events=data.split("BEGIN:VEVENT")

let timetable={}

events.forEach(e=>{

const summary=e.match(/SUMMARY:(.*)/)
const start=e.match(/DTSTART:(.*)/)
const location=e.match(/LOCATION:(.*)/)
const desc=e.match(/DESCRIPTION:(.*)/)

if(!summary || !start) return

const subject=summary[1].trim()

const teacher=desc ? desc[1].trim() : ""

const room=location ? location[1].trim() : ""

const dateStr=start[1].substring(0,8)

const timeStr=start[1].substring(9,13)

const hour=timeStr.substring(0,2)
const minute=timeStr.substring(2,4)

const startTime=`${hour}:${minute}`

const date=new Date(dateStr.substring(0,4),dateStr.substring(4,6)-1,dateStr.substring(6,8))

const day=date.toLocaleDateString("en-NZ",{weekday:"long"})

const period=detectPeriod(startTime)

if(!period) return

if(!timetable[day]) timetable[day]={}

timetable[day][period]={

subject,
teacher,
room

}

})

localStorage.setItem("timetable",JSON.stringify(timetable))

alert("ICS timetable imported!")

}


icsUpload.addEventListener("change",function(){

const file=this.files[0]

if(!file) return

const reader=new FileReader()

reader.onload=e=>{

parseICS(e.target.result)

}

reader.readAsText(file)

})


function updateViewer(){

const timetable=JSON.parse(localStorage.getItem("timetable"))

if(!timetable) return

const block=getBlock()

const now=new Date()

datetime.textContent=now.toLocaleString()

if(!block){

currentBox.textContent="No School"
nextBox.textContent=""

return

}

const today=now.toLocaleDateString("en-NZ",{weekday:"long"})

if(block.current.name.includes("Period")){

const p=block.current.name.replace("Period ","")

const data=timetable?.[today]?.[p]

if(data){

currentBox.innerHTML=`
<b>${data.subject}</b>
<div class="teacher">
${data.teacher || ""} ${data.room ? "• "+data.room : ""}
</div>
`

}else{

currentBox.textContent="Free Period"

}

}else{

currentBox.textContent=block.current.name

}

if(block.next){

nextBox.textContent=block.next.name

}else{

nextBox.textContent="End of Day"

}

}


buildEditor()

setInterval(updateViewer,1000)
