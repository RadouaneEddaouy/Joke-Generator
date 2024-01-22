const authorInput = document.getElementById("authorInput");
const JokeInput = document.getElementById("JokeInput");
const resetBtn = document.getElementById("resetBtn");
const generateBtn = document.getElementById("generateBtn");
const submitBtn = document.getElementById("submitBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const span = document.getElementById("span");
const ul = document.getElementById("ul");
const auErr = document.getElementById("auErr");
const jokeErr = document.getElementById("jokeErr");
const url = "http://localhost:3000/jokes";
const api = "https://api.chucknorris.io/jokes/random";

deleteAllBtn.addEventListener("click", () => {
  ul.innerText = "";
});

let vider = () => {
  authorInput.value = "";
  JokeInput.value = "";
};
resetBtn.addEventListener("click", () => {
  vider();
});
deleteAllBtn.addEventListener("click", () => {
  const ajax = new XMLHttpRequest();
  ajax.open("delete", url + "/" + "deleteall", true);
  ajax.addEventListener("load", () => {
    if (ajax.status == 200) return (ul.innerText = "");
    alert("error deleting the jokes");
  });
  ajax.send();
});

JokeInput.addEventListener("keypress", () => {
  if (!JokeInput || JokeInput.value.length < 5) {
    submitBtn.style.cursor = "not-allowed";
    jokeErr.innerText = "Joke is required and must be at least 5 caracters";
  } else jokeErr.innerText = "";
});
const ajouter = (ele) => {
  let { id, author, joke, likes } = ele;

  let li = document.createElement("li");
  let divLikes = document.createElement("div");
  let spanNumbers = document.createElement("span");
  let divContent = document.createElement("div");
  let h3 = document.createElement("h3");
  let p = document.createElement("p");
  let divBtns = document.createElement("div");
  let deleteBtn = document.createElement("button");
  let likeBtn = document.createElement("button");
  deleteBtn.style.cursor = "pointer";
  likeBtn.style.cursor = "pointer";
  let ilike = document.createElement("i");
  let idelete = document.createElement("i");
  ilike.setAttribute("class", "fa-regular fa-thumbs-up");
  idelete.setAttribute("class", "fa-solid fa-delete-left");
  ul.appendChild(li);
  li.appendChild(divLikes);

  li.appendChild(divContent);
  li.appendChild(divBtns);
  divLikes.appendChild(spanNumbers);
  divLikes.classList.add("likes");
  divContent.appendChild(h3);
  divContent.classList.add("content");
  divContent.appendChild(p);

  divBtns.appendChild(deleteBtn);
  divBtns.appendChild(likeBtn);
  divBtns.classList.add("btns");

  deleteBtn.classList.add("delete");
  deleteBtn.appendChild(idelete);
  likeBtn.appendChild(ilike);
  likeBtn.classList.add("likeBtn");
  h3.innerText = author;
  p.innerText = joke;
  spanNumbers.innerText = likes;
  divLikes.innerText = spanNumbers.innerText + " likes";
  span.innerText = ul.children.length;

  //   console.log("test :   " + document.getElementsByClassName("likes").length);
  deleteBtn.addEventListener("click", () => {
    deleteFromServer(
      id,
      () => {
        li.remove();
      },
      () => {
        alert("error deleting the 'joke'");
      }
    );
  });
  likeBtn.addEventListener("click", () => {
    likes++;
    spanNumbers.innerText = likes;
    console.log(spanNumbers.innerText);
    const xhr = new XMLHttpRequest();
    xhr.open("put", url + "/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
      if (xhr.status != 200) return alert("error" + xhr.response);
    });
    xhr.addEventListener("error", () => {
      alert("error");
    });
    let dataPutToSend = {
      author,
      joke,
      likes,
    };
    xhr.send(JSON.stringify(dataPutToSend));
  });
};

let updatejoke = () => {
  getJoke
    .then((cnjoke) => {
      authorInput.value = "Chucknorris";
      JokeInput.value = cnjoke;
      console.log(cnjoke);
    })
    .catch((error) => {
      console.log(error.message);
    });
};
generateBtn.addEventListener("click", () => {
  updatejoke();
});

const getJoke = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", api, true);
  xhr.addEventListener("load", () => {
    if (xhr.status !== 200) {
      reject(new Error("Error loading joke"));
    } else {
      let data = JSON.parse(xhr.response);
      resolve(data.value);
    }
  });
  xhr.addEventListener("error", () => {
    reject(new Error("Network error"));
  });
  xhr.send();
});
submitBtn.addEventListener("click", () => {
  let author = authorInput.value;
  let joke = JokeInput.value;
  let likes = 0;

  if (!author) {
    auErr.innerText = "author is required";
    return;
  }

  let dataToSend = {
    author,
    joke,
    likes,
  };
  dataToSend = JSON.stringify(dataToSend);
  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("load", () => {
    if (xhr.status == 201) {
      let data = JSON.parse(xhr.response);
      ajouter(data);
      vider();
    } else {
      alert(xhr.response);
    }
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send(dataToSend);
});

const deleteFromServer = (id, reussiFn, echecFn) => {
  const ajax = new XMLHttpRequest();
  ajax.open("delete", url + "/" + id, true);
  ajax.addEventListener("load", () => {
    if (ajax.status == 200) return reussiFn();
    echecFn();
  });
  ajax.send();
};

const load = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.addEventListener("load", () => {
    if (xhr.status != 200) return alert("error loading jokes");
    let data = JSON.parse(xhr.response);
    data.forEach((ele) => ajouter(ele));
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send();
};
load();
