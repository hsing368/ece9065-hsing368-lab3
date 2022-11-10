//Get the reference to the dynamic search list
var dyn_search_list = document.getElementById("dyn-search-list");

/*
let track = {};
track.album_title = element.album_title;
track.artist_name = element.artist_name;
track.track_title = element.track_title;
track.track_id = element.track_id;
track.track_duration = element.track_duration;
*/

var track_list_data;
var user_list_data;

const map = new Map()
            .set(0, "album_title")
            .set(1,"artist_name")
            .set(2,"track_duration")
            .set(4,"track_title");


//Function to clear the text box values for Search by Name & Number text-boxes
function clearInput(clr_string)
{
  /*
  if(clr_string == 'all' || clr_string == 'number')
  {
    document.getElementById("pokeno").value = "";
  }

  if(clr_string == 'all' || clr_string == 'name')
  {
    document.getElementById("pokename").value = "";
  }*/

  console.log("Clear input called");  
}

//Function to get the new Search list element
function getSearchElement(i)
{
  //Creating a new list element
  let li = document.createElement('li');
  li.className = 'search-list-item';
  //let pok_id = "item"+stored_number; //Populate the unique id for each list element
  //li.id = pok_id;

  //Creating the new div to hold the pokemon info
  let tr_info = document.createElement('div');
  tr_info.className = 'track-info';

  //Creating the div child nodes
  let name = "";

  let album_title = document.createElement('p');
  name = (track_list_data[i][map.get(0)]).toString().toLowerCase();
  album_title.className = 'name';
  album_title.appendChild(document.createTextNode("Album_title: "+name.charAt(0).toUpperCase() + name.slice(1)));

  let artist_title = document.createElement('p');
  name = track_list_data[i][map.get(1)].toString().toLowerCase();
  artist_title.className = 'name';
  artist_title.appendChild(document.createTextNode("Artist_name: "+name.charAt(0).toUpperCase() + name.slice(1)));

  let track_title = document.createElement('p');
  name = track_list_data[i][map.get(4)].toString().toLowerCase();
  track_title.className = 'name';
  track_title.appendChild(document.createTextNode("Track_title: "+name.charAt(0).toUpperCase() + name.slice(1)));

  let track_duration = document.createElement('p');
  name = track_list_data[i][map.get(2)].toString().toLowerCase();
  track_duration.className = 'name';
  track_duration.appendChild(document.createTextNode("Track_duration: "+name.charAt(0).toUpperCase() + name.slice(1)));

  //Linking all the child nodes of the list element
  li.appendChild(tr_info);
  tr_info.appendChild(album_title);
  tr_info.appendChild(artist_title);
  tr_info.appendChild(track_title);
  tr_info.appendChild(track_duration);

  return li;
}

//Function to Search by name
function searchByName(search_type, sort_type)
{
  //Reset the list element before the Search
  dyn_search_list.replaceChildren();


  //Validate the input number for incorrect range
  let ret_val = true;//validate_getpokename(name);
  if (ret_val == false)
  {
    clearInput('all');
    return;
  }

  let track_found = false;
  let result = []; //This holds the resultant strings to display in alert box

  if (sort_type != -1)
  {
    console.log("Sort_type "+sort_type);
    track_list_data.sort();//(sort_function);

    function sort_function(a, b) {
        if (a[map.get(sort_type)].toString().toLowerCase() === b[map.get(sort_type)].toString().toLowerCase()) {
            return 0;
        }
        else {
            return (a[map.get(sort_type)].toString().toLowerCase() < b[map.get(sort_type)].toString().toLowerCase()) ? -1 : 1;
        }
    }
  }

  //Loop through the pokemon data to match the input name
  for (let i = 0; i < track_list_data.length; i++)
  {
    console.log(search_type+" ");
    let li = getSearchElement(i);
    dyn_search_list.appendChild(li);

    track_found = true;
  }
  
  //Reset the list element if pokemon is not found
  if( track_found  == false )
  {
    //Reset the dynamic list element
    dyn_search_list.replaceChildren();
    alert("Track not found :( !!");
    return;
  }
  else
  {
    let alert_message = "Track match found for: \"" + search_type + "\" !!\n" ;
    //result.sort();

    //Construct the alert message log
    //for (let i = 0; i < result.length; i++)
    {
      //alert_message += result[i];
    }
    alert( alert_message );
  }

  //Clear the text-box input after the process is done
  clearInput('number');
}

