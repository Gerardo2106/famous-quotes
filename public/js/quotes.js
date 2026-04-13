document.querySelector("#close").addEventListener("click", () => { document.querySelector("#authorDialog").close(); });


let authLink = document.querySelectorAll(".authorName");
for (let i of authLink) {
    i.addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const authorId = link.dataset.authorid || link.getAttribute("data-authorid");
    if (!authorId) {
        console.error("Author ID missing on author link:", link);
        return;
    }
    let url = "/api/author/" + authorId;
    try {
        let response = await fetch(url);
        let data = await response.json();
        document.querySelector("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
        document.querySelector("#authorPicture").src = data[0].portrait;
        document.querySelector("#authorProfession").textContent = "Profession: " + data[0].profession;
        document.querySelector("#authorCountry").textContent = "Country: " + data[0].country;
        document.querySelector("#authorDob").textContent = "Born: " + data[0].dob;
        document.querySelector("#authorDod").textContent = data[0].dod ? "Died: " + data[0].dod : "";
        document.querySelector("#authorSex").textContent = "Sex: " + data[0].sex;
        document.querySelector("#authorBiography").textContent = data[0].biography;
        document.querySelector("#authorDialog").showModal();
    } catch (err) {
        console.error("Failed to load author info:", err);
    }
}