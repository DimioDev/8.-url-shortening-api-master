const shortenIt = document.querySelector('.address-button');
const resultBar = document.querySelector('.stats');
let shortifyResults = [];
let idCounter = 0;
shortenIt.addEventListener('click', validUrl);

function copyShortenUrl(copyBtn) {
  copyBtn.addEventListener('click', function (e) {
    let myId = e.target.parentElement.getAttribute('id');
    copyBtn.style.background = 'black';
    copyBtn.innerText = 'Copied!';
    let copyText = document.querySelector('.result-bar');
    let r = document.createRange();
    r.selectNode(copyText);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    setTimeout(function () {
      for (let i = 0; i < shortifyResults.length; i++) {
        if (shortifyResults[i].id == myId) {
          shortifyResults.splice(i, 1);
          createResultBars();
          break;
        }
      }
    }, 3000);
  });
}

function validUrl() {
  let yourUrl = document.getElementById('input').value;
  let regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  if (!regex.test(yourUrl)) {
    document.querySelector('.address-bar').classList.add('error');
    document.querySelector('.error-text').style.opacity = 1;
    setTimeout(function () {
      document.querySelector('.address-bar').classList.remove('error');
      document.querySelector('.error-text').style.opacity = 0;
      document.getElementById('input').value = '';
    }, 2000);
  } else {
    setTimeout(function () {
      document.getElementById('input').value = '';
    }, 3000);
    shortenUrls(yourUrl);
  }
}

async function shortenUrls(yourUrl) {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  };
  const res = await fetch(
    `https://api.shrtco.de/v2/shorten?url=${yourUrl}`,
    config
  );
  const data = await res.json();

  shortifyResults.push({
    query: yourUrl,
    response: data.result.full_short_link2,
    id: idCounter++,
  });
  createResultBars();
}

function createResultBars() {
  document.querySelector('.spaceholder').innerHTML = '';
  for (let i = 0; i < shortifyResults.length; i++) {
    const holder = document.querySelector('.spaceholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper-result';
    const shorten = document.createElement('div');
    shorten.className = 'shorten-result';
    wrapper.appendChild(shorten);
    holder.appendChild(wrapper);
    const inputBar = document.createElement('p');
    inputBar.className = 'address-copied';
    shorten.appendChild(inputBar);
    inputBar.appendChild(document.createTextNode(shortifyResults[i].query));
    const responseBar = document.createElement('p');
    responseBar.className = 'result-bar';
    shorten.appendChild(responseBar);
    responseBar.appendChild(
      document.createTextNode(shortifyResults[i].response)
    );
    const copyBtn = document.createElement('div');
    copyBtn.className = 'result-button dark';
    copyBtn.appendChild(document.createTextNode('Copy'));
    wrapper.appendChild(copyBtn);
    wrapper.setAttribute('id', shortifyResults[i].id);
    copyShortenUrl(copyBtn);
  }
}