//var gl_response;
/*
function get_response(request)
{
    fetch(request).then(resp =>
    {
        if(resp.ok)
        {
            console.log(resp);
        }
        return resp.json();
    }).then(resp =>
        {
            console.log("inside json resp");
            response.push(resp.json());
            return;
        });
}*/

function get_track_list()
{
    data=
    {
        "list_name": "Harsh"
    };

    //Get the input value from the user
    let name = document.getElementById("track-search-input").value;

    let ip_name = name.toLowerCase();
    let search_type = document.getElementById("track-search-options").value;
    let sort_type   = parseInt(document.getElementById("track-sort-options").value);
    console.log("Ini Sort_type "+typeof sort_type);
    var request = new Request(`http://localhost:1000/api/tracks/${search_type}/${ip_name}`,
    {
        headers: new Headers({'Content-Type': 'application/json'}),
        method: 'GET'
    });

    console.log("before");
    fetch(request).then(response =>
        {
            if(response.ok)
            {
                console.log(response);
                return response.json();
            }
            
        }).then(response =>
            {
                track_list_data = response;
                //console.log(response);
                searchByName(search_type, sort_type);
                //console.log(response[0]);
                //console.log(response[0]);
            });

    console.log("after");
    //console.log(response);
    //console.log(response);
    //console.log(response.length);
}

//Function to Search by name
function searchByName(search_type, sort_type)
{
  //Reset the list element before the Search
  dyn_search_list.replaceChildren();


  //Validate the input number for incorrect range
  let ret_val = true;//validate_getpokename(name);
  if (ret_val == false)
  {
    clearInput('all');
    return;
  }

  let track_found = false;
  let result = []; //This holds the resultant strings to display in alert box

  if (sort_type != -1)
  {
    console.log("Sort_type "+sort_type);
    track_list_data.sort();//(sort_function);

    function sort_function(a, b) {
        if (a[map.get(sort_type)].toString().toLowerCase() === b[map.get(sort_type)].toString().toLowerCase()) {
            return 0;
        }
        else {
            return (a[map.get(sort_type)].toString().toLowerCase() < b[map.get(sort_type)].toString().toLowerCase()) ? -1 : 1;
        }
    }
  }

  //Loop through the pokemon data to match the input name
  for (let i = 0; i < track_list_data.length; i++)
  {
    console.log(search_type+" ");
    let li = getSearchElement(i);
    dyn_search_list.appendChild(li);

    track_found = true;
  }
  
  //Reset the list element if pokemon is not found
  if( track_found  == false )
  {
    //Reset the dynamic list element
    dyn_search_list.replaceChildren();
    alert("Track not found :( !!");
    return;
  }
  else
  {
    let alert_message = "Track match found for: \"" + search_type + "\" !!\n" ;
    //result.sort();

    //Construct the alert message log
    //for (let i = 0; i < result.length; i++)
    {
      //alert_message += result[i];
    }
    alert( alert_message );
  }

  //Clear the text-box input after the process is done
  clearInput('number');
}

function create_track_list()
{
    //Get the input value from the user
    let name = document.getElementById("create-input-list").value;
    let data = {"list_name": name};
    let ip_name = name.toLowerCase();
    
    //console.log("Ini Sort_type "+typeof sort_type);
    var request = new Request(`http://localhost:1000/api/list/`,
    {
        headers: new Headers({'Content-Type': 'application/json'}),
        method: 'POST',
        body: JSON.stringify(data)
    });

    console.log("before");
    fetch(request).then(response =>
        {
            if(response.ok)
            {
                console.log(response);
                return response.json();
            }
            
        }).then(response =>
            {
                user_list_data = response;
                createListHandler();
                console.log(response);
            });

    console.log("after");
}

function search_track_list()
{
    //Get the input value from the user
    let name = document.getElementById("search-input-list").value;
    let data = {"list_name": name};
    let ip_name = name;
    
    console.log("Ini Sort_type "+ip_name);
    var request = new Request(`http://localhost:1000/api/tracklist/${ip_name}`,
    {
        headers: new Headers({'Content-Type': 'application/json'}),
        method: 'GET'
    });

    console.log("before");
    fetch(request).then(response =>
        {
            if(response.ok)
            {
                console.log(response);
                return response.json();
            }
            
        }).then(response =>
            {
                user_list_data = response;
                console.log(response);
            });

    console.log("after");
}