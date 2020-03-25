var appOrigin = '*';

window.parent.postMessage({
    min_supported_version: 1,
    max_supported_version: 1,
    message_type: 'widget_hello'
  }, appOrigin)

window.addEventListener('message', function(event) {
  if (event.data.message_type === 'app_hello') {

    if (event.data.widget_state) {
      if (event.data.widget_state.luckySearch) {
        luckyRadio.checked = true;
      } else {
        normalRadio.checked = true;
      }

      queryInput.value = event.data.widget_state.query || '';
    } else {
        normalRadio.checked = true;
        queryInput.value = '';
    }

    if (event.data.webhook) {
      var customJsonTextArea = document.getElementById('customJson');
      customJsonTextArea.value = JSON.stringify(event.data.webhook);
    }

    window.parent.postMessage({message_type: 'widget_initialized'}, appOrigin)
  }

  if (event.data.message_type === 'app_request_state') {

    var customJsonTextArea = document.getElementById('customJson');

    window.parent.postMessage(
      {
        message_type: 'widget_state',
        webhook: {
          url: 'https://www.google.com/search?q=' + queryInput.value + (luckyRadio.checked ? '&btnI' : ''),
          method: 'GET',
          response_handling: 'text',
          auth: null,
          headers: [],
          body: '',
          event_properties: {},
          parametrized_parts: {},
          // ...getQueryParams(),
          ...JSON.parse(customJsonTextArea.value),
        },
        widget_state: {
          luckySearch: luckyRadio.checked,
          query: queryInput.value
        }
      }, appOrigin
    )
  }


});


function getQueryParams() {
    const queryString = window.location.search.substring(1);
    const keyEqualsValueEntries = queryString.split('&');
    const result = {};

    for (let i = 0; i < keyEqualsValueEntries.length; i++) {
        const pair = keyEqualsValueEntries[i].split('=');
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return result;
}
