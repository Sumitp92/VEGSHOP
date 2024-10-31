async function formSubmit(event) {
  event.preventDefault();
  const veg = {
    name: event.target.name.value,
    price: event.target.price.value,
    quantity: parseInt(event.target.quantity.value),
  };

  //axios post
  let res;
  try {
    res = await axios.post("apiKey/shop", veg);
    console.log(res.data);
  } catch (err) {
    console.log("Error:", err);
  }
  
  // Clearing the input fields after submission
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";

  showOnScreen(res.data);
  updateCount();
}


window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get("apiKey/shop"); // get
    res.data.forEach((veg) => {
      showOnScreen(veg);
    });
    updateCount();
  } catch (err) {
    console.log("Error:", err.message);
  }
});

function showOnScreen(veg) {
  // Create a list item
  const item = document.createElement("li");
  item.innerHTML = `${veg.name} Rs. ${veg.price} ${veg.quantity} KG`;

  const input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("min", "1");
  input.setAttribute("placeholder", "Amount");
  item.appendChild(input);

  const buyBtn = document.createElement("button");
  buyBtn.textContent = "Buy";
  item.appendChild(buyBtn);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  item.appendChild(delBtn);

  const vegList = document.querySelector("ul");
  vegList.appendChild(item);

  delBtn.addEventListener("click", (event) => {
    remove(event, vegList, veg);
  });

  buyBtn.addEventListener("click", () => {
    buyItem(veg, input, item, vegList);
  });
}

function updateCount() {
  const vegList = document.querySelector("ul");
  const totalElement = document.getElementById("total");
  const total = vegList.children.length;
  totalElement.textContent = `Total Items: ${total}`;
}

async function remove(event, vegList, veg) {
  vegList.removeChild(event.target.parentElement);
  updateCount();
  await deleteItem(veg);
}

function buyItem(veg, input, item, vegList) {
  const buyAmt = parseInt(input.value);
  const currentQty = parseInt(veg.quantity);
  if (!isNaN(buyAmt) && buyAmt > 0) {
    if (buyAmt <= currentQty) {
      veg.quantity = currentQty - buyAmt;
      item.firstChild.nodeValue = `${veg.name} Rs. ${veg.price} ${veg.quantity} KG`;
      input.value = "";

      if (veg.quantity === 0) {
        vegList.removeChild(item);
        deleteItem(veg);
        updateCount();
      } else {
        updateQty(veg);
      }
    } else {
      alert("Not Enough Quantity.");
    }
  } else {
    alert("Please Enter Valid Quantity.");
  }
}

async function updateQty(veg) {
  try {
    const res = await axios.put(`apiKey/shop/${veg._id}`, {
      name: veg.name,
      price: veg.price,
      quantity: veg.quantity,
    });
    console.log(res);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

async function deleteItem(veg) {
  try {
    const res = await axios.delete(`apiKey/shop/${veg._id}`);
    console.log(res);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
