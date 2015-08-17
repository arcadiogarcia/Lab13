
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
    
    var sending=false;
    
    document.querySelector("#send").addEventListener("click",function(){
        console.log(sending);
        if(sending){
            clickback();
        }else{
            clicksend();
        }
    });
    
    function clicksend(){
       document.querySelector("#sendbox").style.height=window.innerHeight+"px";
       document.querySelector("#send").innerHTML="Atras";
       
       
       var button=document.createElement("button");
       button.className="appearbutton win-button action";
       button.id="addCalendar";
       button.innerHTML="Añadir al calendario";
       button.style.width="80%";
       button.style.height="40%";
       button.style.display="block";
       button.style.margin="10%";
       document.querySelector("#sendactions").appendChild(button);
       
       button.addEventListener("click",function(){
           if(Windows && Windows.ApplicationModel && Windows.ApplicationModel.Appointments) {
                // Create an Appointment that should be added the user's appointments provider app.
                var appointment = new Windows.ApplicationModel.Appointments.Appointment();
                var date = document.getElementById("divControlDate").winControl;
                var time = document.getElementById("divControlTime").winControl;
                appointment.startTime=date;
                appointment.startTime.setMinutes(time.getMinutes());
                appointment.startTime.setHours(time.getHours());
                // Get the selection rect of the button pressed to add this appointment
                var boundingRect = e.srcElement.getBoundingClientRect();
                var selectionRect = { x: boundingRect.left, y: boundingRect.top, width: boundingRect.width, height: boundingRect.height };
                // ShowAddAppointmentAsync returns an appointment id if the appointment given was added to the user's calendar.
                // This value should be stored in app data and roamed so that the appointment can be replaced or removed in the future.
                // An empty string return value indicates that the user canceled the operation before the appointment was added.
                Windows.ApplicationModel.Appointments.AppointmentManager.showAddAppointmentAsync(appointment, selectionRect, Windows.UI.Popups.Placement.default)
                .done(function (appointmentId) {
                    if (appointmentId) {
                        document.querySelector("#addCalendar").innerHTML="Añadido a tu calendario!";
                        document.querySelector("#addCalendar").style.background="#3F3";
                    } else {
                        //ERROR
                    }
                });
            }
       });
       
       
       button=document.createElement("button");
       button.className="appearbutton win-button action";
       button.id="sendMail";
       button.innerHTML="Enviar email";
       button.style.width="80%";
       button.style.height="40%";
       button.style.display="block";
       button.style.margin="10%";
       document.querySelector("#sendactions").appendChild(button);
       
       sending=true;
    }
    
    function clickback(){
       document.querySelector("#sendbox").style.height="50px";
       document.querySelector("#send").innerHTML="Enviar";
       
       document.querySelector("#sendactions").innerHTML="";
       
       sending=false;
       
    }
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



var suggestionListSubject = ["Algebra","Calculo"];

function suggestionsRequestedHandlerSubject(eventObject) {
    var queryText = eventObject.detail.queryText,
    query = queryText.toLowerCase(),
    suggestionCollection = eventObject.detail.searchSuggestionCollection;
    if (queryText.length > 0) {
        for (var i = 0, len = suggestionListSubject.length; i < len; i++) {
            if (suggestionListSubject[i].substr(0, query.length).toLowerCase() === query) {
                suggestionCollection.appendQuerySuggestion(suggestionListSubject[i]);
            }
        }
    }
}

WinJS.Namespace.define("Subjects", {
    suggestionsRequestedHandler: WinJS.UI.eventHandler(suggestionsRequestedHandlerSubject)
});

var suggestionListPlace = ["Laboratorio 1","Laboratorio 2","Laboratorio 3"];

function suggestionsRequestedHandlerPlace(eventObject) {
    var queryText = eventObject.detail.queryText,
    query = queryText.toLowerCase(),
    suggestionCollection = eventObject.detail.searchSuggestionCollection;
    if (queryText.length > 0) {
        for (var i = 0, len = suggestionListPlace.length; i < len; i++) {
            if (suggestionListPlace[i].substr(0, query.length).toLowerCase() === query) {
                suggestionCollection.appendQuerySuggestion(suggestionListPlace[i]);
            }
        }
    }
}

function querySubmittedHandlerPlace(eventObject) {
    document.querySelector("#placebox").getElementsByTagName("input")[0].value = eventObject.detail.queryText;
}

WinJS.Namespace.define("Places", {
    suggestionsRequestedHandler: WinJS.UI.eventHandler(suggestionsRequestedHandlerPlace),
    querySubmittedHandler: WinJS.UI.eventHandler(querySubmittedHandlerPlace)
});



if (typeof Windows !== 'undefined' && typeof Windows.UI !== 'undefined' &&  typeof Windows.UI.ViewManagement !== 'undefined') { 
  // Get a reference to the App Title Bar 
   Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title="";
   Windows.UI.ViewManagement.ApplicationViewTitleBar.ExtendViewIntoTitleBar = true; 
     var appTitleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar; 
 
       appTitleBar.foregroundColor = {r:255,g:255,b:255,a:0} ;
     appTitleBar.backgroundColor =  {r:68,g:153,b:221,a:0} ;
     appTitleBar.buttonBackgroundColor =  {r:68,g:153,b:221,a:0} ;
}