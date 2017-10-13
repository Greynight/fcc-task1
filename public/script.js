const drawList = (data) => {
  const listItems = data.map((item) => {
    return `<li>${item.text}</li>`;
  });
  
  $("#list").html(listItems);
};

const saveDream = () => {
  const dreamText = $("#input-dream")[0].value;
  const data = new FormData();
  data.append("json", JSON.stringify({text: dreamText}));

  fetch("/save", {
    method: "POST",
    body: data
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    drawList(data);
    $("#input-dream")[0].value = null;
  })
  .catch((err) => {
    console.error(JSON.stringify(err))
  });
};

window.onload = () => {
  let dreams = [];
  
  fetch('/dreams').then((response) => {
    return response.json();
  }).then((data) => {
    drawList(data);
  });
}