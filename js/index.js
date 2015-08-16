
// Add your TypeScript or JavaScript here 

WinJS.Application.onready = function () {

    // The next line will apply declarative control binding to all elements
    // (e.g. DIV with attribute: data-win-control="WinJS.UI.Rating")
    
    
     // Create a JavaScript date object for date September 1, 1990.
    // Note, JavaScript months are 0 based so September is referenced by 8, not 9
    var initialDate = new Date(2015, 29, 8, 12, 0, 0, 0);
    var divControlTime = document.querySelector("#divControlTime");
    var divControlDate = document.querySelector("#divControlDate");
    // Create a new TimePicker control with value of initialDate inside element "myTimePickerDiv"
    var controlTime = new WinJS.UI.TimePicker(divControlTime, { current: initialDate });

    // Create a new DatePicker control with value of initialDate inside element "myDatePickerDiv"
    var controlDate = new WinJS.UI.DatePicker(divControlDate, { current: initialDate });
    document.querySelector("#pickSomeone").addEventListener("click", pickContact, false);
    
    WinJS.UI.processAll();
};

WinJS.Application.start();

function pickContact(){
if(typeof Windows != 'undefined') {
  // Create the picker 
  var picker = new Windows.ApplicationModel.Contacts.ContactPicker(); 
  picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
  // Open the picker for the user to select a contact 
  picker.pickContactAsync().done(function (contact) { 
    if (contact !== null) { 
      document.querySelector("#pickSomeone").innerText= contact.displayName; 
    } else { 
      return "No one";
    } 
  });
}
}



var suggestionList = ["Algebra","Calculo"];

function suggestionsRequestedHandler(eventObject) {
    var queryText = eventObject.detail.queryText,
    query = queryText.toLowerCase(),
    suggestionCollection = eventObject.detail.searchSuggestionCollection;
    if (queryText.length > 0) {
        for (var i = 0, len = suggestionList.length; i < len; i++) {
            if (suggestionList[i].substr(0, query.length).toLowerCase() === query) {
                suggestionCollection.appendQuerySuggestion(suggestionList[i]);
            }
        }
    }
}

WinJS.Namespace.define("Subjects", {
    suggestionsRequestedHandler: WinJS.UI.eventHandler(suggestionsRequestedHandler)
});

