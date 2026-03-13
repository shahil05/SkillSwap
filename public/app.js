/* ---------------- REGISTER USER ---------------- */

async function register(){

const name = document.getElementById("name").value
const email = document.getElementById("email").value
const password = document.getElementById("password").value
const offer = document.getElementById("offer").value
const want = document.getElementById("want").value

await fetch("/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name:name,
email:email,
password:password,
skillsOffered:[offer],
skillsWanted:[want]

})

})

alert("User Registered Successfully")

}


/* ---------------- LOAD USERS (DASHBOARD) ---------------- */

async function loadUsers(){

const res = await fetch("/users")

const users = await res.json()

const container = document.getElementById("users")

container.innerHTML=""

users.forEach(user=>{

const div = document.createElement("div")

div.className="user-card"

div.innerHTML=`

<h3>${user.name}</h3>

<p>Email: ${user.email}</p>

<p>
Offers:
${user.skillsOffered.map(skill=>`<span class="skill">${skill}</span>`).join("")}
</p>

<p>
Wants:
${user.skillsWanted.map(skill=>`<span class="skill">${skill}</span>`).join("")}
</p>

<p>⭐ Rating: 4.5</p>

<a href="profile.html?id=${user._id}">
<button class="btn btn-primary">View Profile</button>
</a>

<button class="btn btn-green" onclick="sendRequest('${user._id}')">
Send Swap
</button>

`

container.appendChild(div)

})

}


/* ---------------- SEND SWAP REQUEST ---------------- */

async function sendRequest(id){

await fetch("/swap-request",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

fromUser:"demoUser",
toUser:id

})

})

alert("Swap Request Sent")

}


/* ---------------- SEARCH SKILL ---------------- */

async function searchSkill(){

const skill = document.getElementById("skillInput").value

const res = await fetch("/search?skill="+skill)

const users = await res.json()

const container = document.getElementById("results")

container.innerHTML=""

users.forEach(user=>{

container.innerHTML += `

<div class="card">

<h3>${user.name}</h3>

<p>
Offers:
${user.skillsOffered.join(", ")}
</p>

<p>
Wants:
${user.skillsWanted.join(", ")}
</p>

</div>

`

})

}


/* ---------------- LOAD SWAP REQUESTS ---------------- */

async function loadRequests(){

const res = await fetch("/swap-requests")

const requests = await res.json()

const container = document.getElementById("requests")

container.innerHTML=""

requests.forEach(req=>{

const div=document.createElement("div")

div.className="card"

div.innerHTML=`

<p>${req.fromUser} ➜ ${req.toUser}</p>

<p>Status: ${req.status}</p>

`

container.appendChild(div)

})

}