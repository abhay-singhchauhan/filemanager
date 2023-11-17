const form = document.querySelector("form");
const input = document.querySelectorAll("input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    email: input[0].value,
    password: input[1].value,
  };
  console.log(input);
  const res = await fetch("http://localhost:1000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const res2 = await res.json();
  if (res2.problem === "Success") {
    localStorage.setItem("auth", res2.auth);
    window.location = "../home/home.html";
  }
  console.log(res2);
});
