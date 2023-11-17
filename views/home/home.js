document.getElementById("uploadFile").addEventListener("click", () => {
  document.getElementById("file").style.display = "block";
  document.getElementById("folder").style.display = "none";
});
document.getElementById("createFolder").addEventListener("click", () => {
  document.getElementById("file").style.display = "none";
  document.getElementById("folder").style.display = "block";
});

// document.getElementById("file").addEventListener("sumbit",(e)=>{
// e.preventDefault();
// try{
// const data = fetch("http://localhost:1000/add-file", {
//   body: {
//    path:
//   }
// })
// }catch(err){

// }
// })
async function loadPage() {
  try {
    const data = await fetch("http://localhost:1000/home", {
      headers: {
        auth: localStorage.getItem("auth"),
      },
    });
    const data2 = await data.json();
    console.log(data2);
    const h4 = document.createElement("h4");
    h4.setAttribute("id", data2.foldername);
    h4.innerText = "Home/";
    let pathIs = "";
    document.getElementById("heading").appendChild(h4);
    document.getElementById("heading").childNodes.forEach((ele) => {
      pathIs += ele.id;
    });
    console.log(pathIs);
    listData(pathIs);
  } catch (err) {
    console.log(err);
  }
}

async function listData(path, end = null) {
  try {
    console.log(path, "<<<<<<<");
    document.getElementById("loading").style.display = "flex";
    const data = await fetch("http://localhost:1000/get-list", {
      headers: {
        auth: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: path }),
      method: "post",
    });
    const data2 = await data.json();
    console.log(data2);
    let str = "";

    if (end !== null) {
      const h4 = document.createElement("h4");
      h4.setAttribute("id", end);
      h4.innerText = end;
      document.getElementById("heading").appendChild(h4);
    }

    const obj = {};
    data2.forEach((ele) => {
      if (ele !== "") {
        if (ele.includes("/")) {
          let val = ele.split("/")[0] + "/";
          if (obj[val] == undefined) {
            obj[val] = 1;
          }
        } else {
          let val = ele.split("/")[0];
          if (obj[val] == undefined) {
            obj[val] = 1;
          }
        }
      }
    });
    for (let key in obj) {
      let st;
      if (key[key.length - 1] === "/") {
        st = "folder";
      } else {
        st = "file";
      }
      str += `
     
    <div class="datalist">
      <h4 class="${st} link">${key}</h4>
      <button class="delete">delete</button
      >
    </div>
  `;
    }
    document.getElementById("datainside").innerHTML = str;
    document.getElementById("loading").style.display = "none";
  } catch (err) {
    console.log(err);
  }
}
loadPage();

document.getElementById("datainside").addEventListener("click", (e) => {
  if (e.target.classList.contains("folder")) {
    let url = "";
    document.getElementById("heading").childNodes.forEach((ele) => {
      url += ele.id;
    });
    url += e.target.innerText;
    listData(url, e.target.innerText);
  } else if (e.target.classList.contains("file")) {
    let url = "https://s3.amazonaws.com/file.manager.app/";
    document.getElementById("heading").childNodes.forEach((ele) => {
      url += ele.id;
    });
    url += e.target.innerText;
    console.log(url);
    window.open(url, "_blank");
  }
});

document.getElementById("heading").addEventListener("click", (e) => {
  if (e.target.id !== "heading") {
    let url = "";
    let str = "";
    let text = "";
    e.target.parentElement.childNodes.forEach((ele, ind) => {
      console.log(ele.id, e.target.id, ele.id === e.target.id);
      if (ind === 0) {
        text = "Home/";
      } else {
        text = ele.id;
      }
      url += ele.id;
      str += `<h4 id="${ele.id}">${text}</h4>`;
      if (ele.id === e.target.id) {
        document.getElementById("heading").innerHTML = str;
        return;
      }
    });
    listData(url);
  }
});

document.getElementById("folder").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    document.getElementById("loading").style.display = "flex";
    let path = "";
    document.getElementById("heading").childNodes.forEach((ele) => {
      path += ele.id;
    });
    path = path.slice(0, path.length - 1);
    console.log(path);
    const data = await fetch("http://localhost:1000/add-folder", {
      headers: {
        auth: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: path,
        folder: document.getElementById("folderInp").value,
      }),
      method: "post",
    });
    const data2 = await data.json();
    console.log(data2);
    document.getElementById("loading").style.display = "none";
    listData(path + "/");
  } catch (err) {
    console.log(err);
  }
});

document.getElementById("file").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let url;
    let file = document.getElementById("fileInp");
    if (file.files[0]) {
      console.log(file.files[0].type);
      document.getElementById("loading").style.display = "flex";
      let path = "";
      console.log(document.getElementById("heading").childNodes);
      document.getElementById("heading").childNodes.forEach((ele) => {
        path += ele.id;
      });
      url = path;
      path += file.files[0].name;

      const data = await fetch("http://localhost:1000/add-file", {
        headers: {
          auth: localStorage.getItem("auth"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: path,
          name: file.files[0].name,
          size: file.files[0].size,
        }),
        method: "post",
      });
      const data2 = await data.json();
      console.log(data2);
      const upload = await fetch(data2, {
        method: "put",
        body: file.files[0],
        headers: {
          "Content-Type": `${file.files[0].type}`,
        },
      });
      console.log(upload);
      listData(url);
      document.getElementById("loading").style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
});

document.getElementById("datainside").addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    if (confirm("Are you sure!!")) {
      try {
        let url;
        let path = "";
        console.log(document.getElementById("heading").childNodes);
        document.getElementById("heading").childNodes.forEach((ele) => {
          path += ele.id;
        });
        console.log(e.target.previousElementSibling.innerText);
        url = path;
        path += e.target.previousElementSibling.innerText;
        document.getElementById("loading").style.display = "flex";
        const data = await fetch("http://localhost:1000/delete", {
          headers: {
            auth: localStorage.getItem("auth"),
            path: path,
          },

          method: "delete",
        });
        const data2 = await data.json();
        console.log(data2);
        document.getElementById("loading").style.display = "none";
        listData(url);
      } catch (err) {
        console.log(err);
      }
    }
  }
});
