let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const divCollect = document.getElementById("toy-collection");

function getToys() {
    return fetch("http://localhost:3000/toys")
        .then(response => response.json());
}

function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.innerText = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.innerText = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.innerText = "Like";
    likeBtn.addEventListener("click", () => {
        const toyLikes = divCollect.querySelector(`#${toy.id} p`);
        const currentLikes = parseInt(toyLikes.innerText.split(" ")[0]);
        const newLikes = currentLikes + 1;
        toyLikes.innerText = `${newLikes} Likes`;

        fetch(`http://localhost:3000/toys/${toy.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ likes: newLikes })
        })
        .then(response => response.json())
        .then(updatedToy => console.log("Toy updated:", updatedToy))
        .catch(error => console.error("Error updating toy:", error));
    });

    card.append(h2, img, p, likeBtn);
    divCollect.appendChild(card);
}

function addNewToy(toyData) {
    fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: toyData.name.value,
            image: toyData.image.value,
            likes: 0
        })
    })
    .then(response => response.json())
    .then(newToy => renderToy(newToy))
    .catch(error => console.error("Error adding toy:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    getToys().then(toys => {
        toys.forEach(toy => renderToy(toy));
    });

    const toyForm = document.querySelector(".add-toy-form");
    toyForm.addEventListener("submit", event => {
        event.preventDefault();
        addNewToy(toyForm);
        toyForm.reset();
    });
});
