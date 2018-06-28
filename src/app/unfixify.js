function unfixify() {
  // Inject styles
  var head = document.head;

  var style = document.createElement('style');
  style.type = 'text/css';

  var css = `
    html body *.uf.uf_wasfixed.uf_unfixed {
      position: absolute!important;
    }

    html body button.uf.uf_remove {
      background: rgba(0, 0, 0, .5)!important;
      border: 1px solid #fff!important;
      border-radius: 50%!important;
      box-shadow: none!important;
      color: #fff!important;
      height: 20px!important;
      left: 5px!important;
      min-height: 20px!important;
      opacity: 0!important;
      overflow: hidden!important;
      padding: 0!important;
      position: absolute;
      text-indent: -999em!important;
      top: 5px!important;
      transform: rotate(45deg)!important;
      transition: all .25s ease!important;
      visibility: hidden!important;
      width: 20px!important;
    }

    html body *.uf.uf_wasfixed.uf_unfixed:hover > button.uf.uf_remove {
      opacity: 1!important;
      visibility: visible!important;
    }

    html body button.uf.uf_remove:before,
    html body button.uf.uf_remove:after {
      background: #fff!important;
      content: ''!important;
      height: 1px!important;
      left: 50%!important;
      position: absolute!important;
      top: 50%!important;
      transform: translateX(-50%) translateY(-50%)!important;
      width: 11px!important;
    }

    html body button.uf.uf_remove:after {
      height: 11px!important;
      width: 1px!important;
    }
  `;

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);

  // Get all elements
  var allElements = document.querySelectorAll('*');

  // Find all fixed or sticky elements
  var fixedElements = [];

  allElements.forEach(function(element){
    if(
      window.getComputedStyle(element, null).getPropertyValue('position') == 'fixed' ||
      window.getComputedStyle(element, null).getPropertyValue('position') == 'sticky'
    ) {
      fixedElements.push(element);
    }
  });

  // Loop through fixed elements and unfix them
  fixedElements.forEach(function(fixedElement){
    // Add multiple classes so we can make the
    // CSS selector super specific
    fixedElement.className += ' uf uf_wasfixed uf_unfixed';

    // Also add a button to remove the unfixed
    // element in case it gets in the way
    var removeBtn = document.createElement('button');
    removeBtn.className = ' uf uf_remove';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';

    setTimeout(function(){
      fixedElement.append(removeBtn);
    }, 2000);

    removeBtn.addEventListener('click', function(e){
      e.preventDefault();
      fixedElement.remove();
    });
  });
}

chrome.storage.sync.get({
  enabledDomains: [],
  disableAll: false
}, function(opts){
  enabledDomains = opts.enabledDomains;
  disableAll = opts.disableAll;

  if(!disableAll) {
    if(enabledDomains.indexOf(window.location.hostname) >= 0) {
      unfixify();

      document.addEventListener('scroll', function(){
        unfixify();
      });
    }
  }
});
