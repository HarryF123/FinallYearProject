var selectedUser;

const selectSubjectDiv = document.getElementById('select-subject-div');

const createSubjectBtn = document.getElementById('add-subject-btn');
const createSubjectDiv = document.getElementById('add-subject-div');
const createSubjectForm = document.getElementById('add-subject-form');

const addTermBtn = document.querySelector(`#add-term-btn`);
const addTermDiv = document.querySelector(`#add-term-div`);
const addTermForm = document.querySelector(`#add-term-form`);

const detailsDisplay = document.getElementById('subject-details');

const returnBtn = document.getElementById('return-button');
const matDisplay = document.getElementById('subjectMaterial');

const editSubject = document.getElementById('edit-subject-button');
const editForm = document.getElementById('edit-subject-form');
const deleteSubject = document.getElementById('delete-subject-button');
const deleteForm = document.getElementById('delete-subject-form');

editSubject.addEventListener('click', handleEditForm);
deleteSubject.addEventListener('click', handleDeleteForm);

//Populate subjects dropdown on page load
window.addEventListener('load', function (event) {
  event.preventDefault();
  fetch('http://localhost:8080/allSubjects')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(responseText => {
      console.log(responseText);

      const subjectsJson = JSON.parse(responseText);
      for (const subject of subjectsJson) {
        const select = document.getElementById('subjects');
        const option = document.createElement('option');
        option.value = subject.subjectID;
        option.textContent = subject.subjectName;
        select.appendChild(option);
      }
    })
    .catch(error => {
      // Handle error
      console.error(error);
    });
});


// Listen for changes to the subjects dropdown
const select = document.getElementById('subjects');
select.addEventListener('change', function (event) {
  const selectedValue = select.value;
  if (editForm.style.display === 'block') { handleEditForm(); }
  if (deleteForm.style.display === 'block') { handleDeleteForm(); }

  if (select.value) { populateDisplayDiv(selectedValue); }
  // Perform search using selectedValue
});

function populateDisplayDiv(subjectID) {
  fetch('http://localhost:8080/findSubjectId/' + subjectID)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(responseText => {
      //console.log(responseText);
      responseData = Object.values(JSON.parse(responseText));
      selectedUser = responseData;
      for (const data of responseData) {
        document.getElementById('subject-name-display').innerText = data.subjectName;
        document.getElementById('subject-definition-display').innerText = data.subjectDesc;
        displaySubjectMaterial(subjectID);
      }
    })
    .catch(error => {
      // Handle error
      console.error(error);
    });

  detailsDisplay.style.display = 'block';
  createSubjectBtn.style.display = 'none';
  addTermBtn.style.display = 'none';
}

function handleReturnButton() {
  returnBtn.innerText = "Return";
  detailsDisplay.style.display = 'none';
  createSubjectBtn.style.display = 'block';
  addTermBtn.style.display = 'block';
}

