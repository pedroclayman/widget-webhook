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

    window.parent.postMessage({message_type: 'widget_initialized'}, appOrigin)
  }

  if (event.data.message_type === 'app_request_state') {
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
          consent_category: 'foo'

        },
        widget_state: {
          luckySearch: luckyRadio.checked,
          query: queryInput.value
        }
      }, appOrigin
    )
  }


});
