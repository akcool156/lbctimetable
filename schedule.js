const bellSchedule = {
Mon: [
{ name:"Period 1", start:"08:45", end:"09:45"},
{ name:"Period 2", start:"09:50", end:"10:50"},
{ name:"Interval", start:"10:50", end:"11:20"},
{ name:"Period 3", start:"11:20", end:"12:20"},
{ name:"Period 4", start:"12:25", end:"13:25"},
{ name:"Lunch", start:"13:25", end:"14:15"},
{ name:"Period 5", start:"14:15", end:"15:15"}
],

Wed: [
{ name:"Period 1", start:"09:10", end:"10:05"},
{ name:"Period 2", start:"10:10", end:"11:05"},
{ name:"Interval", start:"11:05", end:"11:35"},
{ name:"Period 3", start:"11:35", end:"12:30"},
{ name:"Period 4", start:"12:35", end:"13:30"},
{ name:"Lunch", start:"13:30", end:"14:20"},
{ name:"Period 5", start:"14:20", end:"15:15"}
]
}

bellSchedule.Tue = bellSchedule.Mon
bellSchedule.Thu = bellSchedule.Mon
bellSchedule.Fri = bellSchedule.Mon

function parseTime(t){
const [h,m]=t.split(":").map(Number)
const d=new Date()
d.setHours(h,m,0,0)
return d
}

function getBlock(){

const now=new Date()
const day=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getDay()]
const schedule=bellSchedule[day] || []

for(let i=0;i<schedule.length;i++){

const start=parseTime(schedule[i].start)
const end=parseTime(schedule[i].end)

if(now>=start && now<end){

return{
current:schedule[i],
next:schedule[i+1],
start,
end,
day
}

}

}

return null

}