function displaySubjectMaterial(subjectID) {

  while (matDisplay.firstChild) {
    matDisplay.removeChild(matDisplay.firstChild);
  }

  fetch('http://localhost:8080/findLinksOfSubject/' + subjectID)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(responseText => {
      data = Object.values(JSON.parse(responseText));
      console.log("Links: " + data);
      if (data[0] != null) {
        data.forEach(link => {
          const linkCard = document.createElement('div');
          linkCard.classList.add('card');

          // Create an h2 element for the title and set its text
          const title = document.createElement('h1');
          title.classList.add('display-5');
          title.textContent = link.linkName;

          // Create a p element for the description and set its text
          const description = document.createElement('p');
          description.textContent = link.linkDesc;

          const editLinkForm = document.createElement('form');
          editLinkForm.style.display = 'none';

          const editLinkName = document.createElement('input');
          editLinkName.value = link.linkName;

          const editLinkDesc = document.createElement('textarea');
          editLinkDesc.value = link.linkDesc;

          const editLinkUrl = document.createElement('input');
          editLinkUrl.value = link.linkUrl;

          const editLinkSubmit = document.createElement('input');
          editLinkSubmit.setAttribute('type', 'submit');

          editLinkForm.appendChild(editLinkName);
          editLinkForm.appendChild(editLinkDesc);
          editLinkForm.appendChild(editLinkUrl);
          editLinkForm.appendChild(editLinkSubmit);

          editLinkForm.addEventListener('click', (event) => {
            event.stopPropagation();
          });
          editLinkForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const linkID = link.linkID;
            const newLinkName = editLinkName.value;
            const newLinkDesc = editLinkDesc.value;
            const newLinkUrl = editLinkUrl.value;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8080/editLink/" + linkID + "?linkDesc=" + newLinkDesc + "&linkName=" + newLinkName + "&linkUrl=" + newLinkUrl);
            xhr.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                console.log("Success");
                editLinkForm.style.display = 'none';
              }
            }
            xhr.send();

          });

          const editLink = document.createElement('button');
          editLink.classList.add("btn", "btn-outline-primary", "btn-sm");
          editLink.innerText = "Edit Link";
          editLink.addEventListener('click', (event) => {
            event.stopPropagation();
            if (editLinkForm.style.display === 'none') {
              deleteLink.innerText = 'Delete Link';
              deleteLinkForm.style.display = 'none';
              editLinkForm.style.display = 'block';
              editLink.innerText = 'Cancel Edit';
            } else {
              editLinkForm.style.display = 'none';
              editLink.innerText = 'Edit Link';
            }
          });

          const deleteLinkForm = document.createElement('form');
          deleteLinkForm.style.display = 'none';

          const deletePromptl = document.createElement('h1');
          title.classList.add('display-5');
          deletePromptl.textContent = "Are you sure you want to delete this link and definition?";

          const deleteLinkSubmit = document.createElement('button');
          deleteLinkSubmit.setAttribute('id', 'delete-link-submit');
          deleteLinkSubmit.setAttribute('type', 'submit');
          deleteLinkSubmit.innerHTML = "Delete Link";

          deleteLinkForm.appendChild(deletePromptl);
          deleteLinkForm.appendChild(deleteLinkSubmit);

          deleteLinkForm.addEventListener('click', (event) => {
            event.stopPropagation();
          });
          // deleteLinkForm.addEventListener('submit', (event) => {
          //   event.preventDefault();
          //   const linkID = link.linkID;

          //   let xhr = new XMLHttpRequest();
          //   xhr.open("DELETE", "http://localhost:8080/deleteLink/" + linkID);
          //   xhr.onreadystatechange = function () {
          //     if (this.readyState === 4 && this.status === 200) {
          //       console.log("Success");
          //       deleteLinkForm.style.display = 'none';
          //     }
          //   }
          //   xhr.send();
          // });

          const deleteLink = document.createElement('button');
          deleteLink.classList.add("btn", "btn-outline-primary", "btn-sm");
          deleteLink.innerText = "Delete Link";
          deleteLink.addEventListener('click', (event) => {
            event.stopPropagation();
            if (deleteLinkForm.style.display === 'none') {
              editLink.innerText = 'Edit Link';
              editLinkForm.style.display = 'none';
              deleteLinkForm.style.display = 'block';
              deleteLink.innerText = 'Cancel Delete';
            } else {
              deleteLinkForm.style.display = 'none';
              deleteLink.innerText = 'Delete Link';
            }
          });

          // Add the link to the onclick event of the card
          linkCard.onclick = function () {
            console.log(link.linkUrl);
            window.open(link.linkUrl, '_blank');
          }

          // Add the title, description, and link to the card
          linkCard.appendChild(title);
          linkCard.appendChild(description);
          linkCard.appendChild(editLinkForm);
          linkCard.appendChild(editLink);
          linkCard.appendChild(deleteLinkForm);
          linkCard.appendChild(deleteLink);
          linkCard.style.border = "solid #a4bbe0";

          matDisplay.appendChild(linkCard);
        });
        console.log("Subject Links: " + data[0].linkUrl);
      }
    })
    .catch(error => {
      // Handle error
      console.error(error);
    });

  fetch('http://localhost:8080/findTermsOfSubject/' + subjectID)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(responseText => {
      data = Object.values(JSON.parse(responseText));
      console.log("Terms: " + data);
      if (data[0] != null) {
        data.forEach(link => {
          const termCard = document.createElement('div');
          termCard.classList.add('card');

          // Create an h2 element for the title and set its text
          const title = document.createElement('h1');
          title.classList.add('display-5');
          title.textContent = link.term;

          // Create a p element for the description and set its text
          const description = document.createElement('p');
          description.textContent = link.termDefinition;

          const editTermForm = document.createElement('form');
          editTermForm.style.display = 'none';

          const editTermName = document.createElement('input');
          editTermName.value = link.term;

          const editTermDesc = document.createElement('textarea');
          editTermDesc.value = link.termDefinition;

          const editTermSubmit = document.createElement('input');
          editTermSubmit.setAttribute('type', 'submit');

          editTermForm.appendChild(editTermName);
          editTermForm.appendChild(editTermDesc);
          editTermForm.appendChild(editTermSubmit);

          editTermForm.addEventListener('click', (event) => {
            event.stopPropagation();
          });
          editTermForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const termID = link.termID;
            const newTermName = editTermName.value;
            const newTermDesc = editTermDesc.value;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8080/editTerm/" + termID + "?termDesc=" + newTermDesc + "&termName=" + newTermName);
            xhr.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                console.log("Success");
                editTermForm.style.display = 'none';
              }
            }
            xhr.send();
          });

          const editTerm = document.createElement('button');
          editTerm.classList.add("btn", "btn-outline-primary", "btn-sm");
          editTerm.innerText = "Edit Term";
          editTerm.addEventListener('click', (event) => {
            event.stopPropagation();
            if (editTermForm.style.display === 'none') {
              deleteTerm.innerText = 'Delete Term';
              deleteTermForm.style.display = 'none';
              editTermForm.style.display = 'block';
              editTerm.innerText = 'Cancel Edit';
            } else {
              editTermForm.style.display = 'none';
              editTerm.innerText = 'Edit Term';
            }
          });

          const deleteTermForm = document.createElement('form');
          deleteTermForm.style.display = 'none';

          const deletePrompt = document.createElement('h3');
          deletePrompt.textContent = "Are you sure you want to delete this term and definition?";

          const deleteTermSubmit = document.createElement('input');
          deleteTermSubmit.setAttribute('type', 'submit');
          deleteTermSubmit.setAttribute('value', 'Delete');

          deleteTermForm.appendChild(deletePrompt);
          deleteTermForm.appendChild(deleteTermSubmit);

          deleteTermForm.addEventListener('click', (event) => {
            event.stopPropagation();
          });
          deleteTermForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const termID = link.termID;

            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", "http://localhost:8080/deleteTerm/" + termID);
            xhr.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                console.log("Success");
                deleteTermForm.style.display = 'none';
              }
            }
            xhr.send();
          });

          const deleteTerm = document.createElement('button');
          deleteTerm.classList.add("btn", "btn-outline-primary", "btn-sm");
          deleteTerm.innerText = "Delete Term";
          deleteTerm.addEventListener('click', (event) => {
            event.stopPropagation();
            if (deleteTermForm.style.display === 'none') {
              editTerm.innerText = 'Edit Term';
              editTermForm.style.display = 'none';
              deleteTermForm.style.display = 'block';
              deleteTerm.innerText = 'Cancel Delete';
            } else {
              deleteTermForm.style.display = 'none';
              deleteTerm.innerText = 'Delete Term';
            }
          });

          // Add the title, description, and link to the card
          termCard.appendChild(title);
          termCard.appendChild(description);
          termCard.appendChild(editTermForm);
          termCard.appendChild(editTerm);
          termCard.appendChild(deleteTermForm);
          termCard.appendChild(deleteTerm);
          termCard.style.border = "solid #a4bbe0";

          matDisplay.appendChild(termCard);
        });
        console.log("Subject Links: " + data[0].term);
      }
    })
    .catch(error => {
      // Handle error
      console.error(error);
    });
}

