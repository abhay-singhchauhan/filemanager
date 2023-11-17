const form = document.querySelector("form");
const input = document.querySelectorAll("input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    name: input[0].value,
    email: input[1].value,
    password: input[2].value,
  };
  console.log(input);
  const res = await fetch("http://localhost:1000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const res2 = await res.json();
  window.location = "../login/login.html";
  console.log(res);
  console.log(res2);
});
