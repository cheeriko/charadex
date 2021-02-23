// Sheet URL
let sheetUrl = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/" + sheetPage + "/public/values?alt=json";

// Dah Page URL
let pageURL = window.location.href;

// URL without any bits
let vanillaURL = pageURL.split('?')[0];

// Pulls ID from URL
let designID = pageURL.split('=')[1];

// All values from the google sheet will be
// pushed here to be called later on
let values = [];

// Calls JSON Data
$.getJSON(sheetUrl, function(data) {
  
  // Sorts through data
  $.each(data.feed.entry, function (index, value) {

    // Set up to create object
    let obj = {};

    for (let cell in value) {

      // Removes the cells that aren't needed
      if(
        cell !== "gsx$trsid" && 
        cell !== "id" && 
        cell !== "updated" && 
        cell !== "category" && 
        cell !== "title" && 
        cell !== "content" && 
        cell !== "link"
      ) {
        
        // Removes the gsx$ suffix from the cells being used
        let parseCell = cell.replace("gsx$", "");

        // Adds link into the object
        Object.assign(obj, {link: vanillaURL + "?id=" + obj["id"]}); 

        // Makes sure the values are in their right keys
        obj[parseCell] = value[cell].$t;

      }        
    }
    
    // Pushes new object to values variable
    values.push(obj);

  });

  // Checks if the page is trying to direct
  // to a card
  if (pageURL.includes('?id=')) {
    
    // Grabs the values you need for the card
    // So you don't have to put them in manually
    let itemArray = Object.keys(values[0]);
    // Replaces the 'image' in the array with something
    // that'll actually make it an image
    itemArray[2] = { name: 'image', attr: 'src' };

    // List.js options for the item
    let itemOptions = {
      valueNames: itemArray,
      item: 'charadex-card',
    };

    // Create List
    let charadexItem = new List('charadex-entry', itemOptions, values);

    // Searches for the correct item to display
    charadexItem.search(designID);

    // Hides the big gallery and the search
    $('#charadex-gallery').hide();

  }else{

    // Hides the single entry & shows the search
    $('#charadex-entry').hide();
    $('#search').show();

    // List.js Options
    let galleryOptions = {
      valueNames: [
        'id',
        'owner',
        'artist',
        'designer',
        { name: 'image', attr: 'src' },
        { name: 'link', attr: 'href' }
      ],
      item: 'charadex-item',
      page: numOfItems,
      pagination: [{
        innerWindow: 3,
        left: 2,
        right: 2,
        paginationClass: 'pagination-top',
      },{
        innerWindow: 3,
        left: 2,
        right: 2,
        paginationClass: 'pagination-bottom',
      }],
    };

    // Create List
    let charadex = new List('charadex-gallery', galleryOptions, values);
    charadex.sort('id',{order: order });

    // Force search to work outside list
    $('#search').on('keyup', function() {
      let searchString = $(this).val();
      charadex.search(searchString);
    });

    // Style pagination list items
    const bsStyle = () =>{
      $('.pagination > li').addClass('page-item');
      $('.pagination > li > a').addClass('page-link');
    }
    
    // Add prev & next
    const navButtons = () =>{
      $('.pagination').append('<li class="btn-next page-item"><a class="page-link"><i class="bi bi-chevron-right"></i></a></li>');
      $('.pagination').prepend('<li class="btn-prev page-item"><a class="page-link"><i class="bi bi-chevron-left"></i></a></li>');
      $('.btn-next').on('click', function(){$('.pagination .active').next().trigger('click');})
      $('.btn-prev').on('click', function(){$('.pagination .active').prev().trigger('click');})
    }
    
    // Calling Functions
    bsStyle();
    navButtons();

    // Shortcut function
    const forceStyle = () =>{
      bsStyle();
      if (!document.querySelector(".btn-next")){
        navButtons();
      }
    }

    // Force style on document changes
    $('.pagination').on('click', function(){forceStyle();});
    $(document.body).on('change keyup', '#search', function(event) {forceStyle();});

  }

});