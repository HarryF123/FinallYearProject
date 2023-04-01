window.onload = function () {
  const searchBox = document.querySelector('input[name="q"]');
  const searchQuery = searchBox.value.trim();
  const terms = preProcessText(searchQuery).split(' ');
  terms.forEach(term => {
    console.log("Term: " + term);
  });

  // Create a wrapper div to contain the header and container
  const wrapper = document.createElement('div');
  // Create and append header
  const header = document.createElement('h2');
  header.textContent = `Results for '${searchQuery}':`;
  wrapper.appendChild(header);

  const container = document.createElement('div');
  container.style.overflowY = 'scroll'; // allow vertical scrolling
  container.style.overflowX = 'hidden'; // hide horizontal overflow
  container.style.height = '350px';
  container.style.width = '550px'; // set a fixed width for the container

  wrapper.appendChild(container);

  const ids = []
  terms.forEach(async (term) => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:8080/findSubjectTerm/" + term, true);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let data = Object.values(JSON.parse(this.responseText));
        if (data && data.length > 0 && !(ids.includes(data[0].subjectID))) {
          ids.push(data[0].subjectID);
          const card = document.createElement('div');
          card.style.width = '500px'; // change this to 100% to make the card take up the full width of the container
          card.style.height = '200px';
          card.style.margin = '10px';
          card.style.border = '1px solid black';

          card.innerHTML = `<h2>${data[0].subjectName}</h2><p>${data[0].subjectDesc}</p>`;
          container.appendChild(card);
        }
      }
    }
    xhr.send();
  });

  const resultsContainer = document.querySelector('#search');
  resultsContainer.insertBefore(wrapper, resultsContainer.firstChild);

  // Define a regular expression to match search result links on Google
  const linkRegex = /^(?!.*google\.).*/;

  // Find all links on the page
  const links = document.querySelectorAll('a');

  // Loop through each link
  links.forEach(link => {
    // Check if the link matches the regular expression
    if (link.href.match(linkRegex) && link.className != "gyPpGe") {
      handleButtonFormInsertion(link);
    }
  });

  let openForm = null; activeButton = null;

  function handleButtonFormInsertion(link) {

    const styles = `#success-message { display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%; border-radius: 30px; background-color: rgb(150, 184, 255);color: #fff;text-align: center;font-size: 24px;font-weight: bold;animation: fade-in-out 2s;}@keyframes fade-in-out {0% {opacity: 0;}50% {opacity: 1;}100% {opacity: 0;}}`;
    let confirmStyles = document.createElement('style');
    confirmStyles.innerHTML = styles;
    document.head.appendChild(confirmStyles);

    const button = document.createElement('button');
    button.textContent = 'Add Link';

    const formContainer = document.createElement('div');
    // Create div and form elements to be hidden
    let form = handleForm(link);

    let confirmForm = document.createElement('div');
    confirmForm.setAttribute('id', 'success-message');
    confirmForm.style.display = 'none';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleAddLink(form, confirmForm);
      resetForm(formContainer, button);
    });

    formContainer.appendChild(form);
    formContainer.appendChild(button);
    formContainer.appendChild(confirmForm);

    // Add a click event listener to the button
    button.addEventListener('click', function (event) {
      event.preventDefault();
      if (openForm !== null) {
        // Close the currently open form
        cancelForm(openForm, activeButton);
      }
      button.style.display = 'none';
      form.style.display = 'block';
      openForm = form;
      activeButton = button;
    });

    const cancel = document.createElement('button');
    cancel.innerText = "Cancel";
    cancel.addEventListener('click', (event) => {
      event.preventDefault();
      cancelForm(form, button);
    });
    form.appendChild(cancel);

    // Append the button to the link
    link.parentNode.insertBefore(formContainer, link.nextSibling);
  }

  function cancelForm(form, button) {
    button.style.display = 'block';
    form.style.display = 'none';
    openForm = null;
    activeForm = null;
  };

  function handleForm(link) {
    // Create form element
    const form = document.createElement('form');
    form.style.display = 'none';

    // Create text inputs
    const dataNameInput = document.createElement('input');
    dataNameInput.type = 'text';
    dataNameInput.id = 'dataName';
    dataNameInput.placeholder = 'Name..';
    dataNameInput.required = true;
    form.appendChild(dataNameInput);

    const dataDescInput = document.createElement('input');
    dataDescInput.type = 'text';
    dataDescInput.id = 'dataDesc';
    dataDescInput.placeholder = 'Definition..';
    dataDescInput.required = true;
    form.appendChild(dataDescInput);

    const dataUrlInput = document.createElement('input');
    dataUrlInput.type = 'text';
    dataUrlInput.id = 'dataUrl';
    dataUrlInput.style.display = 'none';
    dataUrlInput.value = link.href;
    form.appendChild(dataUrlInput);

    // Create select element
    const subjectSelect = document.createElement('select');
    subjectSelect.id = 'subjectID';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Choose a Subject: ';
    defaultOption.selected = true;
    defaultOption.disabled = true;

    subjectSelect.add(defaultOption);
    form.appendChild(subjectSelect);

    // Populate select element by accessing API endpoint
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/allSubjects', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        data.forEach(subject => {
          const option = document.createElement('option');
          option.value = subject.subjectID;
          option.textContent = subject.subjectName;
          subjectSelect.appendChild(option);
        });
      } else {
        console.log('Error:', xhr.statusText);
      }
    };
    xhr.send();

    const dataSubmit = document.createElement('input');
    dataSubmit.type = 'submit';
    dataSubmit.name = 'dataSubmit';
    dataSubmit.id = 'dataSubmit';
    dataSubmit.value = 'Submit';
    form.appendChild(dataSubmit);

    return form;
  }

  function resetForm(div, button) {
    // Reset the form fields
    const form = div.querySelector('form');
    form.reset();

    // Hide the div and show the original button
    form.style.display = 'none';
    button.style.display = 'inline-block';
  }

  function handleAddLink(form, confirmForm) {
    let xhr = new XMLHttpRequest();
    const linkName = form.querySelector(`#dataName`).value;
    const linkDesc = form.querySelector(`#dataDesc`).value;
    const linkUrl = form.querySelector(`#dataUrl`).value;
    const subject = form.querySelector(`#subjectID`).value;
    const subjectName = form.querySelector(`#subjectID`).options[form.querySelector(`#subjectID`).selectedIndex].textContent;

    xhr.open("POST", "http://localhost:8080/addLinkToSubject/" + subject + "?linkDesc=" + linkDesc + "&link=" + linkUrl + "&linkName=" + linkName);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Success!");
        confirmForm.innerText = "Successfully logged '" + linkName + "' under " + subjectName;
        confirmForm.style.display = "block";

        setTimeout(() => {
          confirmForm.style.display = 'none';
        }, 3500);
      }
    };
    xhr.send();
  };

  function preProcessText(text) {
    // Define an array of stop words
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'i'];

    // Remove punctuation using a regular expression
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g, '');

    // Split the text into an array of words
    let words = text.split(' ');

    // Remove stop words
    words = words.filter(word => !stopWords.includes(word.toLowerCase()));

    // Perform lemmatization (using a simple example for demonstration purposes)
    words = words.map(word => {
      if (word.toLowerCase().endsWith('ing')) {
        return word.slice(0, -3);
      } else if (word.toLowerCase().endsWith('ed')) {
        return word.slice(0, -2);
      } else {
        return word;
      }
    });

    // Join the words back into a string
    text = words.join(' ');

    return text;
  }
}