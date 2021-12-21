document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {    

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-recipients').disabled = false;
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(recipients);
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    }),
  })

    .then(response => response.json())
    .then(result => {
      if ("message" in result) {
        load_mailbox('sent');
      }
    })
  return false;
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      if (mailbox == "inbox") {
        console.log(emails)
        if (emails.length == 0) {
          var div = document.createElement("div");
          div.innerHTML = `<br><br><br><h3>Nothing in folder</h3><br>
          <h6>Looks empty over here.</h6>`
          document.querySelector("#emails-view").appendChild(div);
        }
        else {
          var div = document.createElement("div");
          div.innerHTML = `<table class="table">
          <thead>
            <tr>
              <th scope="col" style="text-align:left;">From</th>
              <th scope="col" style="text-align:center;">Subject</th>
              <th scope="col" style="text-align:right;">Received</th>
            </tr>
          </thead>`
          document.querySelector("#emails-view").appendChild(div);
        }
        emails.forEach((data) => {
          var div = document.createElement("div");
          div.innerHTML = `<style> tbody:hover {
            background-color:#555;
            color:white;
          }
          </style>
            <table class="table">
              <tbody>
                <tr>
                  <td>${data.sender}</td>
                  <td style="text-align:center;">${data.subject}</td>
                  <td style="text-align:right;">${data.timestamp}</td>
                </tr>
              </tbody>
            </table>`;
          if (data.read == true) {
            div.className = `read`;
          }

          document.querySelector("#emails-view").appendChild(div);
          div.addEventListener('click', () => load_email(data.id, mailbox));
        })
      }

      if (mailbox == "sent") {
        if (emails.length == 0) {
          var div = document.createElement("div");
          div.innerHTML = `<br><br><br><h3>Nothing in folder</h3><br>
          <h6>Looks empty over here.</h6>`
          document.querySelector("#emails-view").appendChild(div);
        }
        else {
          var div = document.createElement("div");
          div.innerHTML = `<table class="table">
          <thead>
            <tr>
              <th scope="col" style="text-align:left;">From</th>
              <th scope="col" style="text-align:center;">Subject</th>
              <th scope="col" style="text-align:right;">Received</th>
            </tr>
          </thead>`
          document.querySelector("#emails-view").appendChild(div);
        }
        emails.forEach((data) => {
          var div = document.createElement("div");
          div.innerHTML = `<style> tbody:hover {
            background-color:#555;
            color:white;
          }
          </style>
            <table class="table">
              <tbody>
                <tr>
                  <td>${data.recipients}</td>
                  <td style="text-align:center;">${data.subject}</td>
                  <td style="text-align:right;">${data.timestamp}</td>
                </tr>
              </tbody>
            </table>`;
          if (data.read == true) {
            div.className = `read`;
          }
          document.querySelector("#emails-view").appendChild(div);
          div.addEventListener('click', () => load_email(data.id, mailbox));
        })

      }

      if (mailbox == "archive") {
        if (emails.length == 0) {
          var div = document.createElement("div");
          div.innerHTML = `<br><br><br><h3>Nothing in folder</h3><br>
          <h6>Looks empty over here.</h6>`
          document.querySelector("#emails-view").appendChild(div);
        }
        else {
          var div = document.createElement("div");
          div.innerHTML = `<table class="table">
          <thead>
            <tr>
              <th scope="col" style="text-align:left;">From</th>
              <th scope="col" style="text-align:center;">Subject</th>
              <th scope="col" style="text-align:right;">Received</th>
            </tr>
          </thead>`
          document.querySelector("#emails-view").appendChild(div);
        }
        emails.forEach((data) => {
          var div = document.createElement("div");
          div.innerHTML = `<style> tbody:hover {
            background-color:#555;
            color:white;
          }
          </style>
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>${data.sender}</td>
                  <td style="text-align:center;">${data.subject}</td>
                  <td style="text-align:right;">${data.timestamp}</td>
                </tr>
              </tbody>
            </table>`;
            if (data.read == true) {
              div.className = `read`;
            }
          document.querySelector("#emails-view").appendChild(div);
          div.addEventListener('click', () => load_email(data.id, mailbox));
        })
      }
    })
};

function load_email(email_id, mailbox) {
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email)
      read(email_id);
      if (mailbox == "inbox" | mailbox == "archive") {
        document.querySelector("#emails-view").innerHTML = "";
        var div1 = document.createElement("div1");
        div1.innerHTML = `
          <style> 
            p {
              line-height:5px;
            }
        
            span {
              font-weight:bold;
            }
          </style>
          <p><span>From:</span> ${email.sender}</p>
          <p><span>Subject:</span> ${email.subject}</p>
          <p><span>Time:</span> ${email.timestamp}</p>`;
        document.querySelector('#emails-view').appendChild(div1);
        //reply button
        let replyEmail = document.createElement("btn");
        replyEmail.className = `btn btn-sm btn-primary`;
        replyEmail.innerText = "Reply";
        replyEmail.style.padding = "10px 10px";
        replyEmail.addEventListener('click', () => {
          reply(email.sender, email.subject, email.timestamp, email.body)
        });
        document.querySelector('#emails-view').appendChild(replyEmail);
        //reply button

        //archive button
        let archiveEmail = document.createElement("btn");
        archiveEmail.className = `btn btn-sm btn-primary`;
        archiveEmail.style.margin = "10px";
        archiveEmail.style.padding = "10px 10px";
        if (email.archived == false) {
          archiveEmail.innerText = "Archive";
        }
        else {
          archiveEmail.innerText = "Unarchive";
        }
        archiveEmail.addEventListener('click', () => {
          archive(email_id, email.archived);
        });
        document.querySelector('#emails-view').appendChild(archiveEmail);
        //archive button

        //body div
        let div2 = document.createElement("div2");
        div2.innerHTML = `<hr><div style="white-space: pre-wrap;">${email.body}</div>`;
        document.querySelector('#emails-view').appendChild(div2);
        //body div



      }

      if (mailbox == "sent") {
        document.querySelector("#emails-view").innerHTML = "";
        var div = document.createElement("div");
        div.innerHTML = `
      <style> 
        p {
          line-height:5px;
        }
        
        span {
          font-weight:bold;
        }
      
      </style>
      <p><span>${email.sender}</span></p>
      <p><span>To:</span> ${email.recipients}</p>
      <p><span>Subject:</span> ${email.subject}</p>
      <p><span>Time:</span> ${email.timestamp}</p>
      <hr>
      <div style="white-space: pre-wrap;">${email.body}</div>`
        document.querySelector('#emails-view').appendChild(div);
      }
    })
}

function reply(sender, subject, timestamp, body) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#reply-content').style.display = 'block';

  document.querySelector('#compose-recipients').value = sender;
  document.querySelector('#compose-recipients').disabled = true;
  document.querySelector('#compose-subject').value = `Re: ${subject}`;

  document.querySelector('#compose-body').value = `\n\n\n\nOn ${timestamp} - ${sender} wrote:\n\n${body}\n`
}

function archive(email_id, archived) {
  if (archived == false) {
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
  }
  else {
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
  }
  load_mailbox("inbox");
  window.location.reload();
}

function read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}
