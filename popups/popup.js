window.onload = function () {
    if (window.location.href.indexOf('createSubject.html') > -1) {
        const create = document.querySelector('#createSubject');

        create.addEventListener('submit', function (event) {
            event.preventDefault();
            let xhr = new XMLHttpRequest();
            const subName = document.querySelector(`#subjectName`).value;
            const subDesc = document.querySelector(`#subjectDesc`).value;

            xhr.open("POST", "http://localhost:8080/createSubject/" + subName + "?subDesc=" + subDesc);
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.close();
                }
            };

            xhr.send();
        });
    } else if (window.location.href.indexOf('addTerm.html') > -1) {

        // Create select for subjectID
        var subjectID = document.querySelector(`#subjectSelect`);

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

        const add = document.querySelector('#addTerm');

        add.addEventListener('submit', function (event) {
            event.preventDefault();
            let xhr = new XMLHttpRequest();
            const subID = document.querySelector(`#subjectSelect`).value;
            const term = document.querySelector(`#term`).value;
            const termDesc = document.querySelector(`#termDesc`).value;

            xhr.open("POST", "http://localhost:8080/addTermToSubject/"+ subID +"?term="+ term + "&subDesc=" + termDesc);
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.close();
                }
            };

            xhr.send();
        });
    }
}