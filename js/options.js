disabledDomains = [];

function saveOpts () {
  // Get the existing options
  chrome.storage.sync.get({
    disabledDomains: []
  }, opts => {
    disabledDomains = opts.disabledDomains;
  });

  // Check if this domain should be added
  // to the list of disabled domains
  var disableThisDomain = document.querySelector('#opt-disable').checked;

  if(disableThisDomain) {
    // Add domain to the disabled list if checked
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) < 0) {
        disabledDomains.push(thisDomain);
      }

      // Save the options
      storeOpt('disabledDomains', disabledDomains)
    });
  } else {
    // Otherwise, remove it
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) >= 0) {
        var thisIndex = disabledDomains.indexOf(thisDomain);
        disabledDomains.splice(thisIndex, 1);
      }

      // Save the options
      storeOpt('disabledDomains', disabledDomains)
    });
  }
}

function storeOpt(key, value) {
  console.log(key)

  chrome.storage.sync.set({
    [key]: value
  }, () => {
    // Let the user know the options were saved
    console.log('options saved');
  });
}

function initOpts() {
  var optForm = document.querySelector('#opt-form');
  optForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveOpts();
  });

  chrome.storage.sync.get({
    disabledDomains: []
  }, opts => {
    disabledDomains = opts.disabledDomains;

    console.log(disabledDomains);

    // Check if this domain has been disabled
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) >= 0) {
        var disableThisDomain = document.querySelector('#opt-disable').checked = true;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initOpts);
