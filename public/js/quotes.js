document.querySelector("#close").addEventListener("click", () => { document.querySelector("#authorDialog").close(); });


let authLink = document.querySelectorAll(".authorName");
for (let i of authLink) {
    i.addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo() {
    let authorId = this.getAttribute("authorId");
    // alert("displaying author info.." + authorId);
    let url = "/api/author/" + authorId;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data[0].firstName);
    document.querySelector("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
    document.querySelector("#authorPicture").src = data[0].portrait;
    document.querySelector("#authorDialog").showModal();
}