document.addEventListener('click', function (event) {
  event.preventDefault();
  if (event.target.tagName === 'BUTTON') {
    const buttonId = event.target.id;
    switch (buttonId) {
      case 'add-subject-btn':
        toggleCreateSubject();
        break;

      case 'add-term-btn':
        toggleAddTerm();
        break;

      case 'return-button':
        handleReturnButton();
        break;

      case 'subject-delete-submit':
        handleDeleteSubject();
        break;

      case 'subject-edit-submit':
        handleEditSubject();
        break;

      case 'add-term-submit':
        handleAddTerm();
        break;

      case 'add-subject-submit':
        handleCreateSubject();
        break;

      case 'delete-link-submit':
        console.log("Hi");
        break;

      default:
      // default functionality
    }
  }
});

function toggleCreateSubject() {
  if (createSubjectDiv.style.display === 'none') {
    selectSubjectDiv.style.display = 'none';
    createSubjectBtn.innerText = "Cancel";
    createSubjectDiv.style.display = 'block';
    addTermBtn.style.display = 'none';
  } else {
    selectSubjectDiv.style.display = 'block';
    createSubjectBtn.innerText = "Create Subject";
    createSubjectDiv.style.display = 'none';
    addTermBtn.style.display = 'block';
  }
};

function toggleAddTerm() {
  if (addTermDiv.style.display === 'none') {
    selectSubjectDiv.style.display = 'none';
    addTermBtn.innerText = "Cancel";
    addTermDiv.style.display = 'block';
    createSubjectBtn.style.display = 'none';
  } else {
    selectSubjectDiv.style.display = 'block';
    addTermBtn.innerText = " Add Term";
    addTermDiv.style.display = 'none';
    createSubjectBtn.style.display = 'block';
  }
};

// Handle form submission for adding a new subject
function handleCreateSubject(){
  const subName = document.getElementById('subject-name').value;
  const subDesc = document.getElementById('subject-definition').value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/createSubject/" + subName + "?subDesc=" + subDesc); xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success");
      toggleCreateSubject();
    }
  }
  xhr.send();
};

function handleEditForm(event) {
  if (editForm.style.display === 'none') {
    editSubject.innerText = "Cancel Edit";
    editForm.style.display = "block";
    document.getElementById('subName').value = selectedUser[0].subjectName;
    document.getElementById('subDesc').value = selectedUser[0].subjectDesc;
    if (deleteForm.style.display === 'block') { handleDeleteForm(); }
  } else {
    editSubject.innerText = "Edit Subject";
    editForm.style.display = "none";
  }
};

function handleDeleteForm(event) {
  if (deleteForm.style.display === 'none') {
    deleteSubject.innerText = "Cancel Delete";
    deleteForm.style.display = "block";
    if (editForm.style.display === 'block') { handleEditForm(); }
  } else {
    deleteSubject.innerText = "Delete Subject";
    deleteForm.style.display = "none";
  }
};

function handleEditSubject(){
  const subID = selectedUser[0].subjectID;
  const newSubName = document.getElementById('subName').value;
  const newSubDesc = document.getElementById('subDesc').value;

  console.log(subID + newSubDesc + newSubName);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/editSubject/" + subID + "?subDesc=" + newSubDesc + "&subName=" + newSubName);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success");
      editForm.style.display = 'none';
    }
  }
  xhr.send();
};

function handleDeleteSubject() {
  const subID = selectedUser[0].subjectID;

  console.log("deleteForm event listener reached");
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8080/deleteSubject/" + subID);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success");
      deleteForm.style.display = 'none';
      handleReturnButton();
    }
  }
  xhr.send();
};


var subjectID = document.getElementById('subjectSelect');

let xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/allSubjects", true);
xhr.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let data = JSON.parse(this.responseText);
    data.forEach(subject => {
      var option = document.createElement('option');
      option.textContent = subject.subjectName;
      option.setAttribute("value", subject.subjectID);
      subjectID.add(option);
    });
    console.log("Success!");
  }
}
xhr.send();


function handleAddTerm(){
  let xhr = new XMLHttpRequest();
  const subID = document.getElementById('subjectSelect').value;
  const term = document.getElementById('term').value;
  const termDesc = document.getElementById('termDesc').value;

  xhr.open("POST", "http://localhost:8080/addTermToSubject/" + subID + "?term=" + term + "&termDesc=" + termDesc);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success!");
      toggleAddTerm();
    }
  };

  xhr.send();
};



//const searchNameForm = document.querySelector('#searchByNameForm');

//searchNameForm.addEventListener('submit', function (event) {
//  event.preventDefault(); // prevent the form from submitting
//  let xhr = new XMLHttpRequest();
//  let name = document.querySelector('#userName').value;

//  xhr.open("GET", "http://localhost:8080/returnByName/" + name, true);
//  xhr.onreadystatechange = function () {
//    if (this.readyState === 4 && this.status === 200) {
//      let data = JSON.parse(this.responseText);
//      resultsDivName.style.display = 'block';
//      console.log("http://localhost:8080/returnByName/" + name);
//      formatJSON(data, ("http://localhost:8080/returnByName/" + name));
//    }
//  };
//  xhr.send();
//});

//------------------------------------------------------------------------------------
// function formatJSON(data, query) {
//   // fetch JSON data
//   resultsDivName.innerHTML = "";
//   data.forEach(item => {
//     // create card element
//     const card = document.createElement('div');
//     card.classList.add('card');

//     // create card content
//     const name = document.createElement('h2');
//     name.textContent = item.FirstName + " " + item.LastName;

//     // append content to card
//     card.appendChild(name);

//     const view = document.createElement('button');
//     view.innerHTML = "View User";
//     view.addEventListener("click", function (event, data) {
//       event.preventDefault();

//       resultsDivName.innerHTML = "";

//       resultsDivName.appendChild(name);

//       const id = document.createElement('h3');
//       id.textContent = "ID Num: " + item.PersonID;
//       resultsDivName.appendChild(id);

//       const age = document.createElement('h4');
//       age.textContent = "Age: " + item.Age;
//       resultsDivName.appendChild(age);

//       const address = document.createElement('h4');
//       address.textContent = "Address: " + item.Address;
//       resultsDivName.appendChild(address);

//       const number = document.createElement('h4');
//       number.textContent = "Phone Number: 0" + item.PhoneNumber;
//       resultsDivName.appendChild(number);

//       const back = document.createElement('input');
//       back.type = "button";
//       back.value = "Return";
//       back.addEventListener('click', function (event, data) {
//         event.preventDefault();
//         returnPage(query);
//       });
//       resultsDivName.appendChild(back);
//     });
//     card.appendChild(view);

//     const info = document.createElement('button');
//     info.innerHTML = "User Information/ Resources";
//     info.addEventListener("click", function (event, data) {
//       event.preventDefault();
//       resultsDivName.innerHTML = "";

//       const back = document.createElement('input');
//       back.type = "button";
//       back.value = "Return";
//       back.addEventListener('click', function (event, data) {
//         event.preventDefault();
//         returnPage(query);
//       });
//       resultsDivName.appendChild(back);
//     });
//     card.appendChild(info);

//     // append card to container
//     resultsDivName.appendChild(card);
//   });
// }

// function returnPage(query) {
//   let xhr = new XMLHttpRequest();
//   console.log(query);
//   xhr.open("GET", query, true);
//   xhr.onreadystatechange = function () {
//     if (this.readyState === 4 && this.status === 200) {
//       let data = JSON.parse(this.responseText);
//       resultsDivName.style.display = 'block';
//       formatJSON(data, query);
//     }
//   };
//   xhr.send();
// };