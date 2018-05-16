disabledDomains = [];

function saveOpts () {
  // Get the existing options
  chrome.storage.sync.get({
    disabledDomains: []
  }, function(opts){
    disabledDomains = opts.disabledDomains;
  });

  // Check if this domain should be added
  // to the list of disabled domains
  var disableThisDomain = document.querySelector('#opt-disable').checked;
  var data = {};

  if(disableThisDomain) {
    // Add domain to the disabled list if checked
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log(tabs)

      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) < 0) {
        disabledDomains.push(thisDomain);
      }

      // Save the options
      data = {
        disabledDomains: disabledDomains
      }

      storeOpt(data)
    });
  } else {
    // Otherwise, remove it
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) >= 0) {
        var thisIndex = disabledDomains.indexOf(thisDomain);
        disabledDomains.splice(thisIndex, 1);
      }

      // Save the options
      data = {
        disabledDomains: disabledDomains
      }

      storeOpt(data);
    });
  }
}

function storeOpt(data) {
  chrome.storage.sync.set(data, function(){
    // Let the user know the options were saved
    console.log('options saved');
  });
}

function initOpts() {
  var optForm = document.querySelector('#opt-form');
  optForm.addEventListener('submit', function(e){
    e.preventDefault();
    saveOpts();
  });

  chrome.storage.sync.get({
    disabledDomains: []
  }, function(opts){
    disabledDomains = opts.disabledDomains;

    console.log(disabledDomains);

    // Check if this domain has been disabled
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
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